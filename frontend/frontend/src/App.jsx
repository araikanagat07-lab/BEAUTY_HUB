import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Masters from "./Masters";
import MasterProfile from "./MasterProfile";
import Services from "./Services";
import ClientDashboard from "./ClientDashboard";
import MasterDashboard from "./MasterDashboard";
import Booking from "./Booking";
import BookingConfirm from "./BookingConfirm";
import BookingCancel from "./BookingCancel";
import BookingExtras from "./BookingExtras";
import BookingPromo from "./BookingPromo";
import BookingPayment from "./BookingPayment";
import BookingPaymentResult from "./BookingPaymentResult";
import "./App.css";
function Home() { return (  <div className="website">
    {/* Верхнее меню */}
    <header className="header">
      <h2>BEAUTY HUB</h2>

      <nav>
        <Link to="/">Главная</Link>
        <a href="#services">Услуги</a>
        <Link to="/masters">Мастера</Link>
        <a href="#about">О нас</a>
      </nav>

      <Link to="/login" className="pink-button">
        Войти
      </Link>
    </header>

    <main className="main">

      {/* Главная фотография */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            ТВОЯ КРАСОТА —<br />
            В ТВОИХ РУКАХ
          </h1>

          <p>
            Найди своего beauty-мастера и запишись онлайн
            за пару минут — легко и удобно.
          </p>

          <Link to="/masters" className="pink-button">
            Найти мастера
          </Link>
        </div>
      </section>

      {/* Популярные услуги */}
      <section className="services" id="services">
        <h2>Популярные услуги</h2>

        <div className="service-grid">
          <div className="service-card">
          <img
            src="/images/manicure.jpg"
            alt="Маникюр"
            className="service-photo"
            style={{
              width: "100%",
              height: "140px",
              objectFit: "cover",
              display: "block"
            }}
          />
            <h3>Маникюр</h3>
            <p>от 5 000 ₸</p>
          </div>

          <div className="service-card">
          <img
            src="/images/makeup.jpg"
            alt="Макияж"
            style={{
              width: "100%",
              height: "160px",
              objectFit: "cover",
              display: "block",
              borderRadius: "10px"
            }}
          />
            <h3>Макияж</h3>
            <p>от 10 000 ₸</p>
          </div>

          <div className="service-card">
          <img
            src="/images/hair.jpg"
            alt="Укладка"
            style={{
              width: "100%",
              height: "160px",
              objectFit: "cover",
              display: "block",
              borderRadius: "10px"
            }}
          />
            <h3>Укладка</h3>
            <p>от 5 000 ₸</p>
          </div>

          <div className="service-card">
          <img
            src="/images/brows.jpg"
            alt="Брови"
            style={{
              width: "100%",
              height: "160px",
              objectFit: "cover",
              display: "block",
              borderRadius: "10px"
            }}
          />
            <h3>Брови</h3>
            <p>от 4 000 ₸</p>
          </div>
        </div>
      </section>

    </main>
  </div>
); 
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/masters" element={<Masters />} />
        <Route path="/masters/:id" element={<MasterProfile />} />
        <Route path="/services" element={<Services />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/master-dashboard" element={<MasterDashboard />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/booking-confirm" element={<BookingConfirm />} />
        <Route path="/booking-cancel/:id" element={<BookingCancel />} />
        <Route path="/booking-extras" element={<BookingExtras />} />
        <Route path="/booking-promo" element={<BookingPromo />} />
        <Route path="/booking-payment" element={<BookingPayment />} />
        <Route path="/booking-payment-result" element={<BookingPaymentResult />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;