import { Link } from "react-router-dom"; 
import "./MasterDashboard.css";
import { NotificationBell } from "./components/Layouts";
import { getMasterName, isDemoMaster, firstName, logout } from "./currentUser";
import { getMasterUpcoming } from "./historyData";
import { getRatingSummary } from "./reviewStore";
import { formatDate, getMasterServices } from "./mastersData";
const statusText = { pending: "Ожидает", confirmed: "Подтверждено" };

function whenText(booking) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const day =
    booking.date === today ? "Сегодня"
    : booking.date === tomorrow ? "Завтра"
    : formatDate(booking.date, { day: "numeric", month: "long" });
  return `${day}, ${booking.time}`;
}

function MasterDashboard() {
  const masterName = getMasterName();
  const demo = isDemoMaster(); // кабинет демо-мастера Алины (id 1)
  const appointments = demo ? getMasterUpcoming(1) : [];
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = appointments.filter((item) => item.date === today).length;
  const servicesCount = demo ? getMasterServices(1).length : 0;
  const rating = demo ? getRatingSummary(1).average.toFixed(1) : "—";
  return ( <div className="master-dashboard-page"> <header className="md-header"> <Link to="/" className="md-logo">BEAUTY HUB</Link>
    <nav>
      <Link to="/">Главная</Link>
      <Link to="/services">Услуги</Link>
      <Link to="/masters">Мастера</Link>
      <Link to="/#about">О нас</Link>
    </nav>

    <div className="w6-header-right">
      <NotificationBell audience="master" />
      <div className="md-user">
        {isDemoMaster() ? (
          <img src="/images/alina.jpg" alt={masterName} />
        ) : (
          <span className="w6-user-avatar">{masterName[0]}</span>
        )}
        {masterName}
      </div>
    </div>
  </header>

  <main className="md-layout">
    <aside className="md-sidebar">
      <small>ЛИЧНЫЙ КАБИНЕТ</small>

      <a href="#md-home" className="active">
        ● Панель управления
      </a>
      <a href="#md-bookings">● Мои записи</a>
      <Link to="/master-dashboard/stats">● Статистика</Link>
      <a href="#md-actions">● Услуги и цены</a>
      <a href="#md-actions">● Расписание</a>
      <a href="#md-actions">● Портфолио</a>
      <Link to="/masters/1/reviews">● Отзывы</Link>
      <Link to="/notifications?role=master">● Уведомления</Link>
      <a href="#md-actions">● Настройки</a>

      <Link to="/login" className="md-logout" onClick={logout}>
        Выйти из аккаунта
      </Link>
    </aside>

    <div className="md-content" id="md-home">
      <h1>Привет, {firstName(masterName)}!</h1>
      <p className="md-description">
        Управляй своими услугами, расписанием и записями клиентов.
      </p>

      <div className="md-stats">
        <div>
          <span>Записей сегодня</span>
          <strong>{todayCount}</strong>
        </div>
        <div>
          <span>Активные услуги</span>
          <strong>{servicesCount}</strong>
        </div>
        <div>
          <span>Рейтинг</span>
          <strong>{rating} ★</strong>
        </div>
      </div>

      <div className="md-heading" id="md-bookings">
        <h2>Ближайшие записи</h2>
        <Link to="/master-dashboard/stats" className="w6-link">Управлять заявками →</Link>
      </div>

      <div className="md-appointments">
        {appointments.map((appointment) => (
          <div className="md-appointment" key={appointment.id}>
            <div className="md-initial">
              {appointment.clientName[0]}
            </div>

            <div className="md-appointment-name">
              <strong>{appointment.clientName}</strong>
              <p>{appointment.service}</p>
            </div>

            <span className="md-time">{whenText(appointment)}</span>

            <span className={`md-status ${appointment.status}`}>
              {statusText[appointment.status]}
            </span>

            <Link to="/master-dashboard/stats">›</Link>
          </div>
        ))}

        {appointments.length === 0 && (
          <p className="w6-empty">
            {demo ? "Пока нет записей. Когда клиент запишется, заявка появится здесь." : "Пока нет записей. Клиенты смогут записаться, когда ваш профиль появится в каталоге."}
          </p>
        )}
      </div>

      <h2 className="md-actions-heading" id="md-actions">
        Быстрые действия
      </h2>

      <div className="md-actions">
        <Link to="/masters/1">
          <span>＋</span>
          <strong>Добавить услугу</strong>
          <small>Услуги и цены</small>
        </Link>

        <Link to="/masters/1">
          <span>＋</span>
          <strong>Изменить график</strong>
          <small>Расписание</small>
        </Link>

        <Link to="/masters/1">
          <span>＋</span>
          <strong>Обновить портфолио</strong>
          <small>Мои работы</small>
        </Link>
      </div>
    </div>
  </main>
</div>
); }
export default MasterDashboard;