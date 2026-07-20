def test_register_login_refresh_and_profile(client):
    register_response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "ayse@example.com",
            "full_name": "Ayse Yilmaz",
            "password": "StrongPass123",
        },
    )

    assert register_response.status_code == 201
    register_body = register_response.json()
    assert register_body["token_type"] == "bearer"
    assert register_body["user"]["email"] == "ayse@example.com"

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "ayse@example.com", "password": "StrongPass123"},
    )

    assert login_response.status_code == 200
    login_body = login_response.json()
    assert login_body["access_token"]

    profile_response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {login_body['access_token']}"},
    )

    assert profile_response.status_code == 200
    assert profile_response.json()["full_name"] == "Ayse Yilmaz"

    refresh_response = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": login_body["refresh_token"]},
    )

    assert refresh_response.status_code == 200
    assert refresh_response.json()["access_token"] != login_body["access_token"]


def test_register_rejects_duplicate_email(client):
    payload = {
        "email": "duplicate@example.com",
        "full_name": "Duplicate User",
        "password": "StrongPass123",
    }

    first_response = client.post("/api/v1/auth/register", json=payload)
    second_response = client.post("/api/v1/auth/register", json=payload)

    assert first_response.status_code == 201
    assert second_response.status_code == 409
    assert second_response.headers["content-type"].startswith("application/problem+json")
    assert second_response.json()["detail"] == "Email already registered"


def test_login_rejects_wrong_password(client):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "wrong-password@example.com",
            "full_name": "Wrong Password",
            "password": "StrongPass123",
        },
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "wrong-password@example.com", "password": "WrongPass123"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_refresh_token_is_rotated_after_use(client):
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "demo@eticaret.com", "password": "DemoPass123"},
    )
    first_refresh_token = login_response.json()["refresh_token"]

    refresh_response = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": first_refresh_token},
    )
    reused_refresh_response = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": first_refresh_token},
    )

    assert refresh_response.status_code == 200
    assert refresh_response.json()["refresh_token"] != first_refresh_token
    assert reused_refresh_response.status_code == 401
    assert reused_refresh_response.json()["detail"] == "Refresh token has been rotated"


def test_protected_routes_return_problem_details(client):
    response = client.get("/api/v1/cart")

    assert response.status_code == 401
    assert response.headers["content-type"].startswith("application/problem+json")
    assert response.json()["title"] == "Unauthorized"


def test_protected_routes_reject_invalid_access_token(client):
    response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": "Bearer invalid-token"},
    )

    assert response.status_code == 401
    assert response.headers["content-type"].startswith("application/problem+json")
    assert response.json()["detail"] == "Invalid or expired token"
