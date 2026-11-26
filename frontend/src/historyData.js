import { getBookings } from "./bookingStore";
import { getMaster, getMasterServices, bookingStart, CLIENT_NAME } from "./mastersData";
import { getClientId, isMine } from "./currentUser";


export function effectiveStatus(booking) {
  const passed = bookingStart(booking) <= new Date();
  if (passed && booking.status === "confirmed") return "completed";
  if (passed && booking.status === "pending") return "missed";
  return booking.status;
}

export const statusLabels = {
  pending: "Ожидает",
  confirmed: "Подтверждено",
  completed: "Завершено",
  cancelled: "Отменено",
  missed: "Не подтверждено",
};

function withMaster(visit) {
  const master = getMaster(visit.masterId);
  return {
    ...visit,
    masterName: visit.masterName || master?.name,
    masterImage: visit.masterImage || master?.image,
  };
}

const demoVisits = [
  { id: "demo-v1", masterId: "1", service: "Маникюр с покрытием", price: 9000, duration: 90, date: "2026-11-10", time: "15:30", status: "completed" },
  { id: "demo-v2", masterId: "3", service: "Локоны", price: 11000, duration: 75, date: "2026-10-25", time: "11:30", status: "completed" },
  { id: "demo-v3", masterId: "4", service: "Ламинирование бровей", price: 10000, duration: 60, date: "2026-10-08", time: "14:00", status: "completed" },
  { id: "demo-v4", masterId: "2", service: "Вечерний макияж", price: 13000, duration: 90, date: "2026-09-20", time: "17:00", status: "cancelled" },
  { id: "demo-v5", masterId: "1", service: "Дизайн ногтей", price: 2000, duration: 30, date: "2026-09-02", time: "10:00", status: "completed" },
  { id: "demo-v6", masterId: "6", service: "Дневной макияж", price: 10000, duration: 60, date: "2026-08-14", time: "18:30", status: "completed" },
].map(withMaster);


export function getClientVisits() {
  const real = getBookings()
    .filter(isMine)
    .filter(
      (booking) =>
        bookingStart(booking) <= new Date() ||
        booking.status === "cancelled" ||
        booking.status === "completed"
    )
    .map((booking) =>
      withMaster({ ...booking, price: booking.total ?? booking.price, status: effectiveStatus(booking) })
    );

  return [...real, ...(getClientId() ? [] : demoVisits)].sort((a, b) =>
    `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)
  );
}


export function getClientUpcoming() {
  return getBookings()
    .filter(isMine)
    .filter((booking) => ["pending", "confirmed"].includes(effectiveStatus(booking)))
    .map(withMaster)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}


export function getMasterUpcoming(masterId) {
  return getBookings()
    .filter((booking) => String(booking.masterId) === String(masterId))
    .filter((booking) => ["pending", "confirmed"].includes(effectiveStatus(booking)))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}


const clientNames = ["Аружан М.", "Айжан Б.", "Томирис К.", "Дана Е.", "Алия С.", "Мерей А.", "Камила Н.", "Инкар М.", "Сабина Т.", "Асель Ж."];


function seededRandom(seed) {
  let value = seed * 9301 + 49297;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function demoMasterBookings(masterId) {
  const services = getMasterServices(masterId);
  const random = seededRandom(Number(masterId) * 17);
  const now = new Date();
  const result = [];

  for (let back = 5; back >= 0; back -= 1) {
    const month = new Date(now.getFullYear(), now.getMonth() - back, 1);
    const lastDay = back === 0 ? Math.max(now.getDate() - 1, 1) : 28;
    const count = Math.round((12 + random() * 8 + (5 - back) * 2) * (back === 0 ? lastDay / 30 : 1));

    for (let i = 0; i < count; i += 1) {
      const service = services[Math.floor(random() * services.length)];
      const day = 1 + Math.floor(random() * lastDay);
      const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      result.push({
        id: `demo-${masterId}-${back}-${i}`,
        masterId: String(masterId),
        clientName: clientNames[Math.floor(random() * clientNames.length)],
        service: service.name,
        price: service.price,
        duration: service.duration,
        date,
        time: ["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"][Math.floor(random() * 6)],
        status: random() < 0.08 ? "cancelled" : "completed",
        demo: true,
      });
    }
  }

  return result;
}

export function getMasterBookings(masterId) {
  const real = getBookings()
    .filter((booking) => String(booking.masterId) === String(masterId))
    .map((booking) => ({
      ...booking,
      price: booking.total ?? booking.price,
      clientName: booking.clientName || CLIENT_NAME,
    }));

  return [...real, ...demoMasterBookings(masterId)];
}
