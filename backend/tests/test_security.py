def test_rate_limit_returns_problem_details_when_limit_is_exceeded(client):
    for _ in range(120):
        response = client.get("/health")
        assert response.status_code == 200

    response = client.get("/health")

    assert response.status_code == 429
    assert response.headers["content-type"].startswith("application/problem+json")
    assert response.headers["retry-after"] == "60"
    assert response.json()["title"] == "Rate Limit Exceeded"


def test_rate_limit_does_not_count_cors_preflight_requests(client):
    headers = {
        "Origin": "http://127.0.0.1:5173",
        "Access-Control-Request-Method": "GET",
    }

    for _ in range(121):
        response = client.options("/api/v1/products", headers=headers)
        assert response.status_code == 200

    assert client.get("/health").status_code == 200
