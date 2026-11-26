const KEY = "beautyhub_notifications";
const listeners = new Set();

const demoNotifications = [
  {
    id: "demo-1",
    key: "demo-1",
    audience: "client",
    type: "booking_confirmed",
    title: "Запись подтверждена",
    text: "Алина С. подтвердила запись «Маникюр с покрытием».",
    link: "/client",
    read: false,
    createdAt: "2026-11-24T10:15:00",
  },
  {
    id: "demo-2",
    key: "demo-2",
    audience: "master",
    type: "review_added",
    title: "Новый отзыв ★ 5",
    text: "Айжан Б. оставила отзыв: «Очень аккуратно и быстро!»",
    link: "/masters/1/reviews",
    read: false,
    createdAt: "2026-11-23T18:40:00",
  },
  {
    id: "demo-3",
    key: "demo-3",
    audience: "client",
    type: "promo",
    title: "Скидка 10% на макияж",
    text: "До конца недели — скидка на вечерний макияж у Дианы К.",
    link: "/masters/2",
    read: true,
    createdAt: "2026-11-20T09:00:00",
  },
];

function read() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : demoNotifications;
  } catch {
    return demoNotifications;
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  listeners.forEach((listener) => listener(list));
}

export function getNotifications() {
  return [...read()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addNotification(notification) {
  const list = read();


  if (notification.key && list.some((item) => item.key === notification.key)) {
    return;
  }

  write([
    {
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    },
    ...list,
  ]);
}

export function markAsRead(id) {
  write(read().map((item) => (item.id === id ? { ...item, read: true } : item)));
}

export function markAllAsRead(audience) {
  write(
    read().map((item) =>
      !audience || item.audience === audience ? { ...item, read: true } : item
    )
  );
}

export function removeNotification(id) {
  write(read().filter((item) => item.id !== id));
}

export function getUnreadCount(audience) {
  return read().filter((item) => !item.read && (!audience || item.audience === audience)).length;
}

export function subscribe(listener) {
  listeners.add(listener);

  const onStorage = (event) => {
    if (event.key === KEY) listener(read());
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
