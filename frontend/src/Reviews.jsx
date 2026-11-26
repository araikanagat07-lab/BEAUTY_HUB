import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getMaster, getMasterServices, formatDate } from "./mastersData";
import { getClientName } from "./currentUser";
import {
  addReview,
  getReviews,
  getRatingSummary,
  hasReviewForBooking,
  reviewSortStrategies,
} from "./reviewStore";
import { getClientVisits } from "./historyData";
import { NotificationBell } from "./components/Layouts";
import "./MasterProfile.css";
import "./Week6.css";

function Stars({ value, size = "" }) {
  return (
    <span className={`w6-stars ${size}`} aria-label={`${value} из 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(value) ? "on" : ""}>★</span>
      ))}
    </span>
  );
}

function Reviews() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const bookingId = params.get("booking");

  const master = getMaster(id);
  const services = getMasterServices(id);
  const visit = bookingId ? getClientVisits().find((item) => item.id === bookingId) : null;

  const [reviews, setReviews] = useState(() => getReviews(id));
  const [summary, setSummary] = useState(() => getRatingSummary(id));
  const [sortKey, setSortKey] = useState("newest");

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [author, setAuthor] = useState(() => getClientName());
  const [service, setService] = useState(visit?.service || services[0]?.name || "");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alreadyReviewed, setAlreadyReviewed] = useState(
    () => Boolean(bookingId && hasReviewForBooking(bookingId))
  );

  if (!master) {
    return (
      <div className="profile-not-found">
        <h2>Мастер не найден</h2>
        <Link to="/masters">Вернуться к мастерам</Link>
      </div>
    );
  }

  function submit(event) {
    event.preventDefault();
    setSuccess("");

    if (!rating) return setError("Поставьте оценку от 1 до 5 звёзд.");
    if (author.trim().length < 2) return setError("Укажите имя.");
    if (text.trim().length < 10) return setError("Напишите хотя бы пару слов (от 10 символов).");

    const result = addReview({
      masterId: id,
      bookingId: visit?.id,
      author: author.trim(),
      rating,
      service,
      text: text.trim(),
    });

    if (!result.success) return setError(result.message);

    setError("");
    setReviews(getReviews(id));
    setSummary(getRatingSummary(id));
    setRating(0);
    setText("");
    setSortKey("newest");
    if (visit) setAlreadyReviewed(true);
    setSuccess("Спасибо! Отзыв опубликован, мастер получил уведомление.");
  }

  // Strategy: выбираем стратегию сортировки по ключу
  const sorted = reviewSortStrategies[sortKey].sort(reviews);
  const maxCount = Math.max(...Object.values(summary.counts), 1);

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/" className="profile-logo">BEAUTY HUB</Link>
        <nav>
          <Link to="/">Главная</Link>
          <Link to="/services">Услуги</Link>
          <Link to="/masters">Мастера</Link>
          <Link to="/#about">О нас</Link>
        </nav>
        <div className="w6-header-right">
          <NotificationBell audience="client" />
          <Link to="/client" className="profile-login">Мой кабинет</Link>
        </div>
      </header>

      <main className="profile-main w6-reviews-main">
        <p className="w6-breadcrumb">
          <Link to="/masters">Мастера</Link> / <Link to={`/masters/${id}`}>{master.name}</Link> / Отзывы
        </p>
        <h1>Отзывы и рейтинг</h1>

        <section className="w6-rating-card">
          <div className="w6-rating-master">
            <img src={`/images/${master.image}`} alt={master.name} />
            <div>
              <h2>{master.name}</h2>
              <p>{master.job} • Алматы</p>
              <Link to={`/booking/${id}`} className="w6-btn">Записаться</Link>
            </div>
          </div>

          <div className="w6-rating-big">
            <strong>{summary.average.toFixed(1)}</strong>
            <Stars value={summary.average} size="big" />
            <span>{summary.total} оценок</span>
          </div>

          <div className="w6-rating-bars">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div className="w6-rating-bar" key={stars}>
                <span>{stars} ★</span>
                <div><i style={{ width: `${(summary.counts[stars] / maxCount) * 100}%` }} /></div>
                <small>{summary.counts[stars]}</small>
              </div>
            ))}
          </div>
        </section>

        <div className="w6-reviews-grid">
          <section className="w6-panel">
            <h2>Оставить отзыв</h2>

            {visit && (
              <p className="w6-visit-note">
                Визит: {visit.service} • {formatDate(visit.date)}, {visit.time}
              </p>
            )}

            {alreadyReviewed ? (
              <div className="w6-success">
                Вы уже оценили этот визит. Спасибо!
                <Link to="/client/history">← К истории посещений</Link>
              </div>
            ) : (
              <form className="w6-review-form" onSubmit={submit}>
                <label>Ваша оценка</label>
                <div className="w6-star-picker" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={star <= (hover || rating) ? "on" : ""}
                      onMouseEnter={() => setHover(star)}
                      onClick={() => setRating(star)}
                      aria-label={`${star} звёзд`}
                    >
                      ★
                    </button>
                  ))}
                  <span>{["", "Плохо", "Так себе", "Нормально", "Хорошо", "Отлично"][hover || rating]}</span>
                </div>

                <label htmlFor="w6-author">Имя</label>
                <input id="w6-author" value={author} onChange={(event) => setAuthor(event.target.value)} />

                <label htmlFor="w6-service">Услуга</label>
                <select id="w6-service" value={service} onChange={(event) => setService(event.target.value)} disabled={Boolean(visit)}>
                  {(visit && !services.some((item) => item.name === visit.service)
                    ? [{ name: visit.service }, ...services]
                    : services
                  ).map((item) => (
                    <option key={item.name} value={item.name}>{item.name}</option>
                  ))}
                </select>

                <label htmlFor="w6-text">Отзыв</label>
                <textarea
                  id="w6-text"
                  rows="4"
                  maxLength="500"
                  placeholder="Расскажите, что понравилось, а что можно улучшить"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
                <small className="w6-counter">{text.length}/500</small>

                {error && <p className="w6-error">{error}</p>}
                {success && <p className="w6-success">{success}</p>}

                <button type="submit" className="w6-btn w6-full">Опубликовать отзыв</button>
              </form>
            )}
          </section>

          <section className="w6-panel">
            <div className="w6-panel-heading">
              <h2>Отзывы клиентов</h2>
              <select value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
                {Object.entries(reviewSortStrategies).map(([key, strategy]) => (
                  <option key={key} value={key}>{strategy.label}</option>
                ))}
              </select>
            </div>

            <div className="w6-review-list">
              {sorted.map((review) => (
                <article className="w6-review" key={review.id}>
                  <div className="w6-review-top">
                    <span className="w6-avatar">{review.author[0]}</span>
                    <div>
                      <strong>{review.author}</strong>
                      <small>{review.service} • {formatDate(review.date)}</small>
                    </div>
                    <Stars value={review.rating} />
                  </div>
                  <p>{review.text}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Reviews;
