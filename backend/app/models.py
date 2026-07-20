from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel, UniqueConstraint


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class OrderStatus(str, Enum):
    pending = "pending"
    paid = "paid"
    shipped = "shipped"
    cancelled = "cancelled"


class PaymentStatus(str, Enum):
    simulated = "simulated"
    failed = "failed"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True, max_length=255)
    full_name: str = Field(max_length=120)
    hashed_password: str
    refresh_token_hash: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=utc_now)

    addresses: List["Address"] = Relationship(back_populates="user")
    cart_items: List["CartItem"] = Relationship(back_populates="user")
    favorites: List["Favorite"] = Relationship(back_populates="user")
    orders: List["Order"] = Relationship(back_populates="user")


class Address(SQLModel, table=True):
    __tablename__ = "addresses"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=60)
    city: str = Field(max_length=80)
    district: str = Field(max_length=80)
    line1: str = Field(max_length=255)
    postal_code: Optional[str] = Field(default=None, max_length=20)

    user: User = Relationship(back_populates="addresses")


class Category(SQLModel, table=True):
    __tablename__ = "categories"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=80)
    slug: str = Field(index=True, unique=True, max_length=90)

    products: List["Product"] = Relationship(back_populates="category")


class Product(SQLModel, table=True):
    __tablename__ = "products"

    id: Optional[int] = Field(default=None, primary_key=True)
    category_id: int = Field(foreign_key="categories.id", index=True)
    name: str = Field(index=True, max_length=140)
    slug: str = Field(index=True, unique=True, max_length=160)
    description: str
    price: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    stock: int = Field(ge=0)
    rating: float = Field(default=0, ge=0, le=5)
    image_url: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=utc_now)

    category: Category = Relationship(back_populates="products")
    cart_items: List["CartItem"] = Relationship(back_populates="product")
    favorites: List["Favorite"] = Relationship(back_populates="product")
    order_items: List["OrderItem"] = Relationship(back_populates="product")


class CartItem(SQLModel, table=True):
    __tablename__ = "cart_items"
    __table_args__ = (UniqueConstraint("user_id", "product_id", name="uq_cart_user_product"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    product_id: int = Field(foreign_key="products.id", index=True)
    quantity: int = Field(gt=0, le=20)
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)

    user: User = Relationship(back_populates="cart_items")
    product: Product = Relationship(back_populates="cart_items")


class Favorite(SQLModel, table=True):
    __tablename__ = "favorites"
    __table_args__ = (UniqueConstraint("user_id", "product_id", name="uq_favorite_user_product"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    product_id: int = Field(foreign_key="products.id", index=True)
    created_at: datetime = Field(default_factory=utc_now)

    user: User = Relationship(back_populates="favorites")
    product: Product = Relationship(back_populates="favorites")


class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    status: OrderStatus = Field(default=OrderStatus.paid)
    payment_status: PaymentStatus = Field(default=PaymentStatus.simulated)
    total_amount: Decimal = Field(ge=0, max_digits=12, decimal_places=2)
    shipping_address: str
    created_at: datetime = Field(default_factory=utc_now)

    user: User = Relationship(back_populates="orders")
    items: List["OrderItem"] = Relationship(back_populates="order")


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_items"

    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id", index=True)
    product_id: int = Field(foreign_key="products.id", index=True)
    product_name: str
    unit_price: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    quantity: int = Field(gt=0)
    line_total: Decimal = Field(ge=0, max_digits=12, decimal_places=2)

    order: Order = Relationship(back_populates="items")
    product: Product = Relationship(back_populates="order_items")
