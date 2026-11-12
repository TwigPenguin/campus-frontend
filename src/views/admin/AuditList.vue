<template>
  <div class="audit-page">
    <el-card shadow="never">
      <template #header>
        <span>待审核物品列表</span>
      </template>
      <el-table :data="auditList" style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="物品名称" />
        <el-table-column prop="seller" label="发布者" width="120" />
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              type="success"
              @click="handleAudit(scope.row, '通过')"
              >通过</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleAudit(scope.row, '驳回')"
              >驳回</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";

const auditList = ref([]);

// 获取待审核数据
const loadPendingList = async () => {
  const res = await axios.get("/api/goods/list"); // 注意：为了简单，暂时先全部拿出来，然后在前面过滤
  // 真实的应该调专门的接口，这里我们偷个懒，只显示待审核的
  auditList.value = res.data.data.filter((item) => item.status === "待审核");
};

// 审核操作
const handleAudit = async (row, action) => {
  const newStatus = action === "通过" ? "已上架" : "已驳回";
  await axios.post("/api/goods/update-status", {
    id: row.id,
    status: newStatus,
  });
  ElMessage.success(`已将【${row.title}】${action}`);
  loadPendingList(); // 重新加载列表
};

onMounted(() => {
  loadPendingList();
});
</script>
