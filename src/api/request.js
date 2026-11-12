import axios from "axios";

const request = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

request.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body.code === "number" && body.code !== 200) {
      return Promise.reject(new Error(body.message || "操作失败"));
    }
    return response;
  },
  (error) => {
    const message =
      error?.response?.data?.message || error.message || "网络异常，请确认后端已启动";
    return Promise.reject(new Error(message));
  }
);

export default request;
