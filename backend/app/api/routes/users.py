from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select

from app.dependencies import get_current_user, get_db_session
from app.models import Address, User
from app.schemas import AddressCreate, AddressRead, AddressUpdate, UserRead, UserUpdate


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserRead)
def update_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user


@router.get("/me/addresses", response_model=List[AddressRead])
def list_addresses(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    return session.exec(select(Address).where(Address.user_id == current_user.id)).all()


@router.post("/me/addresses", response_model=AddressRead, status_code=status.HTTP_201_CREATED)
def create_address(
    payload: AddressCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    address = Address(user_id=current_user.id, **payload.model_dump())
    session.add(address)
    session.commit()
    session.refresh(address)
    return address


@router.patch("/me/addresses/{address_id}", response_model=AddressRead)
def update_address(
    address_id: int,
    payload: AddressUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    address = session.exec(
        select(Address).where(Address.id == address_id, Address.user_id == current_user.id)
    ).first()
    if address is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Address not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(address, key, value)
    session.add(address)
    session.commit()
    session.refresh(address)
    return address


@router.delete("/me/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_address(
    address_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db_session),
):
    address = session.exec(
        select(Address).where(Address.id == address_id, Address.user_id == current_user.id)
    ).first()
    if address is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Address not found")
    session.delete(address)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
