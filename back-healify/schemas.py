from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional, List, Literal

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

AnswerType = Literal[
    "testFrequencyScale",
    "testYesNoAnswer",
    "reverseTestFrequencyScale",
    "reversedTestYesNoAnswer",
]

class TestCreate(BaseModel):
    name: str
    descriptions: Optional[str] = None

class ContentCreate(BaseModel):
    test_id: int
    question_number: int
    question: str
    answer: AnswerType

class TranscriptCreate(BaseModel):
    test_id: int
    min: int
    max: int
    descriptions: str

class TranscriptRead(BaseModel):
    test_id: int
    min: int
    max: int
    descriptions: str

    class Config:
        from_attributes = True


class ContentRead(BaseModel):
    id: int
    test_id: int
    question_number: int
    question: str
    answer: AnswerType

    class Config:
        from_attributes = True

class TestWithContentsCreate(BaseModel):
    test: TestCreate
    contents: List[ContentCreate]
    transcription: List[TranscriptCreate]

    class Config:
        from_attributes = True

class TestWithContent(BaseModel):
    id: int
    name: str
    descriptions: Optional[str] = None
    transcription: List[TranscriptRead]
    contents: List[ContentRead]

    class Config:
        from_attributes = True