import { addNotification } from "../notificationStore";
import { formatDate } from "../mastersData";

export const EVENTS = {
  BOOKING_CREATED: "booking_created",
  BOOKING_CONFIRMED: "booking_confirmed",
  BOOKING_CANCELLED: "booking_cancelled",
  BOOKING_COMPLETED: "booking_completed",
  REVIEW_ADDED: "review_added",
  REMINDER: "reminder",
};


class BookingEventManager {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
    return () => this.unsubscribe(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((item) => item !== observer);
  }

  notify(type, payload) {
    const event = { type, payload, time: new Date().toISOString() };
    this.observers.forEach((observer) => observer.update(event));
  }
}

class ClientNotifier {
  update({ type, payload: b }) {
    const when = b.date ? `${formatDate(b.date, { day: "numeric", month: "long" })}, ${b.time}` : "";

    const messages = {
      [EVENTS.BOOKING_CREATED]: () => ({
        title: "Заявка отправлена",
        text: `${b.service} у мастера ${b.masterName} • ${when}. Ждём подтверждения.`,
      }),
      [EVENTS.BOOKING_CONFIRMED]: () => ({
        title: "Запись подтверждена",
        text: `${b.masterName} подтвердила запись «${b.service}» • ${when}.`,
      }),
      [EVENTS.BOOKING_CANCELLED]: () => ({
        title: "Запись отменена",
        text: `Запись «${b.service}» • ${when} отменена.`,
      }),
      [EVENTS.BOOKING_COMPLETED]: () => ({
        title: "Как всё прошло?",
        text: `Оцените визит к мастеру ${b.masterName} — это займёт минуту.`,
        link: `/masters/${b.masterId}/reviews?booking=${b.id}`,
      }),
      [EVENTS.REMINDER]: () => ({
        title: "Напоминание о записи",
        text: `Скоро: ${b.service} у мастера ${b.masterName} • ${when}.`,
      }),
    };

    const message = messages[type]?.();
    if (!message) return;

    addNotification({
      audience: "client",
      clientId: b.clientId || null,
      type,
      link: `/booking-cancel/${b.id}`,
      key: `client-${type}-${b.id}`,
      ...message,
    });
  }
}


class MasterNotifier {
  update({ type, payload: b }) {
    const when = b.date ? `${formatDate(b.date, { day: "numeric", month: "long" })}, ${b.time}` : "";

    const messages = {
      [EVENTS.BOOKING_CREATED]: () => ({
        title: "Новая заявка",
        text: `${b.clientName || "Клиент"} — «${b.service}» • ${when}. Подтвердите запись.`,
        link: "/master-dashboard/stats",
      }),
      [EVENTS.BOOKING_CANCELLED]: () => ({
        title: "Клиент отменил запись",
        text: `«${b.service}» • ${when}. Время снова свободно.`,
        link: "/master-dashboard/stats",
      }),
      [EVENTS.REVIEW_ADDED]: () => ({
        title: `Новый отзыв ★ ${b.rating}`,
        text: `${b.author}: «${b.text.slice(0, 60)}${b.text.length > 60 ? "…" : ""}»`,
        link: `/masters/${b.masterId}/reviews`,
      }),
    };

    const message = messages[type]?.();
    if (!message) return;

    addNotification({
      audience: "master",
      type,
      key: `master-${type}-${b.id}`,
      ...message,
    });
  }
}

// Журнал событий в консоли (удобно показывать на защите)
class ConsoleLogger {
  update(event) {
    console.info("[BookingEvents]", event.type, event.payload);
  }
}

export const bookingEvents = new BookingEventManager();
bookingEvents.subscribe(new ClientNotifier());
bookingEvents.subscribe(new MasterNotifier());
bookingEvents.subscribe(new ConsoleLogger());
