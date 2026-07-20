def test_health_exposes_version_information(client):
    response = client.get("/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["app_name"] == "Eticaret API"
    assert body["version"]


def test_meta_endpoint_exposes_frontend_debug_links(client):
    response = client.get("/api/v1/meta")

    assert response.status_code == 200
    body = response.json()
    assert body["version"]
    assert body["docs_url"] == "/docs"
    assert body["openapi_url"] == "/openapi.json"
    assert body["health"] == "/health"
