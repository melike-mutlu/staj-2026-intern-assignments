def test_product_listing_supports_search_filter_and_pagination(client):
    response = client.get("/api/v1/products", params={"page": 1, "size": 3, "q": "Nova"})

    assert response.status_code == 200
    body = response.json()
    assert body["page"] == 1
    assert body["size"] == 3
    assert body["total"] >= 1
    assert any(product["slug"] == "nova-x-pro" for product in body["items"])


def test_category_filter_returns_only_matching_products(client):
    response = client.get("/api/v1/products", params={"category": "aksesuar"})

    assert response.status_code == 200
    body = response.json()
    assert body["total"] >= 1
    assert all(product["category"]["slug"] == "aksesuar" for product in body["items"])


def test_product_detail_can_be_loaded_by_slug(client):
    response = client.get("/api/v1/products/nova-x-pro")

    assert response.status_code == 200
    assert response.json()["name"] == "Nova X Pro"
