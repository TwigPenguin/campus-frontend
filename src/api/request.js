import axios from "axios";
import { ElMessage } from "element-plus";
import router from "../router";
import { logout } from "../utils/auth";

const request = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

request.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body.code === "number" && body.code !== 200) {
      // ================= 新增：拦截封禁异常 =================
      if (body.message && body.message.includes("封禁")) {
        ElMessage.error(body.message);
        logout(); // 清除本地数据
        router.push("/login"); // 踢回登录页
      }
      // ======================================================
      return Promise.reject(new Error(body.message || "操作失败"));
    }
    return response;
  },
  (error) => {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "网络异常，请确认后端已启动";

    if (message.includes("封禁")) {
      logout();
      router.push("/login");
    }

    return Promise.reject(new Error(message));
  },
);

export default request;
