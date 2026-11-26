import { Link } from "react-router-dom"; 
import "./MasterDashboard.css";
const appointments = [ 
    { 
        name: "Аружан М.", 
        service: "Маникюр с покрытием", 
        time: "Сегодня, 14:00", 
        status: "Подтверждено", 
    },
    { 
        name: "Арайлым Қ.", 
        service: "Маникюр без покрытия", 
        time: "Сегодня, 16:30", 
        status: "Ожидает", 
    }, 
    { 
        name: "Аяулым М.", 
        service: "Дизайн ногтей", 
        time: "Завтра, 11:00", 
        status: "Подтверждено", 
    }, 
];

function MasterDashboard() { return ( <div className="master-dashboard-page"> <header className="md-header"> <Link to="/" className="md-logo">BEAUTY HUB</Link>
    <nav>
      <Link to="/">Главная</Link>
      <Link to="/services">Услуги</Link>
      <Link to="/masters">Мастера</Link>
      <Link to="/#about">О нас</Link>
    </nav>

    <div className="md-user">
      <img src="/images/alina.jpg" alt="Алина" />
      Алина С.
    </div>
  </header>

  <main className="md-layout">
    <aside className="md-sidebar">
      <small>ЛИЧНЫЙ КАБИНЕТ</small>

      <a href="#md-home" className="active">
        ● Панель управления
      </a>
      <a href="#md-bookings">● Мои записи</a>
      <a href="#md-actions">● Услуги и цены</a>
      <a href="#md-actions">● Расписание</a>
      <a href="#md-actions">● Портфолио</a>
      <a href="#md-actions">● Отзывы</a>
      <a href="#md-actions">● Настройки</a>

      <Link to="/login" className="md-logout">
        Выйти из аккаунта
      </Link>
    </aside>

    <div className="md-content" id="md-home">
      <h1>Привет, Алина!</h1>
      <p className="md-description">
        Управляй своими услугами, расписанием и записями клиентов.
      </p>

      <div className="md-stats">
        <div>
          <span>Записей сегодня</span>
          <strong>4</strong>
        </div>
        <div>
          <span>Активные услуги</span>
          <strong>6</strong>
        </div>
        <div>
          <span>Рейтинг</span>
          <strong>4.9 ★</strong>
        </div>
      </div>

      <div className="md-heading" id="md-bookings">
        <h2>Ближайшие записи</h2>
        <span>Смотреть все →</span>
      </div>

      <div className="md-appointments">
        {appointments.map((appointment, index) => (
          <div className="md-appointment" key={index}>
            <div className="md-initial">
              {appointment.name[0]}
            </div>

            <div className="md-appointment-name">
              <strong>{appointment.name}</strong>
              <p>{appointment.service}</p>
            </div>

            <span className="md-time">{appointment.time}</span>

            <span
              className={
                appointment.status === "Подтверждено"
                  ? "md-status confirmed"
                  : "md-status pending"
              }
            >
              {appointment.status}
            </span>

            <Link to="/masters/1">›</Link>
          </div>
        ))}
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