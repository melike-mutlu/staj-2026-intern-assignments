from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


PROBLEM_TYPE_BASE = "https://eticaret.local/problems"


def problem_response(status_code: int, title: str, detail: str, instance: str):
    return JSONResponse(
        status_code=status_code,
        media_type="application/problem+json",
        content={
            "type": f"{PROBLEM_TYPE_BASE}/{title.lower().replace(' ', '-')}",
            "title": title,
            "status": status_code,
            "detail": detail,
            "instance": instance,
        },
    )


async def http_exception_handler(request: Request, exc: HTTPException):
    title = "Request failed"
    if exc.status_code == status.HTTP_401_UNAUTHORIZED:
        title = "Unauthorized"
    elif exc.status_code == status.HTTP_403_FORBIDDEN:
        title = "Forbidden"
    elif exc.status_code == status.HTTP_404_NOT_FOUND:
        title = "Not Found"
    elif exc.status_code == status.HTTP_409_CONFLICT:
        title = "Conflict"
    elif exc.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY:
        title = "Validation Error"

    return problem_response(exc.status_code, title, str(exc.detail), str(request.url.path))


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return problem_response(
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "Validation Error",
        str(exc.errors()),
        str(request.url.path),
    )


def install_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
