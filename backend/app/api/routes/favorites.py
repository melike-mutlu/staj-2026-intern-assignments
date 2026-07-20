from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select

from app.dependencies import get_current_user, get_db_session
from app.models import Favorite, Product, User
from app.schemas import FavoriteList


router = APIRouter(prefix="/favorites", tags=["favorites"])


def _favorite_response(user_id: int, session: Session) -> FavoriteList:
    products = session.exec(
        select(Product)
        .join(Favorite, Favorite.product_id == Product.id)
        .where(Favorite.user_id == user_id, Product.is_active == True)  # noqa: E712
        .order_by(Favorite.created_at.desc())
    ).all()
    return FavoriteList(total=len(products), items=products)


@router.get("", response_model=FavoriteList)
def list_favorites(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    return _favorite_response(current_user.id, session)


@router.post("/{product_id}", response_model=FavoriteList, status_code=status.HTTP_201_CREATED)
def add_favorite(
    product_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    product = session.get(Product, product_id)
    if product is None or not product.is_active:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")

    existing_favorite = session.exec(
        select(Favorite).where(Favorite.user_id == current_user.id, Favorite.product_id == product_id)
    ).first()
    if existing_favorite is None:
        session.add(Favorite(user_id=current_user.id, product_id=product_id))
        session.commit()

    return _favorite_response(current_user.id, session)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_favorite(
    product_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    favorite = session.exec(
        select(Favorite).where(Favorite.user_id == current_user.id, Favorite.product_id == product_id)
    ).first()
    if favorite is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Favorite not found")

    session.delete(favorite)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
