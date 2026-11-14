import request from "./request";

export function submitReview(data) {
  return request.post("/review/submit", data);
}

export function getSellerReviews(sellerId) {
  return request.get("/review/seller", { params: { sellerId } });
}

export function getMyReviews(buyerId) {
  return request.get("/review/mine", { params: { buyerId } });
}
