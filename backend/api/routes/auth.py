from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import User
from services.auth_service import get_password_hash, verify_password, create_access_token
from api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str = ""

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
        
    hashed = get_password_hash(user_data.password)
    user = User(email=user_data.email, hashed_password=hashed, full_name=user_data.full_name)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user": {"email": user.email, "full_name": user.full_name}}

@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
        
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user": {"email": user.email, "full_name": user.full_name}}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    if not current_user:
        return {"authenticated": False, "email": "guest@industrial.com", "full_name": "Guest Analyst"}
    return {"authenticated": True, "email": current_user.email, "full_name": current_user.full_name}
