<template>
  <div class="campus-platform">
    <div class="main-container">
      <SideMenu
        :active-index="categoryFilter === '' ? 'all' : categoryFilter"
        @category-change="handleCategoryChange"
      />

      <el-main class="goods-main">
        <div class="sort-bar">
          <span
            v-for="item in sortOptions"
            :key="item.value"
            class="sort-item"
            :class="{ active: sort === item.value }"
            @click="changeSort(item.value)"
          >
            {{ item.label }}
          </span>
        </div>

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

        <el-empty
          v-if="!loading && goodsList.length === 0"
          description="暂无相关物品"
        />

        <div class="pagination-container" v-if="total > pageSize">
          <el-pagination
            background
            layout="prev, pager, next, total"
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
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getGoodsList } from "../api/goods";

import SideMenu from "../components/SideMenu.vue";
import GoodsCard from "../components/GoodsCard.vue";

const router = useRouter();
const route = useRoute();

const searchKeyword = ref("");
const categoryFilter = ref("");
const sort = ref("default");

const sortOptions = [
  { value: "default", label: "综合排序" },
  { value: "latest", label: "最新发布" },
  { value: "priceAsc", label: "价格从低到高" },
  { value: "priceDesc", label: "价格从高到低" },
];

const goodsList = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(8);
const loading = ref(false);

const loadGoods = async () => {
  loading.value = true;
  try {
    const res = await getGoodsList({
      keyword: searchKeyword.value,
      category: categoryFilter.value,
      sort: sort.value,
      page: currentPage.value,
      size: pageSize.value,
    });
    const pageData = res.data.data;
    goodsList.value = pageData.list || [];
    total.value = pageData.total || 0;
  } catch (error) {
    console.error("获取数据失败：", error);
    goodsList.value = [];
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  loadGoods();
};

const handleCategoryChange = (category) => {
  categoryFilter.value = category === "all" ? "" : category;
  currentPage.value = 1;
  loadGoods();
};

const changeSort = (value) => {
  sort.value = value;
  currentPage.value = 1;
  loadGoods();
};

const goToDetail = (id) => {
  router.push({ path: "/detail", query: { id } });
};

watch(
  () => route.query.keyword,
  (val) => {
    searchKeyword.value = typeof val === "string" ? val : "";
    currentPage.value = 1;
    loadGoods();
  },
  { immediate: true }
);
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
