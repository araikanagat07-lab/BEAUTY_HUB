// Общие данные мастеров для страниц 6-й недели
// (отзывы, история посещений, статистика, уведомления).

export const mastersInfo = {
  1: { name: "Алина С.", job: "Маникюр", image: "alina.jpg", rating: 4.9, reviews: 128 },
  2: { name: "Диана К.", job: "Макияж", image: "diana.jpg", rating: 4.8, reviews: 94 },
  3: { name: "Айгерим М.", job: "Укладка", image: "aigerim.jpg", rating: 5.0, reviews: 86 },
  4: { name: "София Н.", job: "Брови", image: "sofia.jpg", rating: 4.9, reviews: 73 },
  5: { name: "Мадина Т.", job: "Маникюр", image: "madina.jpg", rating: 4.8, reviews: 105 },
  6: { name: "Карина А.", job: "Макияж", image: "karina.jpg", rating: 5.0, reviews: 67 },
};

export const servicesByJob = {
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

export const CLIENT_NAME = "Аружан М.";

export function getMaster(id) {
  return mastersInfo[id] || null;
}

export function getMasterServices(id) {
  const master = getMaster(id);
  return master ? servicesByJob[master.job] || [] : [];
}

export function formatPrice(price) {
  return `${Number(price).toLocaleString("ru-RU")} ₸`;
}

export function formatDate(date, options = { day: "numeric", month: "long", year: "numeric" }) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", options);
}

// Дата и время начала записи как объект Date
export function bookingStart(booking) {
  return new Date(`${booking.date}T${booking.time}:00`);
}
