import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["JWT_SECRET"] = "test-secret"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

from app.dependencies import get_db_session
from app.main import app
from app.core.rate_limit import clear_rate_limit_store
from app.seed import seed_database


test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


def override_session():
    with Session(test_engine) as session:
        yield session


@pytest.fixture(autouse=True)
def reset_database():
    clear_rate_limit_store()
    SQLModel.metadata.create_all(test_engine)
    with Session(test_engine) as session:
        seed_database(session)
    yield
    SQLModel.metadata.drop_all(test_engine)
    clear_rate_limit_store()


@pytest.fixture()
def client():
    app.dependency_overrides[get_db_session] = override_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
