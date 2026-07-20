from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlmodel import Session, select

from app.dependencies import get_db_session
from app.models import Category, Product
from app.schemas import ProductList, ProductRead


router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=ProductList)
def list_products(
    page: int = Query(default=1, ge=1),
    size: int = Query(default=12, ge=1, le=50),
    q: Optional[str] = Query(default=None, min_length=2),
    category: Optional[str] = None,
    min_price: Optional[float] = Query(default=None, alias="minPrice", ge=0),
    max_price: Optional[float] = Query(default=None, alias="maxPrice", ge=0),
    session: Session = Depends(get_db_session),
):
    conditions = [Product.is_active == True]  # noqa: E712
    if q:
        conditions.append(Product.name.ilike(f"%{q}%"))
    if category:
        category_row = session.exec(select(Category).where(Category.slug == category)).first()
        if category_row is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found")
        conditions.append(Product.category_id == category_row.id)
    if min_price is not None:
        conditions.append(Product.price >= min_price)
    if max_price is not None:
        conditions.append(Product.price <= max_price)

    total = session.exec(select(func.count()).select_from(Product).where(*conditions)).one()
    products = session.exec(
        select(Product)
        .where(*conditions)
        .order_by(Product.created_at.desc())
        .offset((page - 1) * size)
        .limit(size)
    ).all()

    return ProductList(page=page, size=size, total=total, items=products)


@router.get("/{identifier}", response_model=ProductRead)
def get_product(identifier: str, session: Session = Depends(get_db_session)):
    product = None
    if identifier.isdigit():
        product = session.get(Product, int(identifier))
    if product is None:
        product = session.exec(select(Product).where(Product.slug == identifier)).first()
    if product is None or not product.is_active:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    return product
