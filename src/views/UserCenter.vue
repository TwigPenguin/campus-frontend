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
import { getMyGoods } from "../api/goods"; // 【重要】改用专属接口
import { ElMessage } from "element-plus";

const activeName = ref("my-publish");

const myGoods = ref([]);
const myOrders = ref([]);

onMounted(async () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return;
  const currentUser = JSON.parse(userStr);

  try {
    // 直接传当前用户的 ID 给后端查询
    const res = await getMyGoods(currentUser.id);
    myGoods.value = res.data.data || [];
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
