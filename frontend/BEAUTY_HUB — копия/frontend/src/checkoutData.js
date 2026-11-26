// Демонстрационная корзина. Здесь нет реальной оплаты или хранения данных карты.
const CART_KEY = "beautyhub_checkout";
const DRAFT_KEY = "beautyhub_draft";
const RECEIPT_KEY = "beautyhub_receipt";

export const extras = [
  { id: "design", name: "Дизайн ногтей", description: "Небольшой рисунок или декор", price: 2000, image: "/images/nails1.jpg" },
  { id: "strengthening", name: "Укрепление ногтей", description: "Дополнительное укрепляющее покрытие", price: 1500, image: "/images/nails2.jpg" },
  { id: "removal", name: "Снятие старого покрытия", description: "Аккуратное снятие предыдущего покрытия", price: 1000, image: "/images/nails3.jpg" },
];

export function getDraft() {
  try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null"); }
  catch { return null; }
}
export function getCart() {
  try { return JSON.parse(sessionStorage.getItem(CART_KEY) || "null") || { selected: [], promo: "" }; }
  catch { return { selected: [], promo: "" }; }
}
export function saveCart(cart) { sessionStorage.setItem(CART_KEY, JSON.stringify(cart)); }
export function getReceipt() {
  try { return JSON.parse(sessionStorage.getItem(RECEIPT_KEY) || "null"); }
  catch { return null; }
}
export function saveReceipt(receipt) { sessionStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt)); }

export function calculateTotal(draft, cart) {
  const base = Number(draft?.price) || 0;
  const additions = extras.filter(x => cart.selected?.includes(x.id));
  const extraTotal = additions.reduce((sum, x) => sum + x.price, 0);
  const subtotal = base + extraTotal;
  const promo = (cart.promo || "").toUpperCase();
  const discount = promo === "BEAUTY10" ? Math.round(subtotal * 0.1) : 0;
  return { base, additions, extraTotal, subtotal, discount, total: subtotal - discount };
}
export const money = value => `${Number(value).toLocaleString("ru-RU")} ₸`;
