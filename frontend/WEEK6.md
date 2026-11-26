# Неделя 6 — Отзывы и дополнительные возможности

## Новые страницы

| Страница | Адрес | Что делает |
|---|---|---|
| Отзывы и рейтинг | `/masters/:id/reviews` | Средний рейтинг, распределение оценок 1–5 ★, список отзывов с сортировкой, форма «Оставить отзыв» (звёзды, имя, услуга, текст) |
| История посещений | `/client/history` | Прошедшие визиты клиента, сумма трат, любимый мастер, фильтры, кнопки «Оставить отзыв» и «Повторить» |
| Статистика мастера | `/master-dashboard/stats` | Выручка, визиты, средний чек, клиенты, рейтинг и % отмен; графики по месяцам и дням недели; популярные услуги; заявки клиентов (подтвердить / отклонить / завершить) |
| Уведомления | `/notifications` (клиент), `/notifications?role=master` (мастер) | Список уведомлений, непрочитанные, «Прочитать все», удаление, колокольчик со счётчиком в шапке |

## Паттерны

**Observer** — `src/patterns/BookingEvents.js`
- Subject: `BookingEventManager` (`subscribe`, `unsubscribe`, `notify`)
- Observers: `ClientNotifier`, `MasterNotifier`, `ConsoleLogger`
- `bookingStore` вызывает `notify()` при создании записи и смене статуса, `reviewStore` — при новом отзыве.
- Хранилище уведомлений тоже наблюдаемое: хук `useNotifications` подписывается на него, поэтому колокольчик и список обновляются сразу.

**Strategy** — `src/reviewStore.js` → `reviewSortStrategies`
- `newest`, `highest`, `lowest`: у каждой стратегии свой метод `sort()`, страница отзывов выбирает стратегию по ключу.

**State** (дополнен) — `src/bookingStore.js`
- Добавлен статус `completed`: `pending → confirmed/cancelled`, `confirmed → completed/cancelled`.
- Когда визит завершён, клиенту приходит уведомление «Как всё прошло?» со ссылкой на отзыв.

## Сценарий для демонстрации
1. Записаться к Алине (`/booking/1`) → подтвердить.
2. Колокольчик клиента: «Заявка отправлена»; у мастера: «Новая заявка».
3. `/master-dashboard/stats` → «Подтвердить» → «Завершить визит».
4. Клиент: уведомление «Как всё прошло?» → оставить отзыв.
5. Рейтинг мастера пересчитался, мастеру пришло «Новый отзыв ★ 5».

## Новые файлы
`Reviews.jsx`, `VisitHistory.jsx`, `MasterStats.jsx`, `Notifications.jsx`, `Week6.css`,
`components/Layouts.jsx`, `patterns/BookingEvents.js`, `reviewStore.js`, `notificationStore.js`,
`historyData.js`, `mastersData.js`, `useNotifications.js`

## Изменённые файлы
`App.jsx` (маршруты), `bookingStore.js` (Observer + статус completed), `ClientDashboard.jsx`, `MasterDashboard.jsx` (ссылки и колокольчик), `MasterProfile.jsx` (ссылка на отзывы), `BookingCancel.jsx` (исправлена дата: была Invalid Date).
