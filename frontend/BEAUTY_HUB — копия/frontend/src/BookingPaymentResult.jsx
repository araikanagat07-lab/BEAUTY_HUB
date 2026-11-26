import { Link } from "react-router-dom";
import CheckoutHeader from "./CheckoutHeader";
import { getReceipt, money } from "./checkoutData";
import "./BookingPaymentResult.css";

export default function BookingPaymentResult() {
  const receipt = getReceipt();
  return (
    <div className="co-page">
      <CheckoutHeader label="Профиль" />
      <main className="co-shell co-result-shell">
        <h1>Результат оплаты</h1>
        {receipt ? (
          <div className="co-result-card">
            <div className="co-check-circle">✓</div>
            <h2>Оплата прошла успешно!</h2>
            <div className="co-receipt">
              <div><span>Номер заказа</span><strong>{receipt.order}</strong></div>
              <div><span>Способ оплаты</span><strong>Демонстрационная оплата</strong></div>
              <div><strong>Итого</strong><b>{money(receipt.total)}</b></div>
            </div>
            <Link to={`/booking-cancel/${receipt.bookingId}`} className="co-button co-result-button">Посмотреть мою запись</Link>
            <Link to="/" className="co-back-link">Вернуться на главную</Link>
          </div>
        ) : (
          <div className="co-result-card"><h2>Пока нет оплаченного заказа</h2><p>Выбери мастера и оформи запись.</p><Link className="co-button co-result-button" to="/masters">К мастерам</Link></div>
        )}
      </main>
    </div>
  );
}
