import os
from datetime import datetime, timedelta, timezone
from functools import lru_cache
from typing import Literal

import jwt
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError
from pydantic import BaseModel, EmailStr, Field, field_validator
from pwdlib import PasswordHash
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL, make_url
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

load_dotenv()

app = FastAPI(title="BEAUTY HUB API", version="0.2.0")
# Адрес опубликованного сайта (например, https://beauty-hub.netlify.app) задаётся в FRONTEND_URL
FRONTEND_URL = os.getenv("FRONTEND_URL", "").rstrip("/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ] + ([FRONTEND_URL] if FRONTEND_URL else []),
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

password_hasher = PasswordHash.recommended()
security = HTTPBearer(auto_error=False)
DUMMY_HASH = password_hasher.hash("this-is-a-dummy-password")


@lru_cache
def database_engine():
    # В интернете (Render + Neon) база задаётся одной строкой DATABASE_URL
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        url = make_url(database_url).set(drivername="postgresql+psycopg")
        return create_engine(url, pool_pre_ping=True)

    required = ("DB_USER", "DB_PASSWORD", "DB_NAME")
    if any(not os.getenv(key) for key in required):
        raise ValueError("Заполните DB_USER, DB_PASSWORD и DB_NAME в .env")
    url = URL.create(
        drivername="postgresql+psycopg",
        username=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        database=os.environ["DB_NAME"],
    )
    return create_engine(url, pool_pre_ping=True)


def jwt_secret():
    secret = os.getenv("JWT_SECRET", "")
    if len(secret) < 32:
        raise HTTPException(
            status_code=503,
            detail="Добавьте безопасный JWT_SECRET (не меньше 32 символов) в backend/.env",
        )
    return secret


class RegisterInput(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: Literal["client", "master"]
    phone: str | None = Field(default=None, max_length=20)

    @field_validator("full_name")
    @classmethod
    def check_name(cls, value: str):
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Укажите имя и фамилию")
        return value


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    user_id: int
    full_name: str
    email: str
    role: Literal["client", "master"]


class AuthResult(BaseModel):
    access_token: str
    token_type: str
    user: UserPublic


def issue_token(user_id: int):
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": str(user_id),
            "iat": now,
            "exp": now + timedelta(minutes=60),
        },
        jwt_secret(),
        algorithm="HS256",
    )


def current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security)):
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Требуется вход")
    try:
        payload = jwt.decode(
            credentials.credentials,
            jwt_secret(),
            algorithms=["HS256"],
            options={"require": ["exp", "sub"]},
        )
        user_id = int(payload["sub"])
    except (InvalidTokenError, KeyError, ValueError, TypeError) as exc:
        raise HTTPException(status_code=401, detail="Недействительный или устаревший токен") from exc

    with database_engine().connect() as conn:
        user = conn.execute(
            text("SELECT user_id, full_name, email, role FROM users WHERE user_id = :id"),
            {"id": user_id},
        ).mappings().first()
    if user is None:
        raise HTTPException(status_code=401, detail="Аккаунт не найден")
    return dict(user)


@app.get("/")
def home():
    return {"message": "BEAUTY HUB backend работает!"}


@app.get("/db-check")
def check_database():
    try:
        with database_engine().connect() as conn:
            count = conn.execute(text("""
                SELECT COUNT(*) FROM information_schema.tables
                WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            """)).scalar_one()
        return {"database": "connected", "tables": count}
    except (ValueError, SQLAlchemyError, OSError) as exc:
        print(f"Database connection error: {type(exc).__name__}")
        raise HTTPException(status_code=503, detail="Проверьте подключение PostgreSQL и .env") from exc


@app.post("/auth/register", response_model=AuthResult, status_code=201)
def register(data: RegisterInput):
    jwt_secret()
    hashed_password = password_hasher.hash(data.password)
    try:
        with database_engine().begin() as conn:
            user = conn.execute(
                text("""
                    INSERT INTO users (full_name, email, password_hash, role, phone)
                    VALUES (:full_name, :email, :password_hash, :role, :phone)
                    RETURNING user_id, full_name, email, role
                """),
                {
                    "full_name": data.full_name,
                    "email": str(data.email).lower(),
                    "password_hash": hashed_password,
                    "role": data.role,
                    "phone": data.phone,
                },
            ).mappings().one()

            if data.role == "master":
                conn.execute(
                    text("""
                        INSERT INTO masters (user_id, specialization)
                        VALUES (:user_id, :specialization)
                    """),
                    {"user_id": user["user_id"], "specialization": "Мастер красоты"},
                )
    except IntegrityError as exc:
        raise HTTPException(status_code=409, detail="Такой email уже зарегистрирован") from exc
    except SQLAlchemyError as exc:
        print(f"Registration database error: {type(exc).__name__}")
        raise HTTPException(status_code=503, detail="Ошибка базы данных") from exc

    public_user = dict(user)
    return {
        "access_token": issue_token(public_user["user_id"]),
        "token_type": "bearer",
        "user": public_user,
    }


@app.post("/auth/login", response_model=AuthResult)
def login(data: LoginInput):
    jwt_secret()
    try:
        with database_engine().connect() as conn:
            user = conn.execute(
                text("""
                    SELECT user_id, full_name, email, role, password_hash
                    FROM users WHERE email = :email
                """),
                {"email": str(data.email).lower()},
            ).mappings().first()
    except SQLAlchemyError as exc:
        print(f"Login database error: {type(exc).__name__}")
        raise HTTPException(status_code=503, detail="Ошибка базы данных") from exc

    valid = password_hasher.verify(data.password, user["password_hash"] if user else DUMMY_HASH)
    if not user or not valid:
        raise HTTPException(status_code=401, detail="Неверная почта или пароль")
    public_user = {key: user[key] for key in ("user_id", "full_name", "email", "role")}
    return {
        "access_token": issue_token(public_user["user_id"]),
        "token_type": "bearer",
        "user": public_user,
    }


@app.get("/auth/me", response_model=UserPublic)
def me(user: dict = Depends(current_user)):
    return user
