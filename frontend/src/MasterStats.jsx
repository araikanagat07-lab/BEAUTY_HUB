import { useState } from "react";
import { Link } from "react-router-dom";
import { MasterLayout } from "./components/Layouts";
import { getMasterBookings, effectiveStatus, statusLabels } from "./historyData";
import { changeBookingStatus } from "./bookingStore";
import { getRatingSummary } from "./reviewStore";
import { formatDate, formatPrice, bookingStart } from "./mastersData";

const MASTER_ID = "1"; // кабинет Алины С.
const periods = { 1: "Этот месяц", 3: "3 месяца", 6: "6 месяцев" };
const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function MasterStats() {
  const [period, setPeriod] = useState("6");
  const [version, setVersion] = useState(0); // обновление после смены статуса
  const [message, setMessage] = useState("");

  const now = new Date();
  const all = getMasterBookings(MASTER_ID).map((booking) => ({
    ...booking,
    current: effectiveStatus(booking),
  }));

  const periodStart = monthKey(new Date(now.getFullYear(), now.getMonth() - (Number(period) - 1), 1));
  const inPeriod = all.filter((booking) => booking.date.slice(0, 7) >= periodStart && bookingStart(booking) <= now);

  const done = inPeriod.filter((booking) => booking.current === "completed");
  const cancelled = inPeriod.filter((booking) => booking.current === "cancelled");
  const revenue = done.reduce((sum, booking) => sum + Number(booking.price), 0);
  const rating = getRatingSummary(MASTER_ID);
  const uniqueClients = new Set(done.map((booking) => booking.clientName)).size;

  // Выручка по месяцам (последние 6)
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const key = monthKey(date);
    const list = all.filter(
      (booking) => booking.date.startsWith(key) && booking.current === "completed"
    );
    return {
      key,
      label: date.toLocaleDateString("ru-RU", { month: "short" }).replace(".", ""),
      revenue: list.reduce((sum, booking) => sum + Number(booking.price), 0),
      count: list.length,
      active: key >= periodStart,
    };
  });
  const maxRevenue = Math.max(...months.map((month) => month.revenue), 1);

  // Популярные услуги
  const serviceStats = Object.values(
    done.reduce((acc, booking) => {
      acc[booking.service] ??= { name: booking.service, count: 0, revenue: 0 };
      acc[booking.service].count += 1;
      acc[booking.service].revenue += Number(booking.price);
      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count);
  const maxService = Math.max(...serviceStats.map((item) => item.count), 1);

  // Загруженность по дням недели
  const byWeekDay = weekDays.map(() => 0);
  done.forEach((booking) => {
    byWeekDay[(new Date(`${booking.date}T12:00:00`).getDay() + 6) % 7] += 1;
  });
  const maxDay = Math.max(...byWeekDay, 1);

  // Реальные заявки клиентов, которыми мастер управляет (паттерн State)
  const requests = all
    .filter((booking) => !booking.demo && ["pending", "confirmed"].includes(booking.current))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  function setStatus(id, status, text) {
    if (changeBookingStatus(id, status)) {
      setMessage(text);
      setVersion(version + 1);
    } else {
      setMessage("Такой переход статуса недоступен.");
    }
  }

  return (
    <MasterLayout>
      <div className="w6-title-row">
        <div>
          <h1>Статистика</h1>
          <p className="md-description">Выручка, загруженность и популярные услуги</p>
        </div>
        <div className="w6-segment">
          {Object.entries(periods).map(([key, label]) => (
            <button
              type="button"
              key={key}
              className={period === key ? "active" : ""}
              onClick={() => setPeriod(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="w6-kpis w6-kpis-5">
        <div><span>Выручка</span><strong>{formatPrice(revenue)}</strong></div>
        <div><span>Визитов</span><strong>{done.length}</strong></div>
        <div><span>Средний чек</span><strong>{formatPrice(done.length ? Math.round(revenue / done.length) : 0)}</strong></div>
        <div><span>Клиентов</span><strong>{uniqueClients}</strong></div>
        <div>
          <span>Рейтинг</span>
          <strong>{rating.average.toFixed(1)} ★</strong>
          <small>отмен: {inPeriod.length ? Math.round((cancelled.length / inPeriod.length) * 100) : 0}%</small>
        </div>
      </div>

      <div className="w6-stats-grid">
        <section className="w6-panel">
          <h2>Выручка по месяцам</h2>
          <div className="w6-chart">
            {months.map((month) => (
              <div className={`w6-chart-col ${month.active ? "active" : ""}`} key={month.key}>
                <small>{Math.round(month.revenue / 1000)}k</small>
                <div className="w6-chart-track">
                  <i style={{ height: `${(month.revenue / maxRevenue) * 100}%` }} title={`${formatPrice(month.revenue)} • ${month.count} визитов`} />
                </div>
                <span>{month.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="w6-panel">
          <h2>Загруженность по дням</h2>
          <div className="w6-days">
            {weekDays.map((day, index) => (
              <div key={day}>
                <span>{day}</span>
                <div><i style={{ width: `${(byWeekDay[index] / maxDay) * 100}%` }} /></div>
                <small>{byWeekDay[index]}</small>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="w6-panel">
        <h2>Популярные услуги</h2>
        <div className="w6-services">
          {serviceStats.map((item) => (
            <div className="w6-service-row" key={item.name}>
              <strong>{item.name}</strong>
              <div className="w6-service-bar"><i style={{ width: `${(item.count / maxService) * 100}%` }} /></div>
              <span>{item.count} визитов</span>
              <span>{formatPrice(item.revenue)}</span>
            </div>
          ))}
          {serviceStats.length === 0 && <p className="w6-empty">За этот период визитов нет.</p>}
        </div>
      </section>

      <section className="w6-panel" key={version}>
        <div className="w6-panel-heading">
          <h2>Заявки клиентов</h2>
          <Link to="/notifications?role=master" className="w6-link">Уведомления →</Link>
        </div>

        {message && <p className="w6-success">{message}</p>}

        {requests.length === 0 ? (
          <p className="w6-empty">
            Новых заявок нет. Запишитесь к Алине через <Link to="/booking/1">онлайн-запись</Link> — заявка появится здесь.
          </p>
        ) : (
          <div className="md-appointments">
            {requests.map((booking) => (
              <div className="md-appointment" key={booking.id}>
                <div className="md-initial">{booking.clientName[0]}</div>
                <div className="md-appointment-name">
                  <strong>{booking.clientName}</strong>
                  <p>{booking.service} • {formatPrice(booking.price)}</p>
                </div>
                <span className="md-time">{formatDate(booking.date, { day: "numeric", month: "short" })}, {booking.time}</span>
                <span className={`md-status ${booking.current === "confirmed" ? "confirmed" : "pending"}`}>
                  {statusLabels[booking.current]}
                </span>
                <div className="w6-request-actions">
                  {booking.current === "pending" ? (
                    <>
                      <button type="button" className="w6-btn w6-btn-small" onClick={() => setStatus(booking.id, "confirmed", "Запись подтверждена — клиент получил уведомление.")}>
                        Подтвердить
                      </button>
                      <button type="button" className="w6-btn-outline" onClick={() => setStatus(booking.id, "cancelled", "Заявка отклонена.")}>
                        Отклонить
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="w6-btn w6-btn-small" onClick={() => setStatus(booking.id, "completed", "Визит завершён — клиенту отправлена просьба оставить отзыв.")}>
                        Завершить визит
                      </button>
                      <button type="button" className="w6-btn-outline" onClick={() => setStatus(booking.id, "cancelled", "Запись отменена.")}>
                        Отменить
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </MasterLayout>
  );
}

export default MasterStats;
