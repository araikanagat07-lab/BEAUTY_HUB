import { useState } from "react"; 
import { Link } from "react-router-dom"; 
import "./Masters.css";

const masters = [ 
    { 
        id: 1, 
        name: "Алина С.", 
        specialty: "Маникюр", 
        rating: 4.9, 
        price: 7000, 
        image: "/images/alina.jpg", 
    }, 
    { 
        id: 2, 
        name: "Диана К.", 
        specialty: "Макияж", 
        rating: 4.8, 
        price: 13000, 
        image: "/images/diana.jpg", 
    }, 
    { 
        id: 3, 
        name: "Айгерим М.", 
        specialty: "Укладка", 
        rating: 5.0, 
        price: 9000, 
        image: "/images/aigerim.jpg",
    }, 
    { 
        id: 4, 
        name: "София Н.", 
        specialty: "Брови", 
        rating: 4.9, 
        price: 8000, 
        image: "/images/sofia.jpg", 
    }, 
    { 
        id: 5, 
        name: "Мадина Т.", 
        specialty: "Маникюр", 
        rating: 4.8, 
        price: 8000, 
        image: "/images/madina.jpg", 
    }, 
    { 
        id: 6, 
        name: "Карина А.", 
        specialty: "Макияж", 
        rating: 5.0, 
        price: 12000, 
        image: "/images/karina.jpg", 
    }, 
];
function Masters() { 
    const [search, setSearch] = useState(""); 
    const [category, setCategory] = useState("Все"); 
    const [price, setPrice] = useState("Все"); 
    const [filtered, setFiltered] = useState(masters);

function handleSearch(event) { 
   event.preventDefault();

const results = masters.filter((master) => {
  const matchesSearch =
    master.name.toLowerCase().includes(search.toLowerCase()) ||
    master.specialty.toLowerCase().includes(search.toLowerCase());

  const matchesCategory =
    category === "Все" || master.specialty === category;

  const matchesPrice =
    price === "Все" ||
    (price === "10000" && master.price <= 10000) ||
    (price === "15000" && master.price <= 15000);

  return matchesSearch && matchesCategory && matchesPrice;
});

setFiltered(results);
}
function resetFilters() { setSearch(""); setCategory("Все"); setPrice("Все"); setFiltered(masters); }
return ( <div className="masters-page"> <header className="masters-header"> <Link to="/" className="masters-logo">BEAUTY HUB</Link>
    <nav className="masters-nav">
      <Link to="/">Главная</Link>
      <Link to="/services">Услуги</Link>
      <Link to="/masters">Мастера</Link>
      <Link to="/#about">О нас</Link>
    </nav>

    <Link to="/login" className="masters-login">Войти</Link>
  </header>

  <main className="masters-main">
    <h1>Найди своего мастера</h1>
    <p className="masters-description">
      Выбирай услуги, сравнивай цены и записывайся онлайн
    </p>

    <form className="masters-filters" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Поиск мастера или услуги..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="Все">Категория: все</option>
        <option value="Маникюр">Маникюр</option>
        <option value="Макияж">Макияж</option>
        <option value="Укладка">Укладка</option>
        <option value="Брови">Брови</option>
      </select>

      <select
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      >
        <option value="Все">Цена: любая</option>
        <option value="10000">До 10 000 ₸</option>
        <option value="15000">До 15 000 ₸</option>
      </select>

      <button type="submit">Найти</button>
    </form>

    {filtered.length !== masters.length && (
      <div className="masters-results">
        <div>
          <h2>Результаты поиска</h2>
          <p>Найдено мастеров: {filtered.length}</p>
        </div>

        <button type="button" onClick={resetFilters}>
          Сбросить фильтры
        </button>
      </div>
    )}

    <div className="masters-grid">
      {filtered.map((master) => (
        <article className="master-card" key={master.id}>
          <div className="master-top">
            <img src={master.image} alt={master.name} />

            <div>
              <h3>{master.name}</h3>
              <p>{master.specialty}</p>
              <span className="master-rating">
                ★ {master.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="master-bottom">
            <strong>
              от {master.price.toLocaleString("ru-RU")} 
            </strong>

            <Link to={`/masters/${master.id}`}>
              Записаться
            </Link>
          </div>
        </article>
       ))}
     </div>

    {filtered.length === 0 && (
      <p className="masters-empty">
        По вашему запросу мастера не найдены.
      </p>
     )}
   </main>
  </div>
); 
}
export default Masters;