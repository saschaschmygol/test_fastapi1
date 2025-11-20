from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

# ----- Входные данные -----
class RefreshToken(BaseModel):
    refresh_token: str


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str               # обычный пароль — будет захеширован
    description: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ----- Выходные данные -----

class UserOut(BaseModel):
    id: UUID
    username: str
    email: str
    description: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True