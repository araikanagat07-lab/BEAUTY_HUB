-- BEAUTY HUB: таблицы для регистрации и входа.
-- Выполнить в pgAdmin: база beauty_hub -> Query Tool -> вставить -> F5.
-- IF NOT EXISTS: если таблицы уже есть, ничего не сломается.

CREATE TABLE IF NOT EXISTS users (
    user_id       SERIAL PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    role          VARCHAR(10)  NOT NULL CHECK (role IN ('client', 'master')),
    phone         VARCHAR(20),
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS masters (
    master_id      SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    rating         NUMERIC(2, 1) NOT NULL DEFAULT 0
);

-- Проверка: кто зарегистрировался
-- SELECT user_id, full_name, email, role, created_at FROM users ORDER BY user_id DESC;
