import { createRouter, createWebHistory } from "vue-router";
import { ElMessage } from "element-plus";

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
  // 直接从浏览器本地读取用户信息
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // 检查当前页面是否配置了需要登录 (meta: { auth: true })
  const needAuth = to.matched.some((record) => record.meta.auth);
  const needAdmin = to.matched.some((record) => record.meta.admin);

  // 1. 如果需要登录，但本地没存 user，踢去登录页
  if (needAuth && !user) {
    ElMessage.warning("请先登录！");
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  // 2. 如果是管理员页面，但当前用户不是 ADMIN，踢回首页
  if (needAdmin && user?.role !== "ADMIN") {
    ElMessage.warning("没有管理员权限");
    return "/";
  }

  // 3. 如果已经登录了，还想去登录页，直接跳回首页
  if (to.path === "/login" && user) {
    return typeof to.query.redirect === "string" ? to.query.redirect : "/";
  }

  // 4. 其他情况正常放行
  return true;
});

router.afterEach(() => {
  document.title = "校园二手交易平台";
});

export default router;
