import { useState } from "react"; import { Link } from "react-router-dom"; import "./Register.css";
function Register() { const [role, setRole] = useState("client"); const [error, setError] = useState("");
function handleSubmit(event) { event.preventDefault();
const form = new FormData(event.currentTarget);
const password = form.get("password");
const confirmPassword = form.get("confirmPassword");

if (password.length < 8) {
  setError("Пароль должен содержать минимум 8 символов.");
  return;
}

if (password !== confirmPassword) {
  setError("Пароли не совпадают.");
  return;
}

setError("");
alert("Данные заполнены правильно! Скоро подключим регистрацию к серверу.");
}
return ( <div className="register-page">
  {/* Левая часть с фотографией */}
  <div className="register-left">
    <div className="register-brand">
      BEAUTY<br />HUB
    </div>

    <div className="register-left-bottom">
      <p>
        Присоединяйся к BEAUTY HUB и находи
        своих любимых мастеров красоты.
      </p>
      <span>КРАСОТА • ЗАБОТА • ВДОХНОВЕНИЕ</span>
    </div>
  </div>

  {/* Правая часть с регистрацией */}
  <div className="register-right">

    <div className="register-top">
      Уже есть аккаунт?
      <Link to="/login">Войти</Link>
    </div>

    <div className="register-form-box">
      <span className="register-subtitle">
        СОЗДАЙ СВОЙ АККАУНТ
      </span>

      <h1>Добро пожаловать!</h1>

      <p className="register-description">
        Зарегистрируйся, чтобы находить мастеров
        и записываться онлайн.
      </p>

      <form onSubmit={handleSubmit}>
        <label>Имя и фамилия</label>
        <input
          name="name"
          type="text"
          placeholder="Как тебя зовут?"
          required
        />

        <label>Электронная почта</label>
        <input
          name="email"
          type="email"
          placeholder="example@mail.com"
          required
        />

        <label>Пароль</label>
        <input
          name="password"
          type="password"
          placeholder="Не менее 8 символов"
          required
        />

        <label>Повтори пароль</label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Введи пароль ещё раз"
          required
        />

        <p className="register-role-title">
          Я хочу зарегистрироваться как:
        </p>

        <div className="register-roles">
          <button
            type="button"
            className={role === "client" ? "register-role selected" : "register-role"}
            onClick={() => setRole("client")}
          >
            <span className="role-circle">
              {role === "client" ? "●" : "○"}
            </span>
            <span>
              <strong>Клиент</strong>
              <small>Искать мастеров</small>
            </span>
          </button>

          <button
            type="button"
            className={role === "master" ? "register-role selected" : "register-role"}
            onClick={() => setRole("master")}
          >
            <span className="role-circle">
              {role === "master" ? "●" : "○"}
            </span>
            <span>
              <strong>Мастер</strong>
              <small>Предлагать услуги</small>
            </span>
          </button>
        </div>

        {error && <p className="register-error">{error}</p>}

        <button type="submit" className="register-submit">
          Зарегистрироваться
        </button>
      </form>

      <p className="register-terms">
        Создавая аккаунт, ты принимаешь условия использования
      </p>
    </div>
  </div>
</div>
);
}
export default Register;