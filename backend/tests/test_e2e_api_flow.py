def test_full_backend_e2e_product_to_checkout_flow(client):
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "demo@eticaret.com", "password": "DemoPass123"},
    )
    assert login_response.status_code == 200
    headers = {"Authorization": f"Bearer {login_response.json()['access_token']}"}

    categories_response = client.get("/api/v1/categories")
    assert categories_response.status_code == 200
    assert len(categories_response.json()) >= 1

    products_response = client.get(
        "/api/v1/products",
        params={"page": 1, "size": 6, "category": "telefon"},
    )
    assert products_response.status_code == 200
    product = products_response.json()["items"][0]

    detail_response = client.get(f"/api/v1/products/{product['slug']}")
    assert detail_response.status_code == 200
    stock_before_checkout = detail_response.json()["stock"]

    cart_response = client.post(
        "/api/v1/cart/items",
        headers=headers,
        json={"product_id": product["id"], "quantity": 1},
    )
    assert cart_response.status_code == 201
    assert cart_response.json()["subtotal"] == product["price"]

    addresses_response = client.get("/api/v1/users/me/addresses", headers=headers)
    assert addresses_response.status_code == 200
    address_id = addresses_response.json()[0]["id"]

    checkout_response = client.post(
        "/api/v1/orders",
        headers=headers,
        json={"shipping_address_id": address_id, "payment_method": "simulation"},
    )
    assert checkout_response.status_code == 201
    order = checkout_response.json()
    assert order["status"] == "paid"
    assert order["total_amount"] == product["price"]

    orders_response = client.get("/api/v1/orders", headers=headers)
    assert orders_response.status_code == 200
    assert orders_response.json()[0]["id"] == order["id"]

    cart_after_checkout = client.get("/api/v1/cart", headers=headers)
    assert cart_after_checkout.status_code == 200
    assert cart_after_checkout.json()["items"] == []

    detail_after_checkout = client.get(f"/api/v1/products/{product['slug']}")
    assert detail_after_checkout.status_code == 200
    assert detail_after_checkout.json()["stock"] == stock_before_checkout - 1
