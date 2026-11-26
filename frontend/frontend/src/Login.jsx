import { useState } from "react"; import { Link } from "react-router-dom"; import "./Login.css";
function Login() { const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [showPassword, setShowPassword] = useState(false);
function handleLogin(event) { event.preventDefault();
if (!email || !password) {
  alert("Пожалуйста, заполни все поля");
  return;
}

alert("Форма работает! Позже подключим вход через сервер.");
}
return ( <div className="login-page">
  <div className="login-left">
    <Link to="/" className="login-logo">
      BEAUTY HUB
    </Link>

    <div className="login-left-text">
      <p>
        Находи любимых мастеров и записывайся
        на beauty-процедуры легко и удобно.
      </p>
    </div>
  </div>

  <div className="login-right">

    <div className="login-top">
      Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
    </div>

    <div className="login-form-box">

      <span className="login-subtitle">
        РАДЫ ВИДЕТЬ ТЕБЯ СНОВА
      </span>

      <h1>С возвращением!</h1>

      <p className="login-description">
        Войди в свой аккаунт BEAUTY HUB,
        чтобы продолжить.
      </p>

      <form onSubmit={handleLogin}>

        <label>Электронная почта</label>
        <input
          type="email"
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Пароль</label>

        <div className="login-password">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Введи свой пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Скрыть" : "Показать"}
          </button>
        </div>

        <button type="submit" className="login-submit">
          Войти
        </button>

      </form>

      <p className="login-register">
        Ещё нет аккаунта?{" "}
        <Link to="/register">Зарегистрироваться</Link>
      </p>

      <Link to="/" className="login-back">
        ← Вернуться на главную
      </Link>

    </div>
  </div>
</div>
); 
}
export default Login;