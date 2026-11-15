import { createRouter, createWebHistory } from "vue-router";
import { ElMessage } from "element-plus";
import { getUser } from "../utils/auth";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  { path: "/", name: "Home", component: () => import("../views/Home.vue") },
  {
    path: "/publish",
    name: "Publish",
    component: () => import("../views/Publish.vue"),
    meta: { auth: true },
  },
  {
    path: "/detail",
    name: "GoodsDetail",
    component: () => import("../views/GoodsDetail.vue"),
  },
  {
    path: "/user",
    name: "UserCenter",
    component: () => import("../views/UserCenter.vue"),
    meta: { auth: true },
  },
  {
    path: "/admin",
    name: "AdminHome",
    component: () => import("../views/admin/AdminHome.vue"),
    redirect: "/admin/audit",
    meta: { auth: true, admin: true },
    children: [
      {
        path: "audit",
        name: "AuditList",
        component: () => import("../views/admin/AuditList.vue"),
      },
      {
        path: "stats",
        name: "Stats",
        component: () => import("../views/admin/Stats.vue"),
      },
      {
        path: "complaint",
        name: "ComplaintCenter",
        component: () => import("../views/admin/ComplaintCenter.vue"),
      },
      {
        path: "pickup-point",
        name: "PickupPointManage",
        component: () => import("../views/admin/PickupPointManage.vue"),
      },
      {
        path: "log",
        name: "SysLog",
        component: () => import("../views/admin/SysLog.vue"),
      },
      {
        path: "users",
        name: "UserManage",
        component: () => import("../views/admin/UserManage.vue"),
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const user = getUser();
  if (user && user.status === "封禁") {
    ElMessage.error("您的账号因违规已被封禁，请联系管理员");
    logout(); // 强制清除本地登录状态（你需要从 utils/auth 引入 logout）
    return "/login";
  }
  const needAuth = to.matched.some((record) => record.meta.auth);
  const needAdmin = to.matched.some((record) => record.meta.admin);

  if (needAuth && !user) {
    ElMessage.warning("请先登录！");
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  if (needAdmin && user?.role !== "ADMIN") {
    ElMessage.warning("没有管理员权限");
    return "/";
  }

  if (to.path === "/login" && user) {
    return typeof to.query.redirect === "string" ? to.query.redirect : "/";
  }

  return true;
});

router.afterEach(() => {
  document.title = "校园二手交易平台";
});

export default router;
