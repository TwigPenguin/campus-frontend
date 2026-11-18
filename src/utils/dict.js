export const categories = [
  { value: "books", label: "书籍教材" },
  { value: "digital", label: "数码电子" },
  { value: "life", label: "生活用品" },
  { value: "beauty", label: "美妆护肤" },
  { value: "other", label: "其他闲置" },
];

export const locations = [
  { value: "图书馆服务台", label: "图书馆服务台" },
  { value: "北区宿舍管处", label: "北区宿舍管处" },
  { value: "南区食堂门口", label: "南区食堂门口" },
];

const legacyLocation = {
  lib: "图书馆服务台",
  north: "北区宿舍管处",
  south: "南区食堂门口",
};

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80";

export function categoryLabel(value) {
  return (
    categories.find((item) => item.value === value)?.label || value || "未分类"
  );
}

export function locationLabel(value) {
  return legacyLocation[value] || value || "校内自提";
}

export function coverOf(image) {
  return imagesOf(image)[0];
}

export function imagesOf(image) {
  if (!image) return [FALLBACK_IMAGE];
  const list = String(image)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length ? list : [FALLBACK_IMAGE];
}

export function formatMoney(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
}

export function formatTime(value) {
  if (!value) return "";
  return String(value).replace("T", " ").slice(0, 16);
}

export function statusType(status) {
  if (status === "已上架" || status === "已完成") return "success";
  if (status === "待审核" || status === "待自提") return "warning";
  if (status === "已驳回" || status === "已取消") return "danger";
  return "info";
}

export function queryText(value) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}
