import request from "./request";

export function submitComplaint(data) {
  return request.post("/complaint/submit", data);
}

export function getMyComplaints(userId) {
  return request.get("/complaint/mine", { params: { userId } });
}

export function getComplaintList(role) {
  return request.get("/complaint/list", { params: { role } });
}

export function handleComplaint(data) {
  return request.post("/complaint/handle", data);
}
