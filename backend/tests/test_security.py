def test_rate_limit_returns_problem_details_when_limit_is_exceeded(client):
    for _ in range(120):
        response = client.get("/health")
        assert response.status_code == 200

    response = client.get("/health")

    assert response.status_code == 429
    assert response.headers["content-type"].startswith("application/problem+json")
    assert response.headers["retry-after"] == "60"
    assert response.json()["title"] == "Rate Limit Exceeded"
