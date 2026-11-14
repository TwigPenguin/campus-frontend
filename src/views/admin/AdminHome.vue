<template>
  <el-container class="admin-container">
    <!-- 左侧菜单 -->
    <el-aside width="200px" class="admin-aside">
      <div class="logo">管理后台</div>
      <el-menu
        :default-active="$route.path"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/admin/audit">
          <el-icon><DocumentChecked /></el-icon>
          <span>物品审核</span>
        </el-menu-item>
        <el-menu-item index="/admin/stats">
          <el-icon><DataLine /></el-icon>
          <span>数据统计</span>
        </el-menu-item>
        <el-menu-item index="/admin/complaint">
          <el-icon><Warning /></el-icon>
          <span>投诉处理</span>
        </el-menu-item>
        <el-menu-item index="/admin/pickup-point">
          <el-icon><Location /></el-icon>
          <span>自提点管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/log">
          <el-icon><Memo /></el-icon>
          <span>系统日志</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧内容 -->
    <el-container>
      <el-header class="admin-header">
        <span>欢迎您，{{ adminName }}</span>
        <el-button link type="danger" @click="$router.push('/')"
          >返回前台</el-button
        >
      </el-header>
      <el-main class="admin-main">
        <!-- 嵌套路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from "vue";
import { getUser } from "../../utils/auth";

const adminName = computed(
  () => getUser()?.nickname || getUser()?.username || "管理员"
);
</script>

<style scoped>
.admin-container {
  height: 100vh;
}
.admin-aside {
  background-color: #304156;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background: #2b3a4d;
}
.admin-header {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.admin-main {
  background: #f0f2f5;
  padding: 20px;
}
</style>
