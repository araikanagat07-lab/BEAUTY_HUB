import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ClientLayout } from "./components/Layouts";
import { getClientVisits, statusLabels } from "./historyData";
import { hasReviewForBooking } from "./reviewStore";
import { formatDate, formatPrice } from "./mastersData";

const filters = {
  all: { label: "Все", test: () => true },
  completed: { label: "Завершённые", test: (visit) => visit.status === "completed" },
  cancelled: { label: "Отменённые", test: (visit) => visit.status === "cancelled" || visit.status === "missed" },
  noReview: { label: "Без отзыва", test: (visit) => visit.status === "completed" && !visit.reviewed },
};

function VisitHistory() {
  const [filter, setFilter] = useState("all");

  const visits = useMemo(
    () => getClientVisits().map((visit) => ({ ...visit, reviewed: hasReviewForBooking(visit.id) })),
    []
  );

  const completed = visits.filter((visit) => visit.status === "completed");
  const spent = completed.reduce((sum, visit) => sum + Number(visit.price), 0);

  const visitsByMaster = {};
  completed.forEach((visit) => {
    visitsByMaster[visit.masterName] = (visitsByMaster[visit.masterName] || 0) + 1;
  });
  const favorite = Object.entries(visitsByMaster).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const shown = visits.filter(filters[filter].test);

  return (
    <ClientLayout>
      <h1>История посещений</h1>
      <p className="client-subtitle">Все ваши прошедшие визиты, траты и отзывы в одном месте</p>

      <div className="w6-kpis">
        <div><span>Визитов</span><strong>{completed.length}</strong></div>
        <div><span>Потрачено</span><strong>{formatPrice(spent)}</strong></div>
        <div><span>Любимый мастер</span><strong className="w6-kpi-text">{favorite}</strong></div>
        <div><span>Отзывов оставлено</span><strong>{visits.filter((visit) => visit.reviewed).length}</strong></div>
      </div>

      <div className="w6-tabs">
        {Object.entries(filters).map(([key, item]) => (
          <button
            type="button"
            key={key}
            className={filter === key ? "active" : ""}
            onClick={() => setFilter(key)}
          >
            {item.label} <small>{visits.filter(item.test).length}</small>
          </button>
        ))}
      </div>

      <div className="client-booking-list">
        {shown.map((visit) => (
          <article className="client-booking w6-visit" key={visit.id}>
            <img src={`/images/${visit.masterImage}`} alt={visit.masterName} />

            <div className="client-booking-info">
              <h3>{visit.service}</h3>
              <p>
                {visit.masterName} • {formatDate(visit.date)}, {visit.time} • {formatPrice(visit.price)}
              </p>
            </div>

            <span className={`client-status w6-status-${visit.status}`}>
              {statusLabels[visit.status]}
            </span>

            <div className="w6-visit-actions">
              {visit.status === "completed" &&
                (visit.reviewed ? (
                  <span className="w6-reviewed">★ Отзыв оставлен</span>
                ) : (
                  <Link className="w6-btn w6-btn-small" to={`/masters/${visit.masterId}/reviews?booking=${visit.id}`}>
                    Оставить отзыв
                  </Link>
                ))}
              <Link className="w6-btn-outline" to={`/booking/${visit.masterId}`}>
                Повторить
              </Link>
            </div>
          </article>
        ))}

        {shown.length === 0 && <p className="w6-empty">Здесь пока пусто.</p>}
      </div>
    </ClientLayout>
  );
}

export default VisitHistory;
