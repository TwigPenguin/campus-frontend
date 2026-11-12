import request from "./request";

// ============ 用户模块真实接口 ============
export function loginApi(data) {
  return request.post("/user/login", data);
}
export function registerApi(data) {
  return request.post("/user/register", data);
}

export function getGoodsList(params) {
  return request.get("/goods/list", { params });
}

export function getGoodsDetail(id, user) {
  return request.get(`/goods/${id}`, {
    params: {
      viewerId: user?.id,
      role: user?.role,
    },
  });
}

export function getMyGoods(sellerId) {
  return request.get("/goods/mine", { params: { sellerId } });
}

export function getPendingGoods(role) {
  return request.get("/goods/pending", { params: { role } });
}

export function publishGoods(data) {
  return request.post("/goods/publish", data);
}

export function updateGoodsStatus(data) {
  return request.post("/goods/update-status", data);
}

export function offShelfGoods(data) {
  return request.post("/goods/off-shelf", data);
}

export function resubmitGoods(data) {
  return request.post("/goods/resubmit", data);
}

export function uploadImage(formData) {
  return request.post("/file/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
