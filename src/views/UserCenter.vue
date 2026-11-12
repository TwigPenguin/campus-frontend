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
import { ref } from "vue";

const activeName = ref("my-publish");

// 假数据用于展示
const myGoods = ref([
  { title: "高等数学辅导书", price: 25, status: "已上架" },
  { title: "闲置蓝牙耳机", price: 50, status: "审核中" },
]);
const myOrders = ref([
  {
    orderNo: "ORD20231108001",
    goodsName: "罗技鼠标",
    amount: 50,
    status: "待发货",
  },
]);
</script>

<style scoped>
.user-center {
  max-width: 1000px;
  margin: 20px auto;
}
</style>
