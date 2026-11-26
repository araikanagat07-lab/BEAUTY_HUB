import { useState } from "react"; 
import { Link, useParams, useLocation } from "react-router-dom"; 
import { getBookings, changeBookingStatus } from "./bookingStore"; 
import "./Booking.css";

function BookingCancel() { 
    const { id } = useParams(); 
    const location = useLocation();

    const [booking, setBooking] = useState( 
        () => getBookings().find((item) => item.id === id) 
    );

    const [message, setMessage] = useState( 
        location.state?.justBooked ? "Запись успешно создана!" : "" 
    );

    if (!booking) { 
      return ( 
        <div className="bh-message"> 
        <h2>Запись не найдена</h2> 
        <Link to="/masters">Вернуться к мастерам</Link> 
        </div> 
        ); 
    }

    function cancelBooking() { 
        const success = changeBookingStatus(id, "cancelled");

        if (success) {
            setBooking(getBookings().find((item) => item.id === id));
            setMessage("Запись успешно отменена. Время снова доступно.");
        } else {
            setMessage("Не удалось изменить статус записи.");

        }

    }

    const dateText = new Date(`${booking.date}T12:00:00`) 
      .toLocaleDateString("ru-RU", { 
        day: "numeric", 
        month: "long", 
        year: "numeric",
    });

return ( 
<div className="bh-page"> 
<header className="bh-header"> 
<Link to="/" className="bh-logo">BEAUTY HUB</Link>
    <nav>
      <Link to="/">Главная</Link>
      <Link to="/services">Услуги</Link>
      <Link to="/masters">Мастера</Link>
      <Link to="/#about">О нас</Link>
    </nav>

    <Link to="/client" className="bh-header-button">
      Мой кабинет
    </Link>
  </header>

  <main className="bh-cancel-main">
    <h1>Отмена записи</h1>
    <p className="bh-muted">
      Управление вашим бронированием
    </p>

    <section className="bh-cancel-card">
      {message && (
        <div className="bh-notification">{message}</div>
      )}

      {booking.status !== "cancelled" ? (
        <div className="bh-cancel-question">
          Вы уверены, что хотите отменить запись?
        </div>
      ) : (
        <div className="bh-cancel-question">
          Запись отменена
        </div>
      )}

      <h2>Информация о записи</h2>

      <div className="bh-cancel-details">
        <div>
          <span>Мастер</span>
          <strong>{booking.masterName}</strong>
        </div>

        <div>
          <span>Услуга</span>
          <strong>{booking.service}</strong>
        </div>

        <div>
          <span>Дата</span>
          <strong>{dateText}</strong>
        </div>

        <div>
          <span>Время</span>
          <strong>{booking.time}</strong>
        </div>

        <div>
          <span>Стоимость</span>
          <strong>
            {booking.price.toLocaleString("ru-RU")} ₸
          </strong>
        </div>

        <div>
          <span>Статус</span>
          <strong>
            {booking.status === "pending"
              ? "Ожидает подтверждения"
              : booking.status === "confirmed"
              ? "Подтверждена"
              : "Отменена"}
          </strong>
        </div>
      </div>

      <p className="bh-cancel-hint">
        После отмены выбранное время снова станет доступным.
      </p>

      <div className="bh-cancel-actions">
        <Link
          to="/client"
          className="bh-secondary"
        >
          Вернуться назад
        </Link>

        {booking.status !== "cancelled" && (
          <button
            className="bh-primary"
            onClick={cancelBooking}
          >
            Да, отменить запись
          </button>
        )}
      </div>
    </section>
  </main>
</div>
); }
export default BookingCancel;