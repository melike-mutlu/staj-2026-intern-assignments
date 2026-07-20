from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.dependencies import get_db_session
from app.models import Category
from app.schemas import CategoryRead


router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=List[CategoryRead])
def list_categories(session: Session = Depends(get_db_session)):
    return session.exec(select(Category).order_by(Category.name)).all()


@router.get("/{slug}", response_model=CategoryRead)
def get_category(slug: str, session: Session = Depends(get_db_session)):
    category = session.exec(select(Category).where(Category.slug == slug)).first()
    if category is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found")
    return category
