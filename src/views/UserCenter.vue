<template>
  <div class="user-center">
    <el-card shadow="never">
      <el-tabs v-model="activeName" @tab-change="onTabChange">
        <el-tab-pane label="我的发布" name="my-publish">
          <el-table :data="myGoods" style="width: 100%">
            <el-table-column prop="title" label="物品名称" />
            <el-table-column prop="price" label="价格(元)" width="100" />
            <el-table-column prop="status" label="状态" width="110">
              <template #default="scope">
                <el-tag :type="statusType(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button
                  v-if="scope.row.status === '已上架'"
                  size="small"
                  type="danger"
                  plain
                  @click="handleOffShelf(scope.row)"
                >下架</el-button>
                <el-button
                  v-if="scope.row.status === '已驳回' || scope.row.status === '已下架'"
                  size="small"
                  type="primary"
                  plain
                  @click="handleResubmit(scope.row)"
                >重新提交</el-button>
                <span v-if="!['已上架', '已驳回', '已下架'].includes(scope.row.status)">
                  ——
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="myGoods.length === 0" description="还没有发布过物品" />
        </el-tab-pane>

        <el-tab-pane label="我买到的" name="my-buy">
          <el-table :data="myOrders" style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" width="190" />
            <el-table-column prop="goodsTitle" label="物品名称" />
            <el-table-column prop="amount" label="金额(元)" width="100" />
            <el-table-column prop="status" label="交易状态" width="110">
              <template #default="scope">
                <el-tag :type="statusType(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button
                  v-if="scope.row.status === '待自提'"
                  size="small"
                  type="primary"
                  plain
                  @click="handleConfirm(scope.row)"
                >确认收货</el-button>
                <el-button
                  v-if="scope.row.status === '待自提'"
                  size="small"
                  type="info"
                  plain
                  @click="handleCancel(scope.row)"
                >取消</el-button>
                <el-button
                  v-if="scope.row.status === '已完成' && !isReviewed(scope.row)"
                  size="small"
                  type="warning"
                  plain
                  @click="openReview(scope.row)"
                >评价</el-button>
                <span v-if="scope.row.status === '已完成' && isReviewed(scope.row)">已评价</span>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="myOrders.length === 0" description="还没有购买记录" />
        </el-tab-pane>

        <el-tab-pane label="我的评价" name="my-reviews">
          <el-table :data="myReviews" style="width: 100%">
            <el-table-column prop="goodsTitle" label="物品名称" />
            <el-table-column prop="sellerName" label="卖家" width="120" />
            <el-table-column label="评分" width="140">
              <template #default="scope">
                <el-rate :model-value="scope.row.rating" disabled />
              </template>
            </el-table-column>
            <el-table-column prop="content" label="评价内容" />
          </el-table>
          <el-empty v-if="myReviews.length === 0" description="还没有评价" />
        </el-tab-pane>

        <el-tab-pane label="我的投诉/举报" name="my-complaints">
          <el-table :data="myComplaints" style="width: 100%">
            <el-table-column prop="type" label="类型" width="90" />
            <el-table-column prop="goodsTitle" label="相关物品" width="180" />
            <el-table-column prop="content" label="内容" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === '已处理' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="handleResult" label="处理结果" width="180" />
          </el-table>
          <el-empty v-if="myComplaints.length === 0" description="还没有投诉或举报" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="reviewVisible" title="评价卖家" width="480px">
      <el-form label-width="80px">
        <el-form-item label="评分">
          <el-rate v-model="reviewForm.rating" />
        </el-form-item>
        <el-form-item label="评价内容">
          <el-input
            v-model="reviewForm.content"
            type="textarea"
            :rows="3"
            placeholder="说说这次的交易体验吧"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReviewNow">提交评价</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getMyGoods, offShelfGoods, resubmitGoods } from "../api/goods";
import { getMyOrders, confirmOrder, cancelOrder } from "../api/order";
import { getMyReviews, submitReview } from "../api/review";
import { getMyComplaints } from "../api/complaint";
import { getUser } from "../utils/auth";
import { statusType } from "../utils/dict";

const activeName = ref("my-publish");
const myGoods = ref([]);
const myOrders = ref([]);
const myReviews = ref([]);
const myComplaints = ref([]);
const reviewVisible = ref(false);
const reviewingOrder = ref(null);
const reviewForm = reactive({ rating: 5, content: "" });

const user = getUser();

const loadGoods = async () => {
  try {
    const res = await getMyGoods(user.id);
    myGoods.value = res.data.data || [];
  } catch (e) {
    ElMessage.error(e?.message || "获取我的发布失败");
  }
};

const loadOrders = async () => {
  try {
    const res = await getMyOrders(user.id, "buy");
    myOrders.value = res.data.data || [];
  } catch (e) {
    ElMessage.error(e?.message || "获取订单失败");
  }
};

const loadReviews = async () => {
  try {
    const res = await getMyReviews(user.id);
    myReviews.value = res.data.data || [];
  } catch {
    myReviews.value = [];
  }
};

const loadComplaints = async () => {
  try {
    const res = await getMyComplaints(user.id);
    myComplaints.value = res.data.data || [];
  } catch {
    myComplaints.value = [];
  }
};

const isReviewed = (order) =>
  myReviews.value.some((r) => r.orderId === order.id);

const handleOffShelf = async (row) => {
  try {
    await offShelfGoods({ id: row.id, sellerId: user.id });
    ElMessage.success("已下架");
    loadGoods();
  } catch (e) {
    ElMessage.error(e?.message || "下架失败");
  }
};

const handleResubmit = async (row) => {
  try {
    await resubmitGoods({ id: row.id, sellerId: user.id });
    ElMessage.success("已重新提交审核");
    loadGoods();
  } catch (e) {
    ElMessage.error(e?.message || "操作失败");
  }
};

const handleConfirm = async (row) => {
  try {
    await confirmOrder({ id: row.id, buyerId: user.id });
    ElMessage.success("已确认收货");
    loadOrders();
  } catch (e) {
    ElMessage.error(e?.message || "操作失败");
  }
};

const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm("确定取消该订单吗？", "提示", { type: "warning" });
    await cancelOrder({ id: row.id, buyerId: user.id });
    ElMessage.success("订单已取消");
    loadOrders();
  } catch (e) {
    if (e !== "cancel") ElMessage.error(e?.message || "操作失败");
  }
};

const openReview = (row) => {
  reviewingOrder.value = row;
  reviewForm.rating = 5;
  reviewForm.content = "";
  reviewVisible.value = true;
};

const submitReviewNow = async () => {
  try {
    await submitReview({
      orderId: reviewingOrder.value.id,
      buyerId: user.id,
      rating: reviewForm.rating,
      content: reviewForm.content,
    });
    ElMessage.success("评价成功");
    reviewVisible.value = false;
    loadReviews();
  } catch (e) {
    ElMessage.error(e?.message || "评价失败");
  }
};

const onTabChange = (name) => {
  if (name === "my-publish") loadGoods();
  else if (name === "my-buy") {
    loadOrders();
    loadReviews();
  } else if (name === "my-reviews") loadReviews();
  else if (name === "my-complaints") loadComplaints();
};

onMounted(() => {
  loadGoods();
});
</script>

<style scoped>
.user-center {
  max-width: 1000px;
  margin: 20px auto;
}
</style>
