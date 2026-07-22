import time
from collections import defaultdict, deque
from typing import Deque, Dict

from fastapi import Request, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.core.config import get_settings


RATE_LIMIT_STORE: Dict[str, Deque[float]] = defaultdict(deque)


def clear_rate_limit_store() -> None:
    RATE_LIMIT_STORE.clear()


class InMemoryRateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)

        settings = get_settings()
        now = time.monotonic()
        client_host = request.client.host if request.client else "unknown"
        client_requests = RATE_LIMIT_STORE[client_host]

        while client_requests and now - client_requests[0] > settings.rate_limit_window_seconds:
            client_requests.popleft()

        if len(client_requests) >= settings.rate_limit_requests:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                media_type="application/problem+json",
                content={
                    "type": "https://eticaret.local/problems/rate-limit-exceeded",
                    "title": "Rate Limit Exceeded",
                    "status": status.HTTP_429_TOO_MANY_REQUESTS,
                    "detail": "Too many requests. Please slow down and try again shortly.",
                    "instance": request.url.path,
                },
                headers={"Retry-After": str(settings.rate_limit_window_seconds)},
            )

        client_requests.append(now)
        return await call_next(request)
