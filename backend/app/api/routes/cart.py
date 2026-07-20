from datetime import datetime, timezone
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select

from app.dependencies import get_current_user, get_db_session
from app.core.money import to_money
from app.models import CartItem, Product, User
from app.schemas import CartItemCreate, CartItemRead, CartItemUpdate, CartRead


router = APIRouter(prefix="/cart", tags=["cart"])


def _cart_response(user_id: int, session: Session) -> CartRead:
    items = session.exec(select(CartItem).where(CartItem.user_id == user_id)).all()
    response_items = []
    for item in items:
        product = session.get(Product, item.product_id)
        if product is None:
            continue
        response_items.append(
            CartItemRead(
                product_id=product.id,
                product_name=product.name,
                slug=product.slug,
                image_url=product.image_url,
                unit_price=product.price,
                quantity=item.quantity,
                line_total=to_money(product.price * item.quantity),
                stock=product.stock,
            )
        )
    subtotal = to_money(sum((item.line_total for item in response_items), Decimal("0.00")))
    return CartRead(items=response_items, subtotal=subtotal)


@router.get("", response_model=CartRead)
def get_cart(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    return _cart_response(current_user.id, session)


@router.post("/items", response_model=CartRead, status_code=status.HTTP_201_CREATED)
def add_cart_item(
    payload: CartItemCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    product = session.get(Product, payload.product_id)
    if product is None or not product.is_active:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    if product.stock < payload.quantity:
        raise HTTPException(status.HTTP_409_CONFLICT, "Requested quantity exceeds stock")

    item = session.exec(
        select(CartItem).where(
            CartItem.user_id == current_user.id,
            CartItem.product_id == payload.product_id,
        )
    ).first()
    if item:
        next_quantity = item.quantity + payload.quantity
        if product.stock < next_quantity:
            raise HTTPException(status.HTTP_409_CONFLICT, "Requested quantity exceeds stock")
        item.quantity = next_quantity
        item.updated_at = datetime.now(timezone.utc)
    else:
        item = CartItem(
            user_id=current_user.id,
            product_id=payload.product_id,
            quantity=payload.quantity,
        )
    session.add(item)
    session.commit()
    return _cart_response(current_user.id, session)


@router.patch("/items/{product_id}", response_model=CartRead)
def update_cart_item(
    product_id: int,
    payload: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    item = session.exec(
        select(CartItem).where(CartItem.user_id == current_user.id, CartItem.product_id == product_id)
    ).first()
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Cart item not found")

    product = session.get(Product, product_id)
    if product is None or product.stock < payload.quantity:
        raise HTTPException(status.HTTP_409_CONFLICT, "Requested quantity exceeds stock")

    item.quantity = payload.quantity
    item.updated_at = datetime.now(timezone.utc)
    session.add(item)
    session.commit()
    return _cart_response(current_user.id, session)


@router.delete("/items/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cart_item(
    product_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    item = session.exec(
        select(CartItem).where(CartItem.user_id == current_user.id, CartItem.product_id == product_id)
    ).first()
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Cart item not found")
    session.delete(item)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    items = session.exec(select(CartItem).where(CartItem.user_id == current_user.id)).all()
    for item in items:
        session.delete(item)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
