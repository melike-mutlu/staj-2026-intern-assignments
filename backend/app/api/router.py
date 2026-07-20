from fastapi import APIRouter

from app.api.routes import auth, cart, categories, favorites, orders, products, users
from app.schemas import ProblemDetails


problem_responses = {
    401: {"model": ProblemDetails, "description": "Authentication failed or token is missing"},
    404: {"model": ProblemDetails, "description": "Requested resource was not found"},
    409: {"model": ProblemDetails, "description": "Business rule conflict"},
    429: {"model": ProblemDetails, "description": "Rate limit exceeded"},
}


api_router = APIRouter(prefix="/api/v1", responses=problem_responses)
api_router.include_router(auth.router)
api_router.include_router(categories.router)
api_router.include_router(products.router)
api_router.include_router(favorites.router)
api_router.include_router(cart.router)
api_router.include_router(orders.router)
api_router.include_router(users.router)
