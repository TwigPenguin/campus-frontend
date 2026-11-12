<template>
  <el-card
    shadow="hover"
    :body-style="{ padding: '0px' }"
    class="goods-card"
    style="cursor: pointer"
    @click="handleClick"
  >
    <img :src="goods.image" class="goods-image" />
    <div class="goods-info">
      <h3 class="goods-title">{{ goods.title }}</h3>
      <div class="goods-tags">
        <el-tag size="small" type="info">{{ goods.condition }}</el-tag>
      </div>
      <div class="goods-price">
        <span class="price">¥{{ goods.price }}</span>
        <span class="original-price">¥{{ goods.originalPrice }}</span>
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
import { Location } from "@element-plus/icons-vue";

// 必须接收一个 goods 对象
const props = defineProps({
  goods: { type: Object, required: true },
});

const emit = defineEmits(["click-card"]);

const handleClick = () => {
  emit("click-card", props.goods.id);
};
</script>

<style scoped>
.goods-card {
  margin-bottom: 20px;
  border-radius: 8px;
  transition: transform 0.3s;
}
.goods-card:hover {
  transform: translateY(-5px);
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
