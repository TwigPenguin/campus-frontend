<template>
  <div class="detail-container">
    <el-page-header @back="goBack" content="商品详情" class="page-header" />

    <div v-if="loading" class="loading-box">
      <el-skeleton :rows="8" animated />
    </div>

    <div v-else-if="!goods" class="loading-box">
      <el-empty description="商品不存在或已删除" />
    </div>

    <el-row v-else :gutter="40" class="detail-content">
      <el-col :span="12">
        <el-carousel v-if="images.length > 1" height="400px" class="carousel">
          <el-carousel-item v-for="(img, i) in images" :key="i">
            <img :src="img" class="detail-image" />
          </el-carousel-item>
        </el-carousel>
        <img v-else :src="images[0]" class="detail-image single" />
      </el-col>

      <el-col :span="12">
        <h1 class="goods-title">{{ goods.title }}</h1>
        <div class="price-box">
          <span class="current-price">¥ {{ formatMoney(goods.price) }}</span>
          <span class="original-price" v-if="goods.originalPrice">
            原价: ¥ {{ formatMoney(goods.originalPrice) }}
          </span>
        </div>

        <el-divider />

        <div class="info-item">
          <span class="label">成色：</span>
          <el-tag type="success">{{ goods.condition }}</el-tag>
        </div>
        <div class="info-item">
          <span class="label">分类：</span>{{ categoryLabel(goods.category) }}
        </div>
        <div class="info-item">
          <span class="label">自提点：</span>{{ goods.location }}
        </div>
        <div class="info-item">
          <span class="label">卖家：</span>{{ goods.seller }}
          <span class="seller-rating" v-if="avgRating > 0">
            <el-rate :model-value="avgRating" disabled size="small" />
            ({{ avgRating }} 分)
          </span>
        </div>
        <div class="info-item">
          <span class="label">库存：</span>{{ goods.stock ?? 1 }}
        </div>
        <div class="info-item">
          <span class="label">描述：</span>{{ goods.description || "暂无描述" }}
        </div>

        <div class="action-box">
          <el-button
            type="primary"
            size="large"
            color="#F56C6C"
            :disabled="isOwner || isSold"
            @click="handleBuy"
          >
            {{ isOwner ? "这是我发布的物品" : isSold ? "已售出" : "立即购买" }}
          </el-button>
          <el-button size="large" plain type="warning" @click="openReport">
            举报
          </el-button>
        </div>
      </el-col>
    </el-row>

    <div class="reviews" v-if="goods">
      <h3 class="reviews-title">卖家评价（{{ reviews.length }}）</h3>
      <el-empty v-if="reviews.length === 0" description="暂无评价" />
      <div v-for="r in reviews" :key="r.id" class="review-item">
        <div class="review-head">
          <span class="review-buyer">{{ r.buyerName }}</span>
          <el-rate :model-value="r.rating" disabled />
        </div>
        <div class="review-content">{{ r.content || "（未填写评价内容）" }}</div>
        <div class="review-time">{{ formatTime(r.createTime) }}</div>
      </div>
    </div>

    <el-dialog v-model="reportVisible" title="举报物品" width="480px">
      <el-form label-width="80px">
        <el-form-item label="举报理由">
          <el-input
            v-model="reportContent"
            type="textarea"
            :rows="4"
            placeholder="请描述该物品存在的违规问题"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reportVisible = false">取消</el-button>
        <el-button type="danger" @click="submitReport">提交举报</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { getGoodsDetail } from "../api/goods";
import { getSellerReviews } from "../api/review";
import { createOrder } from "../api/order";
import { submitComplaint } from "../api/complaint";
import { getUser } from "../utils/auth";
import { imagesOf, categoryLabel, formatMoney, formatTime } from "../utils/dict";

const router = useRouter();
const route = useRoute();

const goods = ref(null);
const loading = ref(true);
const reviews = ref([]);
const reportVisible = ref(false);
const reportContent = ref("");

const images = computed(() => (goods.value ? imagesOf(goods.value.image) : []));
const avgRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((acc, r) => acc + (r.rating || 0), 0);
  return Math.round((sum / reviews.value.length) * 10) / 10;
});
const user = computed(() => getUser());
const isOwner = computed(
  () => user.value && goods.value && user.value.id === goods.value.sellerId
);
const isSold = computed(() => goods.value && goods.value.status === "已售出");

const goBack = () => router.back();

async function loadDetail() {
  loading.value = true;
  try {
    const id = Number(route.query.id);
    if (!id) throw new Error("缺少商品ID");
    const res = await getGoodsDetail(id, getUser());
    goods.value = res.data.data;
    if (goods.value?.sellerId) {
      const r = await getSellerReviews(goods.value.sellerId);
      reviews.value = r.data.data || [];
    }
  } catch (error) {
    ElMessage.error(error?.message || "加载商品详情失败");
  } finally {
    loading.value = false;
  }
}

async function handleBuy() {
  if (!user.value) {
    ElMessage.warning("请先登录");
    router.push({ path: "/login", query: { redirect: route.fullPath } });
    return;
  }
  try {
    await createOrder({ goodsId: goods.value.id, buyerId: user.value.id });
    ElMessage.success("下单成功，请前往个人中心查看订单！");
    router.push("/user");
  } catch (error) {
    ElMessage.error(error?.message || "下单失败");
  }
}

const openReport = () => {
  if (!user.value) {
    ElMessage.warning("请先登录");
    router.push({ path: "/login", query: { redirect: route.fullPath } });
    return;
  }
  reportContent.value = "";
  reportVisible.value = true;
};

async function submitReport() {
  if (!reportContent.value.trim()) {
    ElMessage.warning("请填写举报理由");
    return;
  }
  try {
    await submitComplaint({
      goodsId: goods.value.id,
      reporterId: user.value.id,
      type: "举报",
      content: reportContent.value,
    });
    ElMessage.success("举报已提交，管理员会尽快处理");
    reportVisible.value = false;
  } catch (error) {
    ElMessage.error(error?.message || "提交失败");
  }
}

onMounted(loadDetail);
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
.loading-box {
  padding: 40px 0;
}
.detail-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}
.detail-image.single {
  display: block;
}
.carousel {
  border-radius: 8px;
  overflow: hidden;
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
.seller-rating {
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.action-box {
  margin-top: 40px;
  text-align: right;
}
.reviews {
  margin-top: 40px;
}
.reviews-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}
.review-item {
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
}
.review-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}
.review-buyer {
  font-weight: bold;
  color: #333;
}
.review-content {
  color: #555;
  font-size: 14px;
}
.review-time {
  color: #bbb;
  font-size: 12px;
  margin-top: 4px;
}
</style>
