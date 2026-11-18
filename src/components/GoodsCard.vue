<template>
  <el-card
    shadow="hover"
    :body-style="{ padding: '0px' }"
    class="goods-card"
    style="cursor: pointer"
    @click="handleClick"
  >
    <img :src="cover" class="goods-image" />
    <div class="goods-info">
      <h3 class="goods-title">{{ goods.title }}</h3>
      <div class="goods-tags">
        <el-tag size="small" type="info">{{ goods.condition }}</el-tag>
        <el-tag size="small" type="warning" v-if="categoryLabel">{{
          categoryLabel
        }}</el-tag>
      </div>
      <div class="goods-price">
        <span class="price">¥{{ goods.price }}</span>
        <span class="original-price" v-if="goods.originalPrice"
          >¥{{ goods.originalPrice }}</span
        >
      </div>
      <div class="goods-footer">
        <span class="location"
          ><el-icon><Location /></el-icon> {{ goods.location }}</span
        >
        <span class="seller">{{ goods.seller }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from "vue";
import { Location } from "@element-plus/icons-vue";
import { coverOf, categoryLabel as catLabel } from "../utils/dict";

// 必须接收一个 goods 对象
const props = defineProps({
  goods: { type: Object, required: true },
});

const emit = defineEmits(["click-card"]);

const cover = computed(() => coverOf(props.goods.image));
const categoryLabel = computed(() => catLabel(props.goods.category));

const handleClick = () => {
  emit("click-card", props.goods.id);
};
</script>

<style scoped>
.goods-card {
  margin-bottom: 20px;
  border-radius: 16px; /* 更大的圆角，像 iPad 的边框 */
  border: none !important; /* 强制去掉边框 */
  background: #ffffff;
  /* 苹果标志性的微小投影，非常柔和 */
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}
.goods-card:hover {
  transform: translateY(-4px) scale(1.01); /* 鼠标放上去有轻微上浮感 */
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1); /* 阴影加深 */
}
.goods-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.goods-info {
  padding: 14px;
}
.goods-title {
  font-size: 15px;
  margin: 0 0 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
}
.goods-tags {
  margin-bottom: 10px;
  display: flex;
  gap: 6px;
}
.goods-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}
.price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}
.original-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}
.goods-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  border-top: 1px solid #eee;
  padding-top: 10px;
}
.location {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
