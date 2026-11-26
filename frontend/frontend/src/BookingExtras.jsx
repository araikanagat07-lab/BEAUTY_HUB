import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutHeader from "./CheckoutHeader";
import { extras, getCart, getDraft, saveCart, calculateTotal, money } from "./checkoutData";
import "./BookingExtras.css";

export default function BookingExtras() {
  const navigate = useNavigate();
  const draft = getDraft();
  const [selected, setSelected] = useState(() => getCart().selected || []);

  if (!draft) return <div className="co-empty"><h2>Сначала выбери услугу и время</h2><Link to="/masters">К мастерам</Link></div>;

  const nailService = /маникюр|педикюр|ногт/i.test(draft.service);
  const choices = nailService ? extras : [];
  const cart = { selected, promo: getCart().promo || "" };
  const totals = calculateTotal(draft, cart);
  function toggle(id) {
    setSelected(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  }
  function next() { saveCart(cart); navigate("/booking-promo"); }

  return (
    <div className="co-page">
      <CheckoutHeader />
      <main className="co-shell">
        <h1>Дополнительные услуги</h1>
        <div className="co-layout">
          <div className="co-primary-area">
            <div className="co-base-card">
              <img src={nailService ? "/images/nails1.jpg" : `/images/${draft.masterImage}`} alt="Основная услуга" />
              <div><strong>{draft.service}</strong><small>Основная услуга · {draft.duration} минут</small></div>
              <b>{money(draft.price)}</b>
            </div>
            <h2>Добавить к записи</h2>
            {choices.length ? choices.map(item => (
              <button key={item.id} type="button" className={`co-extra-card ${selected.includes(item.id) ? "co-selected" : ""}`} onClick={() => toggle(item.id)} aria-pressed={selected.includes(item.id)}>
                <img src={item.image} alt="" />
                <span className="co-extra-description"><strong>{item.name}</strong><small>{item.description}</small></span>
                <b>{money(item.price)}</b>
                <span className="co-add-icon">{selected.includes(item.id) ? "✓" : "+"}</span>
              </button>
            )) : <div className="co-base-card">Для этой услуги дополнительных процедур пока нет. Можно продолжить без них.</div>}
            <Link to={`/booking/${draft.masterId}`} className="co-back-link">← Изменить дату или услугу</Link>
          </div>
          <aside className="co-summary">
            <h2>Ваш заказ</h2>
            <div className="co-summary-line"><span>Основная услуга</span><span>{money(totals.base)}</span></div>
            <div className="co-summary-line"><span>Дополнительные услуги</span><span>{money(totals.extraTotal)}</span></div>
            <div className="co-summary-line co-sum-total"><strong>Итого</strong><b>{money(totals.subtotal)}</b></div>
            <p>Стоимость обновится после выбора дополнительных услуг.</p>
            <button type="button" onClick={next} className="co-button">Перейти к оплате</button>
          </aside>
        </div>
      </main>
    </div>
  );
}
