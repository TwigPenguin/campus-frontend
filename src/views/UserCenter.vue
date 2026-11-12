<template>
  <div class="user-center">
    <h2>个人中心</h2>
    <el-card shadow="never">
      <el-tabs v-model="activeName">
        <!-- 我发布的 -->
        <el-tab-pane label="我发布的" name="my-publish">
          <el-table :data="myGoods" style="width: 100%">
            <el-table-column prop="title" label="物品名称" />
            <el-table-column prop="price" label="价格(元)" width="120" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="scope">
                <el-tag
                  :type="scope.row.status === '已上架' ? 'success' : 'info'"
                  >{{ scope.row.status }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" type="danger" plain>下架</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 我买到的 -->
        <el-tab-pane label="我买到的" name="my-buy">
          <el-table :data="myOrders" style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" width="180" />
            <el-table-column prop="goodsName" label="物品名称" />
            <el-table-column prop="amount" label="金额(元)" width="120" />
            <el-table-column prop="status" label="交易状态" width="120" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" type="primary" plain
                  >确认收货</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getGoodsList } from "../api/goods"; // 复用获取列表的接口
import { ElMessage } from "element-plus";

const activeName = ref("my-publish");

const myGoods = ref([]);
const myOrders = ref([]); // 订单功能没做，先留空

onMounted(async () => {
  // 获取当前登录的用户名
  const userStr = localStorage.getItem("user");
  if (!userStr) return;
  const currentUser = JSON.parse(userStr);

  try {
    // 请求后端的全部商品列表
    const res = await getGoodsList();

    // 在前端过滤出：卖家是我 的 商品
    // 注意：这里假设你数据库里的 seller 字段，存的就是用户的 nickname
    const allGoods = res.data.data || [];
    myGoods.value = allGoods.filter(
      (item) => item.seller === currentUser.nickname,
    );
  } catch (error) {
    ElMessage.error("获取我的发布数据失败");
    console.error(error);
  }
});
</script>

<style scoped>
.user-center {
  max-width: 1000px;
  margin: 20px auto;
}
</style>
