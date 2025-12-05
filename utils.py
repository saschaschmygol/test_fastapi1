from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import Test
from schemas import TestWithContent
from sqlalchemy.orm import selectinload


async def load_test_contents(test_id: int, db: AsyncSession) -> TestWithContent:
    result = await db.execute(
        select(Test)
        .options(selectinload(Test.contents),
                 selectinload(Test.transcription))
        .where(Test.id == test_id)
    )
    test_obj = result.scalar_one_or_none()

    if not test_obj:
        raise HTTPException(status_code=404, detail="Test not found")

    return TestWithContent(
        id=test_obj.id,
        name=test_obj.name,
        descriptions=test_obj.descriptions,
        contents=test_obj.contents,
        transcription=test_obj.transcription
    )