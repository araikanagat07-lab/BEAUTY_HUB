import { useEffect, useState } from "react";
import { getNotifications, subscribe } from "./notificationStore";
import { isMine, isDemoMaster } from "./currentUser";

// Хук-наблюдатель: компонент подписывается на хранилище уведомлений
// и перерисовывается при каждом новом уведомлении.
export function useNotifications(audience) {
  const [list, setList] = useState(() => getNotifications());

  useEffect(() => subscribe(() => setList(getNotifications())), []);

  const filtered = list
    .filter((item) => !audience || item.audience === audience)
    // клиент видит только свои уведомления, новый мастер — пока ничего из демо Алины
    .filter((item) => (item.audience === "client" ? isMine(item) : isDemoMaster()));
  return { list: filtered, unread: filtered.filter((item) => !item.read).length };
}
