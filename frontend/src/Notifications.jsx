import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClientLayout, MasterLayout } from "./components/Layouts";
import { useNotifications } from "./useNotifications";
import { markAsRead, markAllAsRead, removeNotification } from "./notificationStore";
import { bookingEvents, EVENTS } from "./patterns/BookingEvents";
import { getBookings } from "./bookingStore";
import { bookingStart } from "./mastersData";

const typeIcons = {
  booking_created: "📝",
  booking_confirmed: "✅",
  booking_cancelled: "✖",
  booking_completed: "💅",
  review_added: "★",
  reminder: "⏰",
  promo: "🎁",
};

function timeAgo(iso) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

// Напоминания: для записей в ближайшие 24 часа создаём событие REMINDER.
// Повторно оно не появится — у уведомления уникальный key.
function sendReminders() {
  const now = Date.now();
  getBookings()
    .filter((booking) => ["pending", "confirmed"].includes(booking.status))
    .filter((booking) => {
      const diff = bookingStart(booking).getTime() - now;
      return diff > 0 && diff <= 24 * 60 * 60 * 1000;
    })
    .forEach((booking) => bookingEvents.notify(EVENTS.REMINDER, booking));
}

function Notifications() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const audience = params.get("role") === "master" ? "master" : "client";
  const Layout = audience === "master" ? MasterLayout : ClientLayout;

  const { list, unread } = useNotifications(audience);
  const [onlyUnread, setOnlyUnread] = useState(false);

  useEffect(() => {
    if (audience === "client") sendReminders();
  }, [audience]);

  const shown = onlyUnread ? list.filter((item) => !item.read) : list;

  function open(item) {
    markAsRead(item.id);
    if (item.link) navigate(item.link);
  }

  return (
    <Layout>
      <div className="w6-title-row">
        <div>
          <h1>Уведомления</h1>
          <p className="client-subtitle">
            {unread > 0 ? `Новых уведомлений: ${unread}` : "Все уведомления прочитаны"}
          </p>
        </div>
        <button
          type="button"
          className="w6-btn-outline"
          disabled={unread === 0}
          onClick={() => markAllAsRead(audience)}
        >
          Прочитать все
        </button>
      </div>

      <div className="w6-tabs">
        <button type="button" className={!onlyUnread ? "active" : ""} onClick={() => setOnlyUnread(false)}>
          Все <small>{list.length}</small>
        </button>
        <button type="button" className={onlyUnread ? "active" : ""} onClick={() => setOnlyUnread(true)}>
          Непрочитанные <small>{unread}</small>
        </button>
      </div>

      <div className="w6-notifications">
        {shown.map((item) => (
          <article className={`w6-notification ${item.read ? "" : "unread"}`} key={item.id}>
            <span className={`w6-notification-icon w6-type-${item.type}`}>{typeIcons[item.type] || "🔔"}</span>

            <button type="button" className="w6-notification-body" onClick={() => open(item)}>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
              <small>{timeAgo(item.createdAt)}</small>
            </button>

            {!item.read && <span className="w6-dot" aria-label="Новое" />}

            <button
              type="button"
              className="w6-remove"
              aria-label="Удалить уведомление"
              onClick={() => removeNotification(item.id)}
            >
              ×
            </button>
          </article>
        ))}

        {shown.length === 0 && <p className="w6-empty">Уведомлений нет.</p>}
      </div>
    </Layout>
  );
}

export default Notifications;
