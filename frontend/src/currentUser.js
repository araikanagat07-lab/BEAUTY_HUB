// Кто сейчас вошёл на сайт (данные приходят с сервера после входа/регистрации).
// Если никто не вошёл — показываем демо-имена, как раньше.
import { getSavedUser, logoutUser } from "./authApi";

export function getUser() {
  return getSavedUser();
}

export function getClientName() {
  const user = getSavedUser();
  return user?.role === "client" ? user.full_name : "Аружан М.";
}

export function getMasterName() {
  const user = getSavedUser();
  return user?.role === "master" ? user.full_name : "Алина С.";
}

// Демо-мастер Алина — если вошёл другой мастер, показываем букву вместо фото
export function isDemoMaster() {
  return getSavedUser()?.role !== "master";
}

export function firstName(fullName) {
  return fullName.trim().split(/\s+/)[0];
}

// id вошедшего клиента (null — гость/демо)
export function getClientId() {
  const user = getSavedUser();
  return user?.role === "client" ? user.user_id : null;
}

// Запись или уведомление принадлежит текущему клиенту?
export function isMine(item) {
  const id = getClientId();
  return id ? item.clientId === id : !item.clientId;
}

export function logout() {
  logoutUser();
}
