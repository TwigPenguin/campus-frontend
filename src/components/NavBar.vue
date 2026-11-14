<template>
  <el-header class="header">
    <div class="logo" @click="goHome" style="cursor: pointer">
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
      <el-button type="primary" @click="goToPublish" :icon="Plus">
        发布闲置
      </el-button>

      <template v-if="userInfo">
        <el-badge :value="unread" :hidden="unread === 0" class="message-badge">
          <el-button circle :icon="Bell" @click="$router.push('/user')" />
        </el-badge>
        <el-dropdown>
          <span class="user-dropdown">
            <el-avatar :size="32" :src="avatar">{{ avatarText }}</el-avatar>
            <span class="username">{{ userInfo.nickname || userInfo.username }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/user')">个人中心</el-dropdown-item>
              <el-dropdown-item v-if="userInfo.role === 'ADMIN'" @click="$router.push('/admin')">
                管理后台
              </el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>

      <template v-else>
        <el-button type="primary" plain @click="$router.push('/login')">
          登录 / 注册
        </el-button>
      </template>
    </div>
  </el-header>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Search, Plus, Bell, ShoppingBag } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { getUser, logout } from "../utils/auth";
import { getUnread } from "../api/message";

const router = useRouter();
const route = useRoute();
const keyword = ref("");
const unread = ref(0);

const userInfo = computed(() => getUser());
const avatarText = computed(() =>
  userInfo.value ? (userInfo.value.nickname || userInfo.value.username || "?").slice(0, 1) : "?"
);
const avatar = "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";

watch(
  () => route.query.keyword,
  (val) => {
    keyword.value = typeof val === "string" ? val : "";
  },
  { immediate: true }
);

watch(
  () => userInfo.value?.id,
  () => loadUnread(),
  { immediate: true }
);

async function loadUnread() {
  if (!userInfo.value) {
    unread.value = 0;
    return;
  }
  try {
    const res = await getUnread(userInfo.value.id);
    unread.value = res.data.data || 0;
  } catch {
    unread.value = 0;
  }
}

const goHome = () => {
  keyword.value = "";
  router.push("/");
};

const handleSearch = () => {
  const kw = keyword.value.trim();
  if (kw) {
    router.push({ path: "/", query: { keyword: kw } });
  } else {
    router.push("/");
  }
};

const goToPublish = () => {
  if (!userInfo.value) {
    ElMessage.warning("请先登录");
    router.push({ path: "/login", query: { redirect: "/publish" } });
  } else {
    router.push("/publish");
  }
};

const handleLogout = () => {
  logout();
  unread.value = 0;
  ElMessage.success("已退出登录");
  router.push("/");
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
  white-space: nowrap;
}
.search-bar {
  width: 40%;
  min-width: 260px;
}
.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
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
