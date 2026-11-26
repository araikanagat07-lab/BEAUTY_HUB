import { Link } from "react-router-dom";
export default function CheckoutHeader({ label = "Профиль" }) {
  return (
    <header className="co-header">
      <Link to="/" className="co-logo">BEAUTY HUB</Link>
      <nav aria-label="Основное меню">
        <Link to="/">Главная</Link>
        <Link to="/services">Услуги</Link>
        <Link to="/masters">Мастера</Link>
        <Link to="/client">Мои записи</Link>
      </nav>
      <Link to="/client" className="co-header-pill">{label}</Link>
    </header>
  );
}
