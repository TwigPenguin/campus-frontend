<template>
  <div class="campus-platform">
    <!-- 1. 使用顶部导航组件 -->
    <NavBar @search="handleSearch" />

    <div class="main-container">
      <!-- 2. 使用左侧菜单组件 -->
      <SideMenu @category-change="handleCategoryChange" />

      <!-- 右侧商品展示区 -->
      <el-main class="goods-main">
        <div class="sort-bar">
          <span class="sort-item active">综合排序</span>
          <span class="sort-item">最新发布</span>
          <span class="sort-item">价格从低到高</span>
        </div>

        <!-- 3. 使用商品卡片组件 -->
        <el-row :gutter="20">
          <el-col
            :span="6"
            v-for="item in goodsList"
            :key="item.id"
            class="goods-col"
          >
            <GoodsCard :goods="item" @click-card="goToDetail" />
          </el-col>
        </el-row>

        <!-- 如果没数据，显示个空状态 -->
        <el-empty v-if="goodsList.length === 0" description="暂无相关物品" />

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background layout="prev, pager, next" :total="100" />
        </div>
      </el-main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  Search,
  Plus,
  Bell,
  ShoppingBag,
  Menu,
  Reading,
  Monitor,
  House,
  Present,
  More,
  Location,
} from "@element-plus/icons-vue";
import { getGoodsList } from "../api/goods"; // 引入通信兵

// 引入前面拆分出来的组件
import NavBar from "../components/NavBar.vue";
import SideMenu from "../components/SideMenu.vue";
import GoodsCard from "../components/GoodsCard.vue";

const router = useRouter();
const searchKeyword = ref("");
const goodsList = ref([]); // 这个数组现在是空的，专门用来装后端传过来的数据

// 定义一个函数，用来向后端要数据
const loadGoods = async () => {
  try {
    const res = await getGoodsList();
    // 后端返回的格式是 { code: 200, data: [...] }
    // axios 会把后端的返回放在 res.data 里
    // 所以真正的数组在 res.data.data 里
    goodsList.value = res.data.data;
    console.log("成功拿到后端数据：", goodsList.value);
  } catch (error) {
    console.error("获取数据失败，后端是不是没开？", error);
  }
};

// 页面一加载，就马上向后台要数据
onMounted(() => {
  loadGoods();
});

const handleSearch = (keyword) => {
  // 以后可以在这里加上搜索参数传给后端
  console.log("搜索：", keyword);
};

const handleCategoryChange = (category) => {
  console.log("分类：", category);
};

const goToDetail = (id) => {
  router.push({ path: "/detail", query: { id: id } });
};
</script>

<style scoped>
/* 只保留最外层的布局样式，卡片、菜单的样式都在各自的组件里 */
.campus-platform {
  min-height: 100vh;
  background-color: #f5f7fa;
}
.main-container {
  display: flex;
  max-width: 1200px;
  margin: 20px auto;
  gap: 20px;
}
.goods-main {
  padding: 0;
}
.sort-bar {
  background: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #666;
}
.sort-item {
  cursor: pointer;
}
.sort-item.active {
  color: #3b82f6;
  font-weight: bold;
}
.pagination-container {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 40px;
}
</style>
