import request from "./request";

export function getMessages(userId) {
  return request.get("/message/list", { params: { userId } });
}

export function getUnread(userId) {
  return request.get("/message/unread", { params: { userId } });
}

export function readAllMessages(userId) {
  return request.post("/message/read-all", { userId });
}

export function getStats(role) {
  return request.get("/admin/stats", { params: { role } });
}
