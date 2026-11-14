<template>
  <div class="complaint-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-head">
          <span>投诉处理中心</span>
          <el-radio-group v-model="filter" size="small" @change="loadList">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="待处理">待处理</el-radio-button>
            <el-radio-button label="已处理">已处理</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <el-table :data="filteredList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="type" label="类型" width="90" />
        <el-table-column prop="goodsTitle" label="相关物品" width="180">
          <template #default="scope">{{ scope.row.goodsTitle || "—" }}</template>
        </el-table-column>
        <el-table-column prop="reporterName" label="投诉人" width="110" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '已处理' ? 'success' : 'warning'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === '待处理'"
              size="small"
              type="primary"
              @click="openHandle(scope.row)"
              >处理</el-button
            >
            <span v-else>—</span>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && filteredList.length === 0" description="暂无投诉记录" />
    </el-card>

    <el-dialog v-model="handleVisible" title="处理投诉" width="480px">
      <el-form label-width="80px">
        <el-form-item label="处理结果">
          <el-input
            v-model="handleResult"
            type="textarea"
            :rows="3"
            placeholder="填写处理结果或说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHandle">提交处理</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getComplaintList, handleComplaint } from "../../api/complaint";
import { getUser } from "../../utils/auth";

const list = ref([]);
const loading = ref(false);
const filter = ref("all");
const handleVisible = ref(false);
const handleResult = ref("");
const current = ref(null);

const filteredList = computed(() => {
  if (filter.value === "all") return list.value;
  return list.value.filter((c) => c.status === filter.value);
});

const loadList = async () => {
  loading.value = true;
  try {
    const res = await getComplaintList("ADMIN");
    list.value = res.data.data || [];
  } catch (e) {
    ElMessage.error(e?.message || "加载投诉失败");
  } finally {
    loading.value = false;
  }
};

const openHandle = (row) => {
  current.value = row;
  handleResult.value = "";
  handleVisible.value = true;
};

const submitHandle = async () => {
  const admin = getUser();
  try {
    await handleComplaint({
      id: current.value.id,
      result: handleResult.value,
      role: "ADMIN",
      adminId: admin?.id,
      adminName: admin?.nickname || admin?.username,
    });
    ElMessage.success("处理完成");
    handleVisible.value = false;
    loadList();
  } catch (e) {
    ElMessage.error(e?.message || "处理失败");
  }
};

onMounted(loadList);
</script>

<style scoped>
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
