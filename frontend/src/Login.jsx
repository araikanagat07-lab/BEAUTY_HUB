import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import { loginUser } from "./authApi";
import "./Login.css";
function Login() { const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
async function handleLogin(event) { event.preventDefault();
if (!email || !password) {
  setError("Пожалуйста, заполни все поля");
  return;
}

setError("");
setLoading(true);

try {
  // Проверяем почту и пароль на сервере FastAPI
  const result = await loginUser({ email, password });
  navigate(result.user.role === "master" ? "/master-dashboard" : "/client");
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
}
return ( <div className="login-page">
  <div className="login-left">
    <Link to="/" className="login-logo">
    </Link>

    <div className="login-left-text">
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

        {error && (
          <p style={{ color: "#b33b57", background: "#fbe9ec", padding: "10px 12px", borderRadius: "9px", fontSize: "13px" }}>
            {error}
          </p>
        )}

        <button type="submit" className="login-submit" disabled={loading}>
          {loading ? "Входим..." : "Войти"}
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