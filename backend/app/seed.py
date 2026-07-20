from sqlmodel import Session, select

from app.core.security import hash_password
from app.models import Address, Category, Product, User


SEED_CATEGORIES = [
    {"name": "Telefon", "slug": "telefon"},
    {"name": "Bilgisayar", "slug": "bilgisayar"},
    {"name": "Aksesuar", "slug": "aksesuar"},
]


SEED_PRODUCTS = [
    {
        "category_slug": "telefon",
        "name": "Nova X Pro",
        "slug": "nova-x-pro",
        "description": "120Hz ekran, 256GB depolama ve uzun pil omru.",
        "price": "32999.90",
        "stock": 12,
        "rating": 4.7,
        "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    },
    {
        "category_slug": "telefon",
        "name": "Pixel Lite 8",
        "slug": "pixel-lite-8",
        "description": "Kompakt tasarimli, guclu kamera odakli akilli telefon.",
        "price": "21999.00",
        "stock": 18,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1598327105666-5b89351aff97",
    },
    {
        "category_slug": "bilgisayar",
        "name": "AtlasBook Air 14",
        "slug": "atlasbook-air-14",
        "description": "Hafif govde, 16GB RAM ve 512GB SSD ile gunluk performans.",
        "price": "44999.00",
        "stock": 8,
        "rating": 4.8,
        "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    },
    {
        "category_slug": "bilgisayar",
        "name": "Forge Gaming 16",
        "slug": "forge-gaming-16",
        "description": "RTX grafik karti ve yuksek tazeleme hizli ekran.",
        "price": "68999.50",
        "stock": 5,
        "rating": 4.6,
        "image_url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
    },
    {
        "category_slug": "aksesuar",
        "name": "Pulse ANC Kulaklik",
        "slug": "pulse-anc-kulaklik",
        "description": "Aktif gurultu engelleme ve 40 saat pil omru.",
        "price": "5499.90",
        "stock": 25,
        "rating": 4.4,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    },
    {
        "category_slug": "aksesuar",
        "name": "SwiftCharge 65W",
        "slug": "swiftcharge-65w",
        "description": "Telefon, tablet ve laptop icin kompakt hizli sarj adaptoru.",
        "price": "1299.00",
        "stock": 40,
        "rating": 4.3,
        "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
    },
]


def seed_database(session: Session) -> None:
    categories_by_slug = {}
    for item in SEED_CATEGORIES:
        category = session.exec(select(Category).where(Category.slug == item["slug"])).first()
        if category is None:
            category = Category(**item)
            session.add(category)
            session.commit()
            session.refresh(category)
        categories_by_slug[category.slug] = category

    for item in SEED_PRODUCTS:
        product = session.exec(select(Product).where(Product.slug == item["slug"])).first()
        if product is not None:
            continue
        category = categories_by_slug[item["category_slug"]]
        payload = {key: value for key, value in item.items() if key != "category_slug"}
        session.add(Product(category_id=category.id, **payload))

    demo_user = session.exec(select(User).where(User.email == "demo@eticaret.com")).first()
    if demo_user is None:
        demo_user = User(
            email="demo@eticaret.com",
            full_name="Demo Kullanici",
            hashed_password=hash_password("DemoPass123"),
        )
        session.add(demo_user)
        session.commit()
        session.refresh(demo_user)
        session.add(
            Address(
                user_id=demo_user.id,
                title="Ev",
                city="Istanbul",
                district="Kadikoy",
                line1="Moda Caddesi No: 10",
                postal_code="34710",
            )
        )
    else:
        demo_user.hashed_password = hash_password("DemoPass123")
        session.add(demo_user)

    session.commit()
