from datetime import datetime
from uuid import uuid4, UUID

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, CheckConstraint
from typing import List, Optional

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    username: Mapped[str] = mapped_column(nullable=False, unique=True)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)


    created_at: Mapped[datetime] = mapped_column(default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.now, onupdate=datetime.now)
    description: Mapped[str] = mapped_column(nullable=True)

class Test(Base):
    __tablename__ = "test"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    descriptions: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    contents: Mapped[List["Content"]] = relationship(
        back_populates="test",
        cascade="all, delete-orphan"
    )
    transcription: Mapped[List["Transcript"]] = relationship(
        back_populates="test",
        cascade="all, delete-orphan"
    )


class Content(Base):
    __tablename__ = "content"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    test_id: Mapped[int] = mapped_column(
        ForeignKey("test.id", ondelete="CASCADE"),
        nullable=False
    )

    question_number: Mapped[int] = mapped_column(Integer, nullable=False)
    question: Mapped[str] = mapped_column(String, nullable=False)

    answer: Mapped[str] = mapped_column(
        String,
        CheckConstraint(
            "answer IN ("
            "'testFrequencyScale', "
            "'testYesNoAnswer', "
            "'reverseTestFrequencyScale', "
            "'reversedTestYesNoAnswer'"
            ")",
            name="check_answer_values"
        ),
        nullable=False
    )

    test: Mapped["Test"] = relationship(back_populates="contents")

class Transcript(Base):
    __tablename__ = "transcript"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    test_id: Mapped[int] = mapped_column(
        ForeignKey("test.id", ondelete="CASCADE"),
        nullable=False
    )
    min: Mapped[int] = mapped_column(Integer, nullable=False)
    max: Mapped[int] = mapped_column(Integer, nullable=False)
    descriptions: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    test: Mapped["Test"] = relationship(back_populates="transcription")