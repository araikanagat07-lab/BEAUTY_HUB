import { bookingEvents, EVENTS } from "./patterns/BookingEvents";
import { getClientName, getClientId } from "./currentUser";

const KEY = "beautyhub_bookings";

export function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBookings(bookings) {
  localStorage.setItem(KEY, JSON.stringify(bookings));

  window.dispatchEvent(new Event("beautyhub:bookings"));
}

export function createBooking(booking) {
  const bookings = getBookings();

  const busy = bookings.some(
    (item) =>
      String(item.masterId) === String(booking.masterId) &&
      item.date === booking.date &&
      item.time === booking.time &&
      item.status !== "cancelled"
  );

  if (busy) {
    return { success: false, message: "Это время уже занято." };
  }

  const newBooking = {
    clientName: getClientName(),
    clientId: getClientId(),
    ...booking,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  saveBookings([...bookings, newBooking]);

  // Observer: сообщаем всем подписчикам о новой записи
  bookingEvents.notify(EVENTS.BOOKING_CREATED, newBooking);

  return { success: true, booking: newBooking };
}

export function changeBookingStatus(id, newStatus) {
  const bookings = getBookings();
  const booking = bookings.find((item) => item.id === id);

  if (!booking) return false;

 
  const transitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };

  if (!transitions[booking.status]?.includes(newStatus)) {
    return false;
  }

  booking.status = newStatus;
  saveBookings(bookings);

  // Observer: уведомления о смене статуса
  const statusEvents = {
    confirmed: EVENTS.BOOKING_CONFIRMED,
    cancelled: EVENTS.BOOKING_CANCELLED,
    completed: EVENTS.BOOKING_COMPLETED,
  };
  bookingEvents.notify(statusEvents[newStatus], { ...booking });

  return true;
}

export function isTimeBusy(masterId, date, time) {
  return getBookings().some(
    (item) =>
      String(item.masterId) === String(masterId) &&
      item.date === date &&
      item.time === time &&
      item.status !== "cancelled"
  );
}