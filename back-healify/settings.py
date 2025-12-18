from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from pydantic_settings import BaseSettings
from sqlalchemy.orm import sessionmaker
import os

def get_engine(connect_url):
    engine = create_async_engine(
        connect_url,
        echo=True  # Логирование SQL-запросов
    )
    return engine

class DBSettings(BaseSettings):
    host: str
    port: int
    user: str
    password: str
    database: str

    @property
    def get_sync_connect_str(self) -> str:
        """Синхронное подключение"""
        return f"postgresql+psycopg2://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"

    @property
    def get_async_connect_str(self) -> str:
        """Асинхронное подключение"""
        return f"postgresql+asyncpg://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"

#//// другой файл
load_dotenv()
settings = DBSettings(
    host=os.getenv('POSTGRES_HOST'),
    port=os.getenv('POSTGRES_PORT'),
    user=os.getenv('POSTGRES_USER'),
    password=os.getenv('POSTGRES_PASSWORD'),
    database=os.getenv('POSTGRES_DB'),
)

engine = get_engine(settings.get_async_connect_str)
async_session_factory = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

