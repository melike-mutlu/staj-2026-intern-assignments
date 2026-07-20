def _headers(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "favorites@example.com",
            "full_name": "Favorites User",
            "password": "StrongPass123",
        },
    )
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def _product_id(client):
    response = client.get("/api/v1/products", params={"q": "Nova"})
    assert response.status_code == 200
    return response.json()["items"][0]["id"]


def test_user_can_add_list_and_delete_favorite(client):
    headers = _headers(client)
    product_id = _product_id(client)

    add_response = client.post(f"/api/v1/favorites/{product_id}", headers=headers)
    assert add_response.status_code == 201
    assert add_response.json()["total"] == 1
    assert add_response.json()["items"][0]["id"] == product_id

    duplicate_response = client.post(f"/api/v1/favorites/{product_id}", headers=headers)
    assert duplicate_response.status_code == 201
    assert duplicate_response.json()["total"] == 1

    list_response = client.get("/api/v1/favorites", headers=headers)
    assert list_response.status_code == 200
    assert list_response.json()["total"] == 1

    delete_response = client.delete(f"/api/v1/favorites/{product_id}", headers=headers)
    assert delete_response.status_code == 204

    empty_response = client.get("/api/v1/favorites", headers=headers)
    assert empty_response.status_code == 200
    assert empty_response.json()["items"] == []


def test_favorites_require_authentication(client):
    response = client.get("/api/v1/favorites")

    assert response.status_code == 401
    assert response.headers["content-type"].startswith("application/problem+json")


def test_favorite_rejects_unknown_product(client):
    headers = _headers(client)

    response = client.post("/api/v1/favorites/99999", headers=headers)

    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"
