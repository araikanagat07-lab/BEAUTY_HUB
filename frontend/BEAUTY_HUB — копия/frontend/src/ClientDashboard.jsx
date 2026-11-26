import { Link } from "react-router-dom";
import "./ClientDashboard.css";
const bookings = [

  {
    id: 1,
    master: "Алина С.",
    service: "Маникюр с покрытием",
    date: "1 ноября, 15:00",
    status: "Подтверждено",
    image: "/images/alina.jpg",
  },

  {
    id: 2,
    master: "Диана К.",
    service: "Вечерний макияж",
    date: "19 ноября, 12:00",
    status: "Ожидает",
    image: "/images/diana.jpg",
  },
];

function ClientDashboard() {
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

        <div className="client-header-user">
          <span className="client-user-avatar">А</span>
          Аружан М.
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
          <a href="#client-actions">● История посещений</a>
          <a href="#client-actions">● Отзывы</a>
          <a href="#client-actions">● Настройки</a>

          <Link to="/login" className="client-logout">
            Выйти из аккаунта
          </Link>
        </aside>

        <div className="client-content" id="client-profile">
          <h1>Привет, Аружан!</h1>
          <p className="client-subtitle">
    
          </p>

          <section className="client-next-booking">
            <small>БЛИЖАЙШАЯ ЗАПИСЬ</small>
            <h2>Маникюр с покрытием</h2>
            <p>Мастер Алина С. • 1 ноября, 14:00</p>

            <span className="client-status confirmed">
              Подтверждено
            </span>

            <Link to="/masters/1" className="client-details-button">
              Подробнее
            </Link>
          </section>

          <div className="client-section-heading" id="client-bookings">
            <h2>Мои записи</h2>
            <span>Смотреть все →</span>
          </div>

          <div className="client-booking-list">
            {bookings.map((booking) => (
              <article className="client-booking" key={booking.id}>
                <img src={booking.image} alt={booking.master} />
                <div className="client-booking-info">
                  <h3>{booking.service}</h3>

                  <p>
                    {booking.master} • {booking.date}
                  </p>
                </div>

                <span
                  className={
                    booking.status === "Подтверждено"
                      ? "client-status confirmed"
                      : "client-status pending"
                  }
                >
                  {booking.status}
                </span>
                <Link to={`/masters/${booking.id}`}>
                  Подробнее ›
                </Link>

              </article>
            ))}

          </div>
          <h2 className="client-actions-title" id="client-actions">
            Быстрые действия
          </h2>

          <div className="client-quick-actions">
            <Link to="/masters">● Найти мастера</Link>
            <Link to="/masters">● Мои избранные</Link>
            <Link to="/services">● Оставить отзыв</Link>
          </div>

        </div>

      </main>

    </div>
  );
}

export default ClientDashboard;