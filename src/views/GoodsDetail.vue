<template>
  <div class="detail-container">
    <el-page-header @back="goBack" content="商品详情" class="page-header" />

    <el-row :gutter="40" class="detail-content">
      <!-- 左侧图片 -->
      <el-col :span="12">
        <el-image
          style="width: 100%; height: 400px; border-radius: 8px"
          src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80"
          fit="cover"
        />
      </el-col>

      <!-- 右侧信息 -->
      <el-col :span="12">
        <h1 class="goods-title">高等数学第七版（上下册）</h1>
        <div class="price-box">
          <span class="current-price">¥ 25.00</span>
          <span class="original-price">原价: ¥ 89.00</span>
        </div>

        <el-divider />

        <div class="info-item">
          <span class="label">成色：</span><el-tag type="success">9成新</el-tag>
        </div>
        <div class="info-item">
          <span class="label">自提点：</span>图书馆服务台
        </div>
        <div class="info-item">
          <span class="label">卖家：</span> 李同学 (信誉良好)
        </div>
        <div class="info-item">
          <span class="label">描述：</span
          >书内页干净，没有笔记，考研刚用完，希望能帮到学弟学妹。
        </div>

        <div class="action-box">
          <el-button
            type="primary"
            size="large"
            color="#F56C6C"
            @click="handleBuy"
            >立即购买</el-button
          >
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

const goBack = () => {
  router.back(); // 返回上一页
};

const handleBuy = () => {
  ElMessage.success("下单成功，请前往个人中心查看订单！");
};
</script>

<style scoped>
.detail-container {
  max-width: 1000px;
  margin: 30px auto;
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.page-header {
  margin-bottom: 30px;
}
.goods-title {
  font-size: 24px;
  color: #333;
}
.price-box {
  background: #fff0f0;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}
.current-price {
  color: #f56c6c;
  font-size: 28px;
  font-weight: bold;
}
.original-price {
  color: #999;
  font-size: 14px;
  text-decoration: line-through;
  margin-left: 15px;
}
.info-item {
  margin-bottom: 15px;
  color: #333;
  font-size: 15px;
}
.label {
  color: #999;
  width: 70px;
  display: inline-block;
}
.action-box {
  margin-top: 40px;
  text-align: right;
}
</style>
