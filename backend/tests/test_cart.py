def _headers(client, email="cart@example.com"):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "full_name": "Cart User",
            "password": "StrongPass123",
        },
    )
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def _first_product(client, query="Nova"):
    response = client.get("/api/v1/products", params={"q": query})
    assert response.status_code == 200
    return response.json()["items"][0]


def test_cart_item_can_be_added_updated_and_deleted(client):
    headers = _headers(client)
    product = _first_product(client)

    add_response = client.post(
        "/api/v1/cart/items",
        headers=headers,
        json={"product_id": product["id"], "quantity": 1},
    )
    assert add_response.status_code == 201
    assert add_response.json()["items"][0]["quantity"] == 1

    update_response = client.patch(
        f"/api/v1/cart/items/{product['id']}",
        headers=headers,
        json={"quantity": 3},
    )
    assert update_response.status_code == 200
    assert update_response.json()["items"][0]["quantity"] == 3

    delete_response = client.delete(f"/api/v1/cart/items/{product['id']}", headers=headers)
    assert delete_response.status_code == 204

    cart_response = client.get("/api/v1/cart", headers=headers)
    assert cart_response.status_code == 200
    assert cart_response.json()["items"] == []
    assert cart_response.json()["subtotal"] == 0


def test_cart_rejects_quantity_above_stock(client):
    headers = _headers(client, email="stock@example.com")
    product = _first_product(client)

    response = client.post(
        "/api/v1/cart/items",
        headers=headers,
        json={"product_id": product["id"], "quantity": product["stock"] + 1},
    )

    assert response.status_code == 409
    assert response.headers["content-type"].startswith("application/problem+json")
    assert response.json()["detail"] == "Requested quantity exceeds stock"


def test_cart_update_rejects_missing_item(client):
    headers = _headers(client, email="missing-cart-item@example.com")
    product = _first_product(client)

    response = client.patch(
        f"/api/v1/cart/items/{product['id']}",
        headers=headers,
        json={"quantity": 2},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Cart item not found"
