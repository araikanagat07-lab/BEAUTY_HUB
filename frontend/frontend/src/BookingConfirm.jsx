import { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom"; 
import { createBooking } from "./bookingStore"; 
import "./Booking.css";

function BookingConfirm() { 
    const navigate = useNavigate(); 
    const [error, setError] = useState("");
 
    const saved = sessionStorage.getItem("beautyhub_draft"); 
    let booking = null;

    try { 
        booking = saved ? JSON.parse(saved) : null; 
    } catch { 
        booking = null; 
    }

    console.log("BOOKING DATA:", JSON.stringify(booking));
    if (!booking) { 
        return ( 
        <div className="bh-message"> 
        <h2>Запись ещё не выбрана</h2> 
        <Link to="/masters">Выбрать мастера</Link> 
        </div> 
        ); 
    }

    const [year, month, day] = booking.date.split("-").map(Number);

const [hours, minutes] = booking.time.split(":").map(Number);

const start = new Date(
  year,
  month - 1,
  day,
  hours,
  minutes,
  0
);

const dateText = start.toLocaleDateString("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
});

const totalMinutes =
  hours * 60 + minutes + Number(booking.duration);

const endHours = Math.floor(totalMinutes / 60) % 24;
const endMinutes = totalMinutes % 60;

const endTime =
  String(endHours).padStart(2, "0") +
  ":" +
  String(endMinutes).padStart(2, "0");

    function confirm() { 
        if (start <= new Date()) { 
            setError("Выбранное время уже прошло. Выбери другую дату."); 
            return; 
        }

        const result = createBooking(booking);


        if (!result.success) {
          setError(result.message);
        return;
        }


        sessionStorage.removeItem("beautyhub_draft");
        navigate(`/booking-cancel/${result.booking.id}`, {
           state: { justBooked: true }
        });
}

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
    <Link className="bh-header-button" to="/client">Профиль</Link> 
    </header>

  <main className="bh-confirm-main">
    <h1>Подтверждение записи</h1>
    <p className="bh-muted">
      Проверь данные перед подтверждением бронирования
    </p>

    <div className="bh-confirm-grid">
      <section className="bh-panel">
        <h2>Детали записи</h2>

        <div className="bh-master-row bh-confirm-master">
          <img src={`/images/${booking.masterImage}`} alt={booking.masterName} />
          <div>
            <strong>{booking.masterName}</strong>
            <p>Мастер • Алматы</p>
            <small>BEAUTY HUB</small>
          </div>
        </div>

        <div className="bh-detail-row">
          <span>Услуга</span><strong>{booking.service}</strong>
        </div>
        <div className="bh-detail-row">
          <span>Дата</span><strong>{dateText}</strong>
        </div>
        <div className="bh-detail-row">
          <span>Время</span><strong>{booking.time} – {endTime}</strong>
        </div>
        <div className="bh-detail-row">
          <span>Продолжительность</span><strong>{booking.duration} минут</strong>
        </div>

        <div className="bh-total">
          <strong>Итого к оплате</strong>
          <strong>{booking.price.toLocaleString("ru-RU")} ₸</strong>
        </div>
      </section>

      <div className="bh-confirm-side">
        <section className="bh-panel">
          <h2>Подтверждение</h2>
          <p className="bh-muted">
            Проверь выбранную услугу, дату и время записи.
          </p>

          {error && <p className="bh-error">{error}</p>}

          <Link to="/booking-extras" className="bh-primary">
            Добавить услуги и перейти к оплате
          </Link>
          
          <button className="bh-primary bh-full" onClick={confirm}>
            Подтвердить запись
          </button>
          <button
            className="bh-secondary bh-full"
            onClick={() => navigate(`/booking/${booking.masterId}`)}
          >
            Назад
          </button>

          <p className="bh-small-note">
            После подтверждения запись сохранится в этом браузере.
          </p>
        </section>
      </div>
    </div>
  </main>
</div>
); 
}

export default BookingConfirm;