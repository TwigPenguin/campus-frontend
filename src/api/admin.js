import request from "./request";

export function getStats(role) {
  return request.get("/admin/stats", { params: { role } });
}

export function getAdminUsers(role) {
  return request.get("/admin/users", { params: { role } });
}

export function setUserStatus(data) {
  return request.post("/admin/set-user-status", data);
}

export function getAdminLogs(role) {
  return request.get("/admin/log", { params: { role } });
}
