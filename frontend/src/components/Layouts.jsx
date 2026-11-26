import { Link, NavLink } from "react-router-dom";
import { useNotifications } from "../useNotifications";
import { getClientName, getMasterName, isDemoMaster, logout } from "../currentUser";
import "../ClientDashboard.css";
import "../MasterDashboard.css";
import "../Week6.css";

export function NotificationBell({ audience }) {
  const { unread } = useNotifications(audience);
  const to = audience === "master" ? "/notifications?role=master" : "/notifications";

  return (
    <Link to={to} className="w6-bell" aria-label={`Уведомления: ${unread} новых`}>
      <span aria-hidden="true">🔔</span>
      {unread > 0 && <span className="w6-bell-badge">{unread}</span>}
    </Link>
  );
}

function SiteNav() {
  return (
    <nav>
      <Link to="/">Главная</Link>
      <Link to="/services">Услуги</Link>
      <Link to="/masters">Мастера</Link>
      <Link to="/#about">О нас</Link>
    </nav>
  );
}

export function ClientLayout({ children }) {
  const clientName = getClientName();
  const { unread } = useNotifications("client");

  return (
    <div className="client-page">
      <header className="client-header">
        <Link to="/" className="client-logo">BEAUTY HUB</Link>
        <SiteNav />
        <div className="w6-header-right">
          <NotificationBell audience="client" />
          <div className="client-header-user">
            <span className="client-user-avatar">{clientName[0]}</span>
            {clientName}
          </div>
        </div>
      </header>

      <main className="client-layout">
        <aside className="client-sidebar">
          <small>ЛИЧНЫЙ КАБИНЕТ</small>
          <NavLink to="/client" end>● Мой профиль</NavLink>
          <NavLink to="/client/history">● История посещений</NavLink>
          <NavLink to="/notifications">
            ● Уведомления {unread > 0 && <span className="w6-side-badge">{unread}</span>}
          </NavLink>
          <NavLink to="/masters">● Найти мастера</NavLink>
          <Link to="/login" className="client-logout" onClick={logout}>Выйти из аккаунта</Link>
        </aside>

        <div className="client-content w6-content">{children}</div>
      </main>
    </div>
  );
}

export function MasterLayout({ children }) {
  const masterName = getMasterName();
  const { unread } = useNotifications("master");

  return (
    <div className="master-dashboard-page">
      <header className="md-header">
        <Link to="/" className="md-logo">BEAUTY HUB</Link>
        <SiteNav />
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
          <NavLink to="/master-dashboard" end>● Панель управления</NavLink>
          <NavLink to="/master-dashboard/stats">● Статистика</NavLink>
          <NavLink to="/masters/1/reviews">● Отзывы</NavLink>
          <NavLink to="/notifications?role=master">
            ● Уведомления {unread > 0 && <span className="w6-side-badge">{unread}</span>}
          </NavLink>
          <Link to="/login" className="md-logout" onClick={logout}>Выйти из аккаунта</Link>
        </aside>

        <div className="md-content w6-content">{children}</div>
      </main>
    </div>
  );
}
