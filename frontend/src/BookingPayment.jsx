import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutHeader from "./CheckoutHeader";
import { getCart, getDraft, saveReceipt, calculateTotal, money } from "./checkoutData";
import { createBooking } from "./bookingStore";
import "./BookingPayment.css";

export default function BookingPayment() {
  const navigate = useNavigate();
  const draft = getDraft();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!draft) return <div className="co-empty"><h2>Сначала выбери запись</h2><Link to="/masters">К мастерам</Link></div>;
  const totals = calculateTotal(draft, getCart());

  function pay(event) {
    event.preventDefault();
    if (processing) return;
    if (new Date(`${draft.date}T${draft.time}:00`) <= new Date()) {
      setError("Выбранное время уже прошло. Выбери другую дату.");
      return;
    }
    setProcessing(true);
    const result = createBooking({ ...draft, extras: totals.additions.map(x => x.id), discount: totals.discount, total: totals.total, paymentStatus: "demo_paid" });
    if (!result.success) {
      setError(result.message);
      setProcessing(false);
      return;
    }
    const receipt = {
      bookingId: result.booking.id,
      order: `BH-${new Date().getFullYear()}-${result.booking.id.slice(0, 5).toUpperCase()}`,
      total: totals.total,
      master: draft.masterName,
      service: draft.service,
      date: draft.date,
      time: draft.time,
    };
    saveReceipt(receipt);
    sessionStorage.removeItem("beautyhub_draft");
    sessionStorage.removeItem("beautyhub_checkout");
    navigate("/booking-payment-result", { replace: true });
  }

  return (
    <div className="co-page">
      <CheckoutHeader label="Мой профиль" />
      <main className="co-shell co-soft-shell">
        <div className="co-step">ОПЛАТА · ШАГ 2 ИЗ 2</div>
        <h1>Оплата банковской картой</h1>
        <div className="co-layout">
          <section className="co-white-card">
            <h2>Данные банковской карты</h2>
            <form id="co-payment-form" onSubmit={pay}>
              <label className="co-field">Номер карты<input placeholder="0000 0000 0000 0000" inputMode="numeric" autoComplete="off" maxLength={19} required pattern="[0-9 ]{16,19}" /></label>
              <label className="co-field">Имя держателя карты<input placeholder="IVAN IVANOV" autoComplete="off" required maxLength={40} /></label>
              <div className="co-two-fields">
                <label className="co-field">Срок действия<input placeholder="ММ / ГГ" autoComplete="off" required pattern="(0[1-9]|1[0-2])\s?/\s?\d{2}" /></label>
                <label className="co-field">CVV / CVC<input placeholder="***" type="password" inputMode="numeric" autoComplete="off" required maxLength={3} pattern="[0-9]{3}" /></label>
              </div>
            </form>
          </section>
          <aside className="co-summary co-summary-outline">
            <h2>Ваш заказ</h2>
            <div className="co-mini-service"><img src={`/images/${draft.masterImage}`} alt=""/><div><strong>{draft.service}</strong><small>Мастер: {draft.masterName}</small></div></div>
            <div className="co-summary-line"><span>Основная услуга</span><span>{money(totals.base)}</span></div>
            <div className="co-summary-line"><span>Дополнительные услуги</span><span>{money(totals.extraTotal)}</span></div>
            <div className="co-summary-line"><span>Скидка по промокоду</span><span>− {money(totals.discount)}</span></div>
            <div className="co-summary-line co-sum-total"><strong>Итого к оплате</strong><b>{money(totals.total)}</b></div>
            {error && <p className="co-error">{error}</p>}
            <button form="co-payment-form" type="submit" disabled={processing} className="co-button">{processing ? "Сохранение..." : `Оплатить ${money(totals.total)}`}</button>
            <Link className="co-back-link" to="/booking-promo">← Вернуться назад</Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
