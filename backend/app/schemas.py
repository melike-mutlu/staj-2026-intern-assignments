from datetime import datetime
from decimal import Decimal
from typing import Annotated, List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, PlainSerializer

from app.models import OrderStatus, PaymentStatus


Money = Annotated[
    Decimal,
    PlainSerializer(lambda value: float(value), return_type=float, when_used="json"),
]


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    is_active: bool
    created_at: datetime


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=120)


class TokenRefresh(BaseModel):
    refresh_token: str


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead


class MetaRead(BaseModel):
    app_name: str
    version: str
    environment: str
    docs_url: str
    openapi_url: str
    health: str


class ProblemDetails(BaseModel):
    type: str
    title: str
    status: int
    detail: str
    instance: str


class CategoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str


class ProductRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category_id: int
    name: str
    slug: str
    description: str
    price: Money
    stock: int
    rating: float
    image_url: str
    is_active: bool
    category: Optional[CategoryRead] = None


class ProductList(BaseModel):
    page: int
    size: int
    total: int
    items: List[ProductRead]


class FavoriteList(BaseModel):
    total: int
    items: List[ProductRead]


class AddressCreate(BaseModel):
    title: str = Field(min_length=2, max_length=60)
    city: str = Field(min_length=2, max_length=80)
    district: str = Field(min_length=2, max_length=80)
    line1: str = Field(min_length=5, max_length=255)
    postal_code: Optional[str] = Field(default=None, max_length=20)


class AddressUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=2, max_length=60)
    city: Optional[str] = Field(default=None, min_length=2, max_length=80)
    district: Optional[str] = Field(default=None, min_length=2, max_length=80)
    line1: Optional[str] = Field(default=None, min_length=5, max_length=255)
    postal_code: Optional[str] = Field(default=None, max_length=20)


class AddressRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    city: str
    district: str
    line1: str
    postal_code: Optional[str] = None


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0, le=20)


class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0, le=20)


class CartItemRead(BaseModel):
    product_id: int
    product_name: str
    slug: str
    image_url: str
    unit_price: Money
    quantity: int
    line_total: Money
    stock: int


class CartRead(BaseModel):
    items: List[CartItemRead]
    subtotal: Money


class CheckoutRequest(BaseModel):
    shipping_address_id: int
    payment_method: str = Field(default="simulation", pattern="^simulation$")


class OrderItemRead(BaseModel):
    product_id: int
    product_name: str
    unit_price: Money
    quantity: int
    line_total: Money


class OrderRead(BaseModel):
    id: int
    status: OrderStatus
    payment_status: PaymentStatus
    total_amount: Money
    shipping_address: str
    created_at: datetime
    items: List[OrderItemRead]
