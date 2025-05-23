##backend/app/routes/auth_routes.py
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from app.auth.cognito import sign_up_user, confirm_sign_up, login_user

router = APIRouter()

class SignUpRequest(BaseModel):
    username: str
    password: str
    email: EmailStr

class ConfirmSignUpRequest(BaseModel):
    username: str
    confirmation_code: str

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/signup")
def signup(data: SignUpRequest):
    sign_up_user(data.username, data.password, data.email)
    return {"message": "User signed up successfully. Please confirm your email."}

@router.post("/confirm-signup")
def confirm_signup(data: ConfirmSignUpRequest):
    confirm_sign_up(data.username, data.confirmation_code)
    return {"message": "User confirmed successfully."}

@router.post("/login")
def login(data: LoginRequest):
    auth_result = login_user(data.username, data.password)
    return {
        "access_token": auth_result["AccessToken"],
        "id_token": auth_result["IdToken"],
        "refresh_token": auth_result.get("RefreshToken"),
        "expires_in": auth_result["ExpiresIn"],
        "token_type": auth_result["TokenType"]
    }
