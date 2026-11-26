import { createService } from "./patterns/ServiceFactory";       
import { extras, decorateService } from "./patterns/ServiceDecorators"; 
import { getDiscountStrategy } from "./patterns/DiscountStrategies";  
import { getMaster } from "./mastersData";

export { extras };

const CART_KEY = "beautyhub_checkout";
const DRAFT_KEY = "beautyhub_draft";
const RECEIPT_KEY = "beautyhub_receipt";


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
  const category = getMaster(draft.masterId)?.job;
  const selected = cart.selected || [];


  const baseService = createService(category, draft.service, Number(draft.price));


  const service = baseService.supportsExtras ? decorateService(baseService, selected) : baseService;

 
  const strategy = getDiscountStrategy(cart.promo || "");

  const base = baseService.getPrice();
  const subtotal = service.getPrice();
  const discount = strategy.calculate(subtotal);

  return {
    base,
    additions: baseService.supportsExtras ? extras.filter((x) => selected.includes(x.id)) : [],
    extraTotal: subtotal - base,
    subtotal,
    discount,
    total: subtotal - discount,
    supportsExtras: baseService.supportsExtras,
  };
}

export const money = value => `${Number(value).toLocaleString("ru-RU")} ₸`;
