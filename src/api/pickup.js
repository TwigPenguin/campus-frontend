import request from "./request";

export function getPickupPoints() {
  return request.get("/pickup-point/list");
}

export function getAllPickupPoints(role) {
  return request.get("/pickup-point/all", { params: { role } });
}

export function savePickupPoint(data) {
  return request.post("/pickup-point/save", data);
}

export function deletePickupPoint(data) {
  return request.post("/pickup-point/delete", data);
}
