from typing import List
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.dependencies import get_current_user, get_db_session
from app.core.money import to_money
from app.models import Address, CartItem, Order, OrderItem, Product, User
from app.schemas import CheckoutRequest, OrderRead


router = APIRouter(prefix="/orders", tags=["orders"])


def _serialize_order(order: Order) -> OrderRead:
    return OrderRead(
        id=order.id,
        status=order.status,
        payment_status=order.payment_status,
        total_amount=order.total_amount,
        shipping_address=order.shipping_address,
        created_at=order.created_at,
        items=[
            {
                "product_id": item.product_id,
                "product_name": item.product_name,
                "unit_price": item.unit_price,
                "quantity": item.quantity,
                "line_total": item.line_total,
            }
            for item in order.items
        ],
    )


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    address = session.exec(
        select(Address).where(
            Address.id == payload.shipping_address_id,
            Address.user_id == current_user.id,
        )
    ).first()
    if address is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Shipping address not found")

    cart_items = session.exec(select(CartItem).where(CartItem.user_id == current_user.id)).all()
    if not cart_items:
        raise HTTPException(status.HTTP_409_CONFLICT, "Cart is empty")

    order_items = []
    total_amount = Decimal("0.00")
    for cart_item in cart_items:
        product = session.get(Product, cart_item.product_id)
        if product is None or not product.is_active:
            raise HTTPException(status.HTTP_409_CONFLICT, "Cart contains unavailable product")
        if product.stock < cart_item.quantity:
            raise HTTPException(status.HTTP_409_CONFLICT, f"{product.name} has insufficient stock")

        line_total = to_money(product.price * cart_item.quantity)
        total_amount += line_total
        order_items.append((cart_item, product, line_total))

    try:
        order = Order(
            user_id=current_user.id,
            total_amount=to_money(total_amount),
            shipping_address=(
                f"{address.title}: {address.line1}, {address.district}/{address.city}"
                + (f" {address.postal_code}" if address.postal_code else "")
            ),
        )
        session.add(order)
        session.flush()

        for cart_item, product, line_total in order_items:
            product.stock -= cart_item.quantity
            session.add(product)
            session.add(
                OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    product_name=product.name,
                    unit_price=product.price,
                    quantity=cart_item.quantity,
                    line_total=line_total,
                )
            )
            session.delete(cart_item)

        session.commit()
        session.refresh(order)
    except Exception:
        session.rollback()
        raise
    return _serialize_order(order)


@router.get("", response_model=List[OrderRead])
def list_orders(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    orders = session.exec(
        select(Order).where(Order.user_id == current_user.id).order_by(Order.created_at.desc())
    ).all()
    return [_serialize_order(order) for order in orders]


@router.get("/{order_id}", response_model=OrderRead)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    order = session.exec(
        select(Order).where(Order.id == order_id, Order.user_id == current_user.id)
    ).first()
    if order is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")
    return _serialize_order(order)
