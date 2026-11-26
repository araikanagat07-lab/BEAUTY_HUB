import { Link, useParams } from "react-router-dom"; 
import "./MasterProfile.css";

const masters = { 
    1: { 
        name: "Алина С.", 
        specialty: "Мастер маникюра", 
        rating: "4.9", 
        reviews: 128, 
        description: "Маникюр, педикюр, дизайн ногтей", 
        image: "/images/alina.jpg", 
        services: [ 
            { name: "Маникюр с покрытием", duration: 90, price: 9000 }, 
            { name: "Маникюр без покрытия", duration: 45, price: 7000 }, 
            { name: "Дизайн ногтей", duration: 30, price: 2000 }, 
        ], 
    },
2: { 
    name: "Диана К.", 
    specialty: "Визажист", 
    rating: "4.8", 
    reviews: 94, 
    description: "Макияж и визаж", 
    image: "/images/diana.jpg", 
    services: [ 
        { name: "Вечерний макияж", duration: 90, price: 13000 }, 
    ], 
},
3: { 
    name: "Айгерим М.", 
    specialty: "Парикмахер", 
    rating: "5.0", 
    reviews: 86, 
    description: "Укладка и причёски", 
    image: "/images/aigerim.jpg", 
    services: [ 
        { name: "Укладка волос", duration: 60, price: 9000 }, 
    ], 
},
4: { 
    name: "София Н.", 
    specialty: "Бровист", 
    rating: "4.9", 
    reviews: 73, 
    description: "Коррекция и оформление бровей", 
    image: "/images/sofia.jpg", 
    services: [ 
        { name: "Оформление бровей", duration: 45, price: 8000 }, 
    ],
},
5: { 
    name: "Мадина Т.", 
    specialty: "Мастер маникюра", 
    rating: "4.8", 
    reviews: 105, 
    description: "Маникюр и дизайн ногтей", 
    image: "/images/madina.jpg", 
    services: [ 
        { name: "Маникюр", duration: 90, price: 8000 }, 
    ], 
},
6: { 
    name: "Карина А.", 
    specialty: "Визажист", 
    rating: "5.0", 
    reviews: 67, 
    description: "Макияж для особых случаев", 
    image: "/images/karina.jpg", 
    services: [ 
        { name: "Профессиональный макияж", duration: 90, price: 12000 }, 
     ], 
   }, 
};
function MasterProfile() { 
    const { id } = useParams(); 
    const master = masters[id];
if (!master) { 
    return ( 
      <div className="profile-not-found"> 
        <h2>Мастер не найден</h2> 
        <Link to="/masters">Вернуться к мастерам</Link> 
      </div> 
      );
}
return ( <div className="profile-page">
  <header className="profile-header">
    <Link to="/" className="profile-logo">
      BEAUTY HUB
    </Link>

    <nav>
      <Link to="/">Главная</Link>
      <Link to="/services">Услуги</Link>
      <Link to="/masters">Мастера</Link>
      <Link to="/#about">О нас</Link>
    </nav>

    <Link to="/login" className="profile-login">
      Войти
    </Link>
  </header>

  <main className="profile-main">

    <h1>Профиль мастера</h1>

    <section className="profile-info">

      <img
        className="profile-avatar"
        src={master.image}
        alt={master.name}
      />

      <div className="profile-details">
        <h2>{master.name}</h2>

        <p>{master.specialty} • Алматы</p>

        <Link to={`/masters/${id}/reviews`} className="profile-rating">
          ★ {master.rating} · {master.reviews} отзывов →
        </Link>

        <p>{master.description}</p>
      </div>

      <Link
        to={`/booking/${id}`}
        className="profile-book-button"
      >
        Выбрать время
      </Link>

    </section>

    <section className="profile-content">

      <div className="profile-services">
        <h2>Услуги и цены</h2>

        {master.services.map((service, index) => (
          <div className="profile-service" key={index}>

            <div>
              <h3>{service.name}</h3>
              <p>{service.duration} минут</p>
            </div>

            <strong>
              {service.price.toLocaleString("ru-RU")} ₸
            </strong>

          </div>
        ))}
      </div>

      <div className="profile-portfolio">
        <h2>Портфолио</h2>

        <div className="profile-photo-grid">
  {(id === "1"
    ? ["nails1.jpg", "nails2.jpg", "nails3.jpg", "nails4.jpg"]
    : id === "2"
    ? ["diana1.jpg", "diana2.jpg", "diana3.jpg", "diana4.jpg"]
    : id === "3"
    ? ["aigerim1.jpg", "aigerim2.jpg", "aigerim3.jpg", "aigerim4.jpg"]
    : id === "4"
    ? ["sofia1.jpg", "sofia2.jpg", "sofia3.jpg", "sofia4.jpg"]
    : id === "5"
    ? ["madina1.jpg", "madina2.jpg", "madina3.jpg", "madina4.jpg"]
    : ["karina1.jpg", "karina2.jpg", "karina3.jpg", "karina4.jpg"]
  ).map((photo) => (
    <img
      key={photo}
      src={`/images/${photo}`}
      alt={`Работа мастера ${master.name}`}
    />
  ))}
</div>

      </div>

    </section>

  </main>
</div>
); }
export default MasterProfile;