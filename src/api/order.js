import request from "./request";

export function createOrder(data) {
  return request.post("/order/create", data);
}

export function confirmOrder(data) {
  return request.post("/order/confirm", data);
}

export function cancelOrder(data) {
  return request.post("/order/cancel", data);
}

export function getMyOrders(userId, type) {
  return request.get("/order/mine", { params: { userId, type } });
}
