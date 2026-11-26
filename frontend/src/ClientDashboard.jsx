import { Link } from "react-router-dom";
import "./ClientDashboard.css";
import { NotificationBell } from "./components/Layouts";
import { getClientName, firstName, logout } from "./currentUser";
import { getClientUpcoming } from "./historyData";
import { formatDate, formatPrice } from "./mastersData";
const statusText = { pending: "Ожидает", confirmed: "Подтверждено" };

function whenText(booking) {
  return `${formatDate(booking.date, { day: "numeric", month: "long" })}, ${booking.time}`;
}

function ClientDashboard() {
  const userName = getClientName();
  const bookings = getClientUpcoming(); // реальные записи этого аккаунта
  const next = bookings[0];
  return (
    <div className="client-page">
      <header className="client-header">
        <Link to="/" className="client-logo">BEAUTY HUB</Link>
        <nav>
          <Link to="/">Главная</Link>
          <Link to="/services">Услуги</Link>
          <Link to="/masters">Мастера</Link>
          <Link to="/#about">О нас</Link>
        </nav>

        <div className="w6-header-right">
          <NotificationBell audience="client" />
          <div className="client-header-user">
            <span className="client-user-avatar">{userName[0]}</span>
            {userName}
          </div>
        </div>
      </header>

      <main className="client-layout">
        <aside className="client-sidebar">
          <small>ЛИЧНЫЙ КАБИНЕТ</small>

          <a href="#client-profile" className="active">
            ● Мой профиль
          </a>
          <a href="#client-bookings">● Мои записи</a>
          <a href="#client-actions">● Избранное</a>
          <Link to="/client/history">● История посещений</Link>
          <Link to="/client/history">● Отзывы</Link>
          <Link to="/notifications">● Уведомления</Link>
          <a href="#client-actions">● Настройки</a>

          <Link to="/login" className="client-logout" onClick={logout}>
            Выйти из аккаунта
          </Link>
        </aside>

        <div className="client-content" id="client-profile">
          <h1>Привет, {firstName(userName)}!</h1>
          <p className="client-subtitle">
    
          </p>

          {next ? (
            <section className="client-next-booking">
              <small>БЛИЖАЙШАЯ ЗАПИСЬ</small>
              <h2>{next.service}</h2>
              <p>Мастер {next.masterName} • {whenText(next)}</p>

              <span className={`client-status ${next.status}`}>
                {statusText[next.status]}
              </span>

              <Link to={`/booking-cancel/${next.id}`} className="client-details-button">
                Подробнее
              </Link>
            </section>
          ) : (
            <section className="client-next-booking">
              <small>БЛИЖАЙШАЯ ЗАПИСЬ</small>
              <h2>У вас пока нет записей</h2>
              <p>Выберите мастера и запишитесь онлайн за пару минут.</p>

              <Link to="/masters" className="client-details-button">
                Найти мастера
              </Link>
            </section>
          )}

          <div className="client-section-heading" id="client-bookings">
            <h2>Мои записи</h2>
            <Link to="/client/history" className="w6-link">История посещений →</Link>
          </div>

          <div className="client-booking-list">
            {bookings.map((booking) => (
              <article className="client-booking" key={booking.id}>
                <img src={`/images/${booking.masterImage}`} alt={booking.masterName} />
                <div className="client-booking-info">
                  <h3>{booking.service}</h3>
                  <p>
                    {booking.masterName} • {whenText(booking)} • {formatPrice(booking.total ?? booking.price)}
                  </p>
                </div>

                <span className={`client-status ${booking.status}`}>
                  {statusText[booking.status]}
                </span>
                <Link to={`/booking-cancel/${booking.id}`}>
                  Подробнее ›
                </Link>
              </article>
            ))}

            {bookings.length === 0 && (
              <p className="w6-empty">Предстоящих записей нет.</p>
            )}
          </div>
          <h2 className="client-actions-title" id="client-actions">
            Быстрые действия
          </h2>

          <div className="client-quick-actions">
            <Link to="/masters">● Найти мастера</Link>
            <Link to="/masters">● Мои избранные</Link>
            <Link to="/client/history">● Оставить отзыв</Link>
          </div>

        </div>

      </main>

    </div>
  );
}

export default ClientDashboard;