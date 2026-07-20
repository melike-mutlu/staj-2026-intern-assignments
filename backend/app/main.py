from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from app.api.router import api_router
from app.core.config import get_settings
from app.core.database import create_db_and_tables, engine
from app.core.errors import install_exception_handlers
from app.core.rate_limit import InMemoryRateLimitMiddleware
from app.schemas import MetaRead
from app.seed import seed_database

settings = get_settings()


@asynccontextmanager
async def lifespan(application: FastAPI):
    create_db_and_tables()
    with Session(engine) as session:
        seed_database(session)
    yield


def create_app() -> FastAPI:
    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="E-ticaret MVP icin auth, urun, sepet ve siparis API'si.",
        openapi_version="3.1.0",
        lifespan=lifespan,
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.add_middleware(InMemoryRateLimitMiddleware)
    install_exception_handlers(application)
    application.include_router(api_router)

    @application.get("/health", tags=["health"])
    def health_check():
        return {
            "status": "ok",
            "app_name": settings.app_name,
            "version": settings.app_version,
            "environment": settings.environment,
        }

    @application.get("/api/v1/meta", response_model=MetaRead, tags=["meta"])
    def meta():
        return MetaRead(
            app_name=settings.app_name,
            version=settings.app_version,
            environment=settings.environment,
            docs_url="/docs",
            openapi_url="/openapi.json",
            health="/health",
        )

    return application


app = create_app()
