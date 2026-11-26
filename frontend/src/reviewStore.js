// Система рейтингов и отзывов (localStorage).
// Сортировка отзывов сделана через ПАТТЕРН STRATEGY:
// каждая стратегия — отдельный объект с одним методом sort(),
// страница выбирает стратегию по ключу и не знает, как она устроена.

import { bookingEvents, EVENTS } from "./patterns/BookingEvents";
import { getMaster } from "./mastersData";

const KEY = "beautyhub_reviews";

const seedReviews = [
  { id: "s1", masterId: "1", author: "Айжан Б.", rating: 5, service: "Маникюр с покрытием", text: "Очень аккуратно и быстро! Покрытие держится уже третью неделю.", date: "2026-11-23" },
  { id: "s2", masterId: "1", author: "Томирис К.", rating: 5, service: "Дизайн ногтей", text: "Сделала именно тот дизайн, что я хотела по фото. Вернусь ещё.", date: "2026-11-12" },
  { id: "s3", masterId: "1", author: "Дана Е.", rating: 4, service: "Маникюр без покрытия", text: "Всё хорошо, но пришлось подождать минут десять.", date: "2026-10-30" },
  { id: "s4", masterId: "2", author: "Алия С.", rating: 5, service: "Вечерний макияж", text: "Макияж продержался всю свадьбу, на фото выглядит идеально.", date: "2026-11-18" },
  { id: "s5", masterId: "2", author: "Жанна Р.", rating: 4, service: "Дневной макияж", text: "Естественно и красиво, хотелось бы чуть ярче.", date: "2026-11-02" },
  { id: "s6", masterId: "3", author: "Мерей А.", rating: 5, service: "Локоны", text: "Локоны держались два дня! Айгерим — золотые руки.", date: "2026-11-21" },
  { id: "s7", masterId: "3", author: "Сабина Т.", rating: 5, service: "Укладка волос", text: "Быстро, уютно, результат как на картинке.", date: "2026-11-05" },
  { id: "s8", masterId: "4", author: "Камила Н.", rating: 5, service: "Ламинирование бровей", text: "Брови выглядят ухоженно, форму подобрала идеально.", date: "2026-11-19" },
  { id: "s9", masterId: "4", author: "Асель Ж.", rating: 4, service: "Коррекция и окрашивание", text: "Хорошо, но цвет чуть темнее, чем я ожидала.", date: "2026-10-28" },
  { id: "s10", masterId: "5", author: "Инкар М.", rating: 5, service: "Маникюр с покрытием", text: "Мадина очень внимательная, всё стерильно.", date: "2026-11-15" },
  { id: "s11", masterId: "5", author: "Алтынай Д.", rating: 4, service: "Дизайн ногтей", text: "Красиво, но дизайн занял больше времени, чем обещали.", date: "2026-11-01" },
  { id: "s12", masterId: "6", author: "Аружан Е.", rating: 5, service: "Вечерний макияж", text: "Лучший визажист! Делала макияж на выпускной.", date: "2026-11-20" },
  { id: "s13", masterId: "6", author: "Диляра К.", rating: 5, service: "Дневной макияж", text: "Лёгкий, свежий образ — то, что нужно для фотосессии.", date: "2026-11-08" },
];

function readUserReviews() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function getReviews(masterId) {
  return [...readUserReviews(), ...seedReviews].filter(
    (review) => String(review.masterId) === String(masterId)
  );
}

export function hasReviewForBooking(bookingId) {
  return readUserReviews().some((review) => review.bookingId === bookingId);
}

export function addReview(review) {
  if (review.bookingId && hasReviewForBooking(review.bookingId)) {
    return { success: false, message: "Вы уже оставили отзыв об этом визите." };
  }

  const newReview = {
    ...review,
    id: crypto.randomUUID(),
    masterId: String(review.masterId),
    date: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(KEY, JSON.stringify([newReview, ...readUserReviews()]));

  // Observer: мастер получает уведомление о новом отзыве
  bookingEvents.notify(EVENTS.REVIEW_ADDED, newReview);

  return { success: true, review: newReview };
}

// Распределение оценок 1–5 ★.
// Базовые оценки берутся из профиля мастера (рейтинг и число отзывов),
// а новые отзывы с сайта добавляются сверху.
export function getRatingSummary(masterId) {
  const master = getMaster(masterId);
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  if (master) {
    const fives = Math.round(master.reviews * (master.rating - 4));
    counts[5] = fives;
    counts[4] = master.reviews - fives;
  }

  readUserReviews()
    .filter((review) => String(review.masterId) === String(masterId))
    .forEach((review) => {
      counts[review.rating] += 1;
    });

  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const sum = Object.entries(counts).reduce((acc, [stars, value]) => acc + stars * value, 0);

  return {
    counts,
    total,
    average: total ? sum / total : 0,
  };
}

// ---------- ПАТТЕРН STRATEGY: сортировка отзывов ----------
const byDateDesc = (a, b) => (b.createdAt || b.date).localeCompare(a.createdAt || a.date);

export const reviewSortStrategies = {
  newest: {
    label: "Сначала новые",
    sort: (reviews) => [...reviews].sort(byDateDesc),
  },
  highest: {
    label: "Сначала высокие оценки",
    sort: (reviews) => [...reviews].sort((a, b) => b.rating - a.rating || byDateDesc(a, b)),
  },
  lowest: {
    label: "Сначала низкие оценки",
    sort: (reviews) => [...reviews].sort((a, b) => a.rating - b.rating || byDateDesc(a, b)),
  },
};
