import pytest
from httpx import ASGITransport, AsyncClient
from fastapi import status
from backend.main import app
from fastapi.responses import JSONResponse

# Assuming pytest-mock is installed and provides the 'mocker' fixture
MOCK_FUNCTION = "backend.services.auth_service.generate_auth0_login_url"


@pytest.mark.asyncio
async def test_login_handles_auth0_400(mocker):

    def mock_generate(*args, **kwargs):
        return JSONResponse(
            status_code=400, content={"detail": "Bad Request from Auth0"}
        )

    mocker.patch(
        MOCK_FUNCTION,
        side_effect=mock_generate,
        autospec=True,
    )
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/auth/login")
    assert response.status_code == 400
    assert "Bad Request" in response.text


@pytest.mark.asyncio
async def test_login_handles_auth0_401(mocker):

    def mock_generate(*args, **kwargs):
        return JSONResponse(
            status_code=401, content={"detail": "Unauthorized from Auth0"}
        )

    mocker.patch(
        MOCK_FUNCTION,
        side_effect=mock_generate,
        autospec=True,
    )
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/auth/login")
    assert response.status_code == 401
    assert "Unauthorized" in response.text


@pytest.mark.asyncio
async def test_login_handles_auth0_unavailable(mocker):
    mocker.patch(
        MOCK_FUNCTION,
        side_effect=Exception("Auth0 unavailable"),
        autospec=True,
    )
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/auth/login")
    assert response.status_code == 503 or response.status_code == 500
    assert "Auth0 unavailable" in response.text
