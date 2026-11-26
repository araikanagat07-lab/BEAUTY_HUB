import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isTimeBusy } from "./bookingStore";
import "./Booking.css";

const masters = {
  1: { name: "Алина С.", job: "Маникюр", image: "alina.jpg", rating: 4.9 },
  2: { name: "Диана К.", job: "Макияж", image: "diana.jpg", rating: 4.8 },
  3: { name: "Айгерим М.", job: "Укладка", image: "aigerim.jpg", rating: 5.0 },
  4: { name: "София Н.", job: "Брови", image: "sofia.jpg", rating: 4.9 },
  5: { name: "Мадина Т.", job: "Маникюр", image: "madina.jpg", rating: 4.8 },
  6: { name: "Карина А.", job: "Макияж", image: "karina.jpg", rating: 5.0 },
};

const services = {
  Маникюр: [
    { name: "Маникюр с покрытием", duration: 90, price: 9000 },
    { name: "Маникюр без покрытия", duration: 45, price: 7000 },
    { name: "Дизайн ногтей", duration: 30, price: 2000 },
  ],
  Макияж: [
    { name: "Вечерний макияж", duration: 90, price: 13000 },
    { name: "Дневной макияж", duration: 60, price: 10000 },
  ],
  Укладка: [
    { name: "Укладка волос", duration: 60, price: 9000 },
    { name: "Локоны", duration: 75, price: 11000 },
  ],
  Брови: [
    { name: "Коррекция и окрашивание", duration: 45, price: 8000 },
    { name: "Ламинирование бровей", duration: 60, price: 10000 },
  ],
};

const timeSlots = ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"];
const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function dateKey(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatPrice(price) {
  return `${price.toLocaleString("ru-RU")} ₸`;
}

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const master = masters[id];

  const [serviceIndex, setServiceIndex] = useState(0);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const year = visibleMonth.getFullYear();
  const monthIndex = visibleMonth.getMonth();
  const dayCount = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const now = new Date();
  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const masterServices = useMemo(() => (master ? services[master.job] || [] : []), [master]);
  const chosenService = masterServices[serviceIndex] || masterServices[0];

  if (!master || !chosenService) {
    return (
      <div className="bh-page">
        <div className="bh-booking-main">
          <h1>Мастер не найден</h1>
          <Link to="/masters">Вернуться к мастерам</Link>
        </div>
      </div>
    );
  }

  function changeMonth(direction) {
    const nextMonth = new Date(year, monthIndex + direction, 1);
    if (nextMonth < currentMonth) return;
    setVisibleMonth(nextMonth);
    setSelectedDate("");
    setSelectedTime("");
  }

  function chooseDate(day) {
    const value = dateKey(year, monthIndex, day);
    if (value < todayKey) return;
    setSelectedDate(value);
    setSelectedTime("");
  }

  function isAvailable(slot) {
    if (!selectedDate) return false;
    const startsAt = new Date(`${selectedDate}T${slot}:00`);
    if (startsAt <= new Date()) return false;
    return !isTimeBusy(id, selectedDate, slot);
  }

  function continueToConfirmation() {
    if (!selectedDate || !selectedTime || !isAvailable(selectedTime)) return;

    const draft = {
      masterId: id,
      masterName: master.name,
      masterImage: master.image,
      service: chosenService.name,
      price: chosenService.price,
      duration: chosenService.duration,
      date: selectedDate,
      time: selectedTime,
    };

    sessionStorage.setItem("beautyhub_draft", JSON.stringify(draft));
    navigate("/booking-confirm");
  }

  const calendarDays = Array.from({ length: firstDayOffset + dayCount }, (_, index) => {
    const day = index - firstDayOffset + 1;
    return day > 0 ? day : null;
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
        <Link to="/client" className="bh-header-button">Мой кабинет</Link>
      </header>

      <main className="bh-booking-main">
        <h1>Онлайн-запись к мастеру</h1>

        <div className="bh-booking-grid">
          <section className="bh-panel">
            <h2>1. Выбери услугу</h2>

            {masterServices.map((service, index) => (
              <button
                type="button"
                key={service.name}
                className={`bh-service-option ${serviceIndex === index ? "active" : ""}`}
                onClick={() => {
                  setServiceIndex(index);
                  setSelectedTime("");
                }}
              >
                <span className="bh-radio">{serviceIndex === index ? "●" : "○"}</span>
                <span className="bh-service-name">
                  <strong>{service.name}</strong>
                  <small>{service.duration} минут</small>
                </span>
                <strong>{formatPrice(service.price)}</strong>
              </button>
            ))}

            <div className="bh-master-info">
              <h3>Ваш мастер</h3>
              <div className="bh-master-row">
                <img src={`/images/${master.image}`} alt={master.name} />
                <div>
                  <strong>{master.name}</strong>
                  <p>{master.job} • Алматы</p>
                  <small>★ {master.rating.toFixed(1)}</small>
                </div>
              </div>
            </div>
          </section>

          <section className="bh-panel">
            <div className="bh-calendar-heading">
              <h2>2. Выбери дату</h2>
              <div className="bh-month-control">
                <button type="button" onClick={() => changeMonth(-1)} disabled={visibleMonth <= currentMonth} aria-label="Предыдущий месяц">‹</button>
                <strong>{visibleMonth.toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}</strong>
                <button type="button" onClick={() => changeMonth(1)} aria-label="Следующий месяц">›</button>
              </div>
            </div>

            <div className="bh-calendar">
              {weekDays.map((day) => (
                <div className="bh-weekday" key={day}>{day}</div>
              ))}
              {calendarDays.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} />;
                const value = dateKey(year, monthIndex, day);
                return (
                  <button
                    type="button"
                    key={value}
                    className={`bh-day ${selectedDate === value ? "active" : ""}`}
                    disabled={value < todayKey}
                    onClick={() => chooseDate(day)}
                    aria-label={`Выбрать ${day} число`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="bh-time-section">
              <h2>3. Свободное время{selectedDate ? ` на ${new Date(`${selectedDate}T12:00:00`).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}` : ""}</h2>
              <div className="bh-times">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    disabled={!isAvailable(slot)}
                    className={selectedTime === slot ? "active" : ""}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="bh-booking-footer">
              <p>
                Выбрано: {chosenService.name} • {selectedDate || "выбери дату"} • {selectedTime || "выбери время"}
              </p>
              <button
                type="button"
                className="bh-primary"
                disabled={!selectedDate || !selectedTime || !isAvailable(selectedTime)}
                onClick={continueToConfirmation}
              >
                Продолжить →
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Booking;
