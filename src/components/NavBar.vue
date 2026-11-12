<template>
  <el-header class="header">
    <div class="logo" @click="$router.push('/')" style="cursor: pointer">
      <el-icon :size="24" color="#3B82F6"><ShoppingBag /></el-icon>
      <span>校园二手交易平台</span>
    </div>

    <div class="search-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索你想要的二手好物（如：高数教材、自行车）"
        class="input-with-select"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch" />
        </template>
      </el-input>
    </div>

    <div class="user-actions">
      <!-- 1. 发布按钮：绑定我们写的 goToPublish 方法 -->
      <el-button type="primary" @click="goToPublish" :icon="Plus">
        发布闲置
      </el-button>

      <!-- 2. 已登录状态：显示消息、头像、真实昵称和退出按钮 -->
      <template v-if="userInfo">
        <el-badge :value="2" class="message-badge">
          <el-button circle :icon="Bell" />
        </el-badge>
        <el-dropdown>
          <span class="user-dropdown">
            <el-avatar
              :size="32"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
            <!-- 这里显示真实的用户昵称 -->
            <span class="username">{{ userInfo.nickname }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/user')"
                >我的发布</el-dropdown-item
              >
              <el-dropdown-item @click="$router.push('/user')"
                >我的订单</el-dropdown-item
              >
              <!-- 退出登录绑定 handleLogout 方法 -->
              <el-dropdown-item divided @click="handleLogout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>

      <!-- 3. 未登录状态：只显示登录/注册按钮 -->
      <template v-else>
        <el-button type="primary" plain @click="$router.push('/login')">
          登录 / 注册
        </el-button>
      </template>
    </div>
  </el-header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Search, Plus, Bell, ShoppingBag } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();
const keyword = ref("");
const userInfo = ref(null); // 用来存真实用户数据

// 页面一加载，就把本地存的用户信息读出来
onMounted(() => {
  const user = localStorage.getItem("user");
  if (user) {
    userInfo.value = JSON.parse(user);
  }
});

const handleSearch = () => {
  // 搜索逻辑
};

// 拦截发布按钮：没登录不让进
const goToPublish = () => {
  if (!userInfo.value) {
    ElMessage.warning("请先登录");
    router.push("/login");
  } else {
    router.push("/publish");
  }
};

// 退出登录
const handleLogout = () => {
  localStorage.removeItem("user");
  userInfo.value = null;
  ElMessage.success("已退出登录");
  router.push("/login");
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 0 40px;
  height: 64px;
}
.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #3b82f6;
  gap: 8px;
}
.search-bar {
  width: 40%;
}
.user-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}
.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.username {
  font-size: 14px;
  color: #333;
}
</style>
