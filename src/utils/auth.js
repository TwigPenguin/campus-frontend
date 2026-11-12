import { reactive } from "vue";

const KEY = "campus_user";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export const authState = reactive({
  user: read(),
});

export function getUser() {
  return authState.user;
}

export function setUser(user) {
  authState.user = user;
  if (user) {
    localStorage.setItem(KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEY);
  }
}

export function logout() {
  setUser(null);
}
