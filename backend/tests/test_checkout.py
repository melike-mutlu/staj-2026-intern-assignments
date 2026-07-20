def _register_and_authenticate(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "checkout@example.com",
            "full_name": "Checkout User",
            "password": "StrongPass123",
        },
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_user_can_checkout_cart_and_see_order_history(client):
    headers = _register_and_authenticate(client)

    address_response = client.post(
        "/api/v1/users/me/addresses",
        headers=headers,
        json={
            "title": "Ev",
            "city": "Istanbul",
            "district": "Besiktas",
            "line1": "Barbaros Bulvari No: 1",
            "postal_code": "34353",
        },
    )
    assert address_response.status_code == 201

    products = client.get("/api/v1/products", params={"q": "Nova"}).json()["items"]
    product_id = products[0]["id"]

    cart_response = client.post(
        "/api/v1/cart/items",
        headers=headers,
        json={"product_id": product_id, "quantity": 2},
    )
    assert cart_response.status_code == 201
    assert cart_response.json()["subtotal"] > 0

    checkout_response = client.post(
        "/api/v1/orders",
        headers=headers,
        json={"shipping_address_id": address_response.json()["id"], "payment_method": "simulation"},
    )
    assert checkout_response.status_code == 201
    order = checkout_response.json()
    assert order["status"] == "paid"
    assert order["payment_status"] == "simulated"
    assert order["items"][0]["quantity"] == 2

    empty_cart = client.get("/api/v1/cart", headers=headers)
    assert empty_cart.status_code == 200
    assert empty_cart.json()["items"] == []

    orders_response = client.get("/api/v1/orders", headers=headers)
    assert orders_response.status_code == 200
    assert len(orders_response.json()) == 1


def test_checkout_rejects_empty_cart(client):
    headers = _register_and_authenticate(client)
    address_response = client.post(
        "/api/v1/users/me/addresses",
        headers=headers,
        json={
            "title": "Ev",
            "city": "Istanbul",
            "district": "Besiktas",
            "line1": "Barbaros Bulvari No: 1",
        },
    )

    response = client.post(
        "/api/v1/orders",
        headers=headers,
        json={"shipping_address_id": address_response.json()["id"], "payment_method": "simulation"},
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Cart is empty"
