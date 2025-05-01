from fastapi import APIRouter, Depends, Request, status, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from backend.services.auth_service import oauth

auth_router = APIRouter(tags=["auth"])


@auth_router.get("/login")
async def login(request: Request):
    redirect_uri = str(request.url_for("auth_callback"))
    return await oauth.auth0.authorize_redirect(request, redirect_uri) # type: ignore


@auth_router.get("/callback")
async def auth_callback(request: Request):
    token = await oauth.auth0.authorize_access_token(request) # type: ignore
    user_info = token["userinfo"] # type: ignore
    print(user_info)
    request.session["user"] = {
        "name": user_info["name"],
        "email": user_info["email"],
    }
    return RedirectResponse("http://localhost:5173/home")
