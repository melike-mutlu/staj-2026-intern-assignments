import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.dependencies import get_db_session
from app.models import User
from app.schemas import AuthResponse, TokenRefresh, UserCreate, UserLogin


router = APIRouter(prefix="/auth", tags=["auth"])


def _auth_response(user: User, session: Session) -> AuthResponse:
    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))
    user.refresh_token_hash = hash_password(refresh_token)
    session.add(user)
    session.commit()
    session.refresh(user)
    return AuthResponse(access_token=access_token, refresh_token=refresh_token, user=user)


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, session: Session = Depends(get_db_session)):
    existing_user = session.exec(select(User).where(User.email == payload.email)).first()
    if existing_user:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return _auth_response(user, session)


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLogin, session: Session = Depends(get_db_session)):
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "User account is inactive")
    return _auth_response(user, session)


@router.post("/refresh", response_model=AuthResponse)
def refresh_token(payload: TokenRefresh, session: Session = Depends(get_db_session)):
    try:
        decoded = decode_token(payload.refresh_token)
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired refresh token")

    if decoded.get("type") != "refresh":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token type")

    user_id = decoded.get("sub")
    user = session.get(User, int(user_id)) if user_id else None
    if not user or not user.refresh_token_hash:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Refresh token is not recognized")
    if not verify_password(payload.refresh_token, user.refresh_token_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Refresh token has been rotated")

    return _auth_response(user, session)
