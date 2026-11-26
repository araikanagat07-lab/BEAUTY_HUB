from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="BEAUTY HUB API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


def database_engine():
    required = ["DB_USER", "DB_PASSWORD", "DB_NAME"]
    if any(not os.getenv(key) for key in required):
        raise ValueError("Заполните DB_USER, DB_PASSWORD и DB_NAME в файле .env")

    url = URL.create(
        drivername="postgresql+psycopg",
        username=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        database=os.environ["DB_NAME"],
    )
    return create_engine(url, pool_pre_ping=True)


@app.get("/")
def home():
    return {"message": "BEAUTY HUB backend работает!"}


@app.get("/db-check")
def check_database():
    try:
        engine = database_engine()
        with engine.connect() as conn:
            count = conn.execute(text("""
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            """)).scalar_one()
        engine.dispose()
        return {"database": "connected", "tables": count}
    except (ValueError, SQLAlchemyError, OSError) as exc:
        print(f"Database connection error: {type(exc).__name__}")
        raise HTTPException(status_code=503, detail="Нет подключения к PostgreSQL. Проверьте .env и запущен ли сервер.") from exc
