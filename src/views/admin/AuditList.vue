<template>
  <div class="audit-page">
    <el-card shadow="never">
      <template #header>
        <span>待审核物品列表</span>
      </template>
      <el-table :data="auditList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="图片" width="90">
          <template #default="scope">
            <el-image
              :src="coverOf(scope.row.image)"
              style="width: 50px; height: 50px"
              fit="cover"
              :preview-src-list="imagesOf(scope.row.image)"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="物品名称" />
        <el-table-column prop="seller" label="发布者" width="110" />
        <el-table-column prop="price" label="价格" width="90" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="scope">{{ categoryLabel(scope.row.category) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template #default="scope">
            <el-button
              size="small"
              type="success"
              @click="handleAudit(scope.row, '已上架')"
              >通过</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleAudit(scope.row, '已驳回')"
              >驳回</el-button
            >
            <el-button size="small" type="info" plain @click="viewDetail(scope.row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && auditList.length === 0" description="暂无待审核物品" />
    </el-card>

    <el-dialog v-model="detailVisible" title="物品详情" width="560px">
      <div v-if="current">
        <el-image
          :src="coverOf(current.image)"
          style="width: 100%; height: 260px; border-radius: 8px"
          fit="cover"
        />
        <p><b>名称：</b>{{ current.title }}</p>
        <p><b>价格：</b>¥{{ current.price }}（原价 ¥{{ current.originalPrice }}）</p>
        <p><b>成色：</b>{{ current.condition }}</p>
        <p><b>自提点：</b>{{ current.location }}</p>
        <p><b>描述：</b>{{ current.description }}</p>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getPendingGoods, updateGoodsStatus } from "../../api/goods";
import { getUser } from "../../utils/auth";
import { coverOf, imagesOf, categoryLabel } from "../../utils/dict";

const auditList = ref([]);
const loading = ref(false);
const detailVisible = ref(false);
const current = ref(null);

const loadPendingList = async () => {
  loading.value = true;
  try {
    const res = await getPendingGoods("ADMIN");
    auditList.value = res.data.data || [];
  } catch (e) {
    ElMessage.error(e?.message || "加载待审核列表失败");
  } finally {
    loading.value = false;
  }
};

const handleAudit = async (row, status) => {
  const admin = getUser();
  try {
    await updateGoodsStatus({
      id: row.id,
      status,
      role: "ADMIN",
      adminId: admin?.id,
      adminName: admin?.nickname || admin?.username,
    });
    ElMessage.success(`已${status === "已上架" ? "通过" : "驳回"}【${row.title}】`);
    loadPendingList();
  } catch (e) {
    ElMessage.error(e?.message || "审核操作失败");
  }
};

const viewDetail = (row) => {
  current.value = row;
  detailVisible.value = true;
};

onMounted(loadPendingList);
</script>
