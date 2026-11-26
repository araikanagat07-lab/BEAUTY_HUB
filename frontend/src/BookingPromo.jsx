import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutHeader from "./CheckoutHeader";
import { getCart, getDraft, saveCart, calculateTotal, money } from "./checkoutData";
import "./BookingPromo.css";

export default function BookingPromo() {
  const navigate = useNavigate();
  const draft = getDraft();
  const [code, setCode] = useState(() => getCart().promo || "");
  const [promo, setPromo] = useState(() => getCart().promo || "");
  const [feedback, setFeedback] = useState("");

  if (!draft) return <div className="co-empty"><h2>Нет выбранной записи</h2><Link to="/masters">Выбрать мастера</Link></div>;
  const cart = getCart();
  const totals = calculateTotal(draft, { ...cart, promo });
  const apply = event => {
    event.preventDefault();
    if (code.trim().toUpperCase() === "BEAUTY10") {
      setPromo("BEAUTY10");
      saveCart({ ...cart, promo: "BEAUTY10" });
      setFeedback("Промокод применён: скидка 10%!");
    } else {
      setPromo("");
      saveCart({ ...cart, promo: "" });
      setFeedback(code ? "Промокод не найден" : "Введите промокод");
    }
  };
  function proceed() { saveCart({ ...getCart(), promo }); navigate("/booking-payment"); }

  return (
    <div className="co-page">
      <CheckoutHeader label="Мой профиль" />
      <main className="co-shell co-soft-shell">
        <h1>Промокод и скидка</h1>
        <p className="co-subtitle">Введите промокод, чтобы получить скидку на заказ</p>
        <div className="co-layout">
          <section className="co-white-card co-order-details">
            <h2>Ваш заказ</h2>
            <div className="co-master-line"><img src={`/images/${draft.masterImage}`} alt={draft.masterName} /><div><strong>{draft.masterName}</strong><small>Мастер · BEAUTY HUB</small></div></div>
            <div className="co-summary-line"><span>{draft.service}</span><b>{money(totals.base)}</b></div>
            {totals.additions.map(item => <div className="co-summary-line" key={item.id}><span>{item.name}</span><b>{money(item.price)}</b></div>)}
            <h3>Промокод</h3>
            <form onSubmit={apply} className="co-promo-form"><input value={code} onChange={e => setCode(e.target.value)} placeholder="Введите промокод" aria-label="Промокод" /><button type="submit" className="co-button">Применить</button></form>
            <Link className="co-back-link" to="/booking-extras">← Назад к дополнительным услугам</Link>
          </section>
          <aside className="co-summary co-summary-outline">
            <h2>Итого к оплате</h2>
            <div className="co-summary-line"><span>Стоимость услуг</span><span>{money(totals.subtotal)}</span></div>
            <div className="co-summary-line"><span>Скидка по промокоду</span><span>− {money(totals.discount)}</span></div>
            <div className="co-summary-line co-sum-total"><strong>К оплате</strong><b>{money(totals.total)}</b></div>
            <button type="button" className="co-button" onClick={proceed}>Перейти к оплате</button>
            <p>Скидка будет учтена в итоговой сумме</p>
          </aside>
        </div>
      </main>
    </div>
  );
}
