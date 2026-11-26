import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Services.css";
const services = [
  {
    name: "Маникюр",
    category: "Ногтевой сервис",
    price: 5000,
    image: "/images/manicure.jpg",
    search: "Маникюр",
  },

  {
    name: "Макияж",
    category: "Макияж и визаж",
    price: 10000,
    image: "/images/makeup.jpg",
    search: "Макияж",
  },

  {
    name: "Укладка",
    category: "Волосы",
    price: 5000,
    image: "/images/hair.jpg",
    search: "Укладка",
  },

  {
    name: "Брови",
    category: "Брови и ресницы",
    price: 4000,
    image: "/images/brows.jpg",
    search: "Брови",
  },

  {
    name: "Педикюр",
    category: "Уход за ногтями",
    price: 7000,
    image: "/images/pedicure.jpg",
    search: "Маникюр",
  },

  {
    name: "Уход за лицом",
    category: "Уход и SPA",
    price: 8000,
    image: "/images/facial.jpg",
    search: "",
  },

];

function Services() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [price, setPrice] = useState("Все");
  const [results, setResults] = useState(services);
  function handleSearch(event) {
    event.preventDefault();
    const filtered = services.filter((service) => {
      const matchesText =
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        category === "Все" || service.name === category;
      const matchesPrice =
        price === "Все" ||
        (price === "10000" && service.price <= 10000) ||
        (price === "5000" && service.price <= 5000);
      return matchesText && matchesCategory && matchesPrice;
    });
    setResults(filtered);
  }
  function openMasters(service) {
    if (service.search) {
      navigate(`/masters?category=${encodeURIComponent(service.search)}`);
    } else {
      navigate("/masters");
    }
  }

  return (
    <div className="services-page">
      <header className="services-header">
        <Link to="/" className="services-logo">BEAUTY HUB</Link>
        <nav>

          <Link to="/">Главная</Link>

          <Link to="/services">Услуги</Link>

          <Link to="/masters">Мастера</Link>

          <Link to="/#about">О нас</Link>

        </nav>
        <Link to="/login" className="services-login">Войти</Link>
      </header>
      <main className="services-main">
        <h1>Каталог beauty-услуг</h1>

        <p className="services-description">
          Выбирай любимые процедуры, сравнивай цены и находи своего мастера
        </p>
        <form className="services-search" onSubmit={handleSearch}>
          <input
            placeholder="Поиск услуги..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="Все">Категория: все</option>
            {services.map((service) => (
              <option key={service.name} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
          <select
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          >
            <option value="Все">Цена: любая</option>
            <option value="5000">До 5 000 ₸</option>
            <option value="10000">До 10 000 ₸</option>
          </select>
          <button type="submit">Найти</button>
        </form>

        <div className="services-section-title">
          <h2>Популярные услуги</h2>
          <span>{results.length} услуг</span>
        </div>
        <div className="services-catalog-grid">
          {results.map((service) => (
            <article className="services-catalog-card" key={service.name}>
              <img src={service.image} alt={service.name} />
              <h3>{service.name}</h3>
              <p>{service.category}</p>
              <div className="services-card-bottom">
                <strong>
                  от {service.price.toLocaleString("ru-RU")} ₸
                </strong>
                <button
                  type="button"
                  onClick={() => openMasters(service)}
                >
                  Мастера →
                </button>
              </div>
            </article>
          ))}
        </div>
        {results.length === 0 && (
          <p className="services-no-results">
            По вашему запросу услуги не найдены.
          </p>
        )}
      </main>
    </div>
  );
}
export default Services;