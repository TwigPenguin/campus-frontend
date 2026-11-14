<template>
  <div class="log-page">
    <el-card shadow="never">
      <template #header>
        <span>系统日志</span>
      </template>
      <el-table :data="logs" style="width: 100%" border v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="adminName" label="操作人" width="120" />
        <el-table-column prop="action" label="操作类型" width="130">
          <template #default="scope">
            <el-tag>{{ scope.row.action }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="detail" label="详情" />
        <el-table-column prop="createTime" label="时间" width="180">
          <template #default="scope">{{ formatTime(scope.row.createTime) }}</template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && logs.length === 0" description="暂无日志" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getAdminLogs } from "../../api/admin";
import { formatTime } from "../../utils/dict";

const logs = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const res = await getAdminLogs("ADMIN");
    logs.value = res.data.data || [];
  } catch (e) {
    ElMessage.error(e?.message || "加载日志失败");
  } finally {
    loading.value = false;
  }
});
</script>
