from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import Content, Test, Transcript
from schemas import TestWithContentsCreate, ContentRead, TestWithContent
from settings import async_session_factory
from sqlalchemy.orm import selectinload

router = APIRouter(prefix="/service", tags=["Serv"])

async def get_db() -> AsyncSession:
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()

@router.post("/tests_create")
async def create_test(
    data: TestWithContentsCreate,
    db: AsyncSession = Depends(get_db)
):
    #Создаём тест
    new_test = Test(
        name=data.test.name,
        descriptions=data.test.descriptions
    )

    db.add(new_test)
    await db.flush()

    #Создаём вопросы
    for c in data.contents:
        content_row = Content(
            test_id=new_test.id,
            question_number=c.question_number,
            question=c.question,
            answer=c.answer
        )
        db.add(content_row)

    #Создаем расшифровку
    for c in data.transcription:
        transcript_row = Transcript(
            test_id=new_test.id,
            descriptions=c.descriptions,
            min=c.min,
            max=c.max
        )
        db.add(transcript_row)

    #Сохраняем в БД
    await db.commit()
    await db.refresh(new_test)

    return {
        "status": "ok",
    }

@router.get("/test_contents", response_model=TestWithContent)
async def get_test_contents(
    test_id: int = Query(..., description="ID теста"),
    db: AsyncSession = Depends(get_db)
):

    result = await db.execute(
        select(Test)
        .options(selectinload(Test.contents),
                    selectinload(Test.transcription))
        .where(Test.id == test_id)
    )
    test_obj = result.scalar_one_or_none()

    if not test_obj:
        raise HTTPException(status_code=404, detail="Test not found")

    # формируем Pydantic объект
    return TestWithContent(
        id=test_obj.id,
        name=test_obj.name,
        descriptions=test_obj.descriptions,
        contents=test_obj.contents,
        transcription=test_obj.transcription
    )
