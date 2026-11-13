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
            <!-- 这里传的是整个对象 item，不是 item.id -->
            <GoodsCard :goods="item" @click-card="goToDetail" />
          </el-col>
        </el-row>

        <!-- 如果没数据，显示个空状态 -->
        <el-empty v-if="goodsList.length === 0" description="暂无相关物品" />

        <!-- 分页：绑定真实的页数和总数 -->
        <div class="pagination-container">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </el-main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getGoodsList } from "../api/goods";

import NavBar from "../components/NavBar.vue";
import SideMenu from "../components/SideMenu.vue";
import GoodsCard from "../components/GoodsCard.vue";

const router = useRouter();
const searchKeyword = ref("");
const categoryFilter = ref("");

// 分页相关变量
const goodsList = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(8);

const loadGoods = async () => {
  try {
    const res = await getGoodsList({
      keyword: searchKeyword.value,
      category: categoryFilter.value,
      page: currentPage.value,
      size: pageSize.value,
    });

    // 【核心修改】后端现在返回的是 PageResult 对象，里面有 list 和 total
    // 如果你后端 PageResult 里的数组字段名叫 records 而不是 list，请把下面的 .list 改成 .records
    const pageData = res.data.data;
    goodsList.value = pageData.list || [];
    total.value = pageData.total || 0;

    console.log("成功拿到后端分页数据：", pageData);
  } catch (error) {
    console.error("获取数据失败：", error);
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  loadGoods();
};

onMounted(() => {
  loadGoods();
});

const handleSearch = (keyword) => {
  searchKeyword.value = keyword;
  currentPage.value = 1; // 搜索时回到第一页
  loadGoods();
};

const handleCategoryChange = (category) => {
  categoryFilter.value = category === "all" ? "" : category;
  currentPage.value = 1;
  loadGoods();
};

const goToDetail = (id) => {
  router.push({ path: "/detail", query: { id: id } });
};
</script>

<style scoped>
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
