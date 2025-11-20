from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import User
from schemas import UserCreate, UserOut, UserLogin, RefreshToken
from settings import async_session_factory
from auth import hash_password, verify_password, create_access_token, create_refresh_token, get_current_user


router = APIRouter(prefix="/auth", tags=["Auth"])

async def get_db() -> AsyncSession:
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()

@router.post("/register", response_model=UserOut)
async def register_user(data: UserCreate, db: AsyncSession = Depends(get_db)):

    q = select(User).where(User.email == data.email)
    existing = (await db.execute(q)).scalar_one_or_none()
    if existing:
        raise HTTPException(400, "User already exists")
    print("PASSWORD:", data.password, type(data.password))
    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password)
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user

@router.post("/login")
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    q = select(User).where(User.email == data.email)
    user = (await db.execute(q)).scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(400, "Incorrect email or password")

    access = create_access_token({"sub": str(user.id)})
    refresh = create_refresh_token({"sub": str(user.id)})

    return {
        "access_token": access,
        "refresh_token": refresh,
        "token_type": "bearer"
    }

from auth import decode_token

@router.post("/refresh")
async def refresh_token(data: RefreshToken):
    try:
        payload = decode_token(data.refresh_token)
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(401, "Invalid refresh token")

    new_access = create_access_token({"sub": user_id})
    new_refresh = create_refresh_token({"sub": user_id})
    return {"access_token": new_access, "refresh_token": new_refresh}

@router.get("/me")
async def get_me(user_id: int = Depends(get_current_user)):
    return {"user_id": user_id}
