<template>
  <div class="pickup-page">
    <el-card shadow="never">
      <template #header>
        <div class="card-head">
          <span>自提点管理</span>
          <el-button type="primary" size="small" @click="openAdd">新增自提点</el-button>
        </div>
      </template>
      <el-table :data="list" style="width: 100%" border v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="description" label="说明" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" type="primary" plain @click="openEdit(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" plain @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑自提点' : '新增自提点'" width="480px">
      <el-form label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" placeholder="如：图书馆服务台" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getAllPickupPoints, savePickupPoint, deletePickupPoint } from "../../api/pickup";
import { getUser } from "../../utils/auth";

const list = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const form = reactive({ id: null, name: "", description: "", status: "启用" });

const loadList = async () => {
  loading.value = true;
  try {
    const res = await getAllPickupPoints("ADMIN");
    list.value = res.data.data || [];
  } catch (e) {
    ElMessage.error(e?.message || "加载自提点失败");
  } finally {
    loading.value = false;
  }
};

const openAdd = () => {
  form.id = null;
  form.name = "";
  form.description = "";
  form.status = "启用";
  dialogVisible.value = true;
};

const openEdit = (row) => {
  form.id = row.id;
  form.name = row.name;
  form.description = row.description;
  form.status = row.status;
  dialogVisible.value = true;
};

const submitForm = async () => {
  if (!form.name.trim()) {
    ElMessage.warning("请填写名称");
    return;
  }
  const admin = getUser();
  try {
    await savePickupPoint({
      id: form.id,
      name: form.name,
      description: form.description,
      status: form.status,
      role: "ADMIN",
      adminId: admin?.id,
      adminName: admin?.nickname || admin?.username,
    });
    ElMessage.success("保存成功");
    dialogVisible.value = false;
    loadList();
  } catch (e) {
    ElMessage.error(e?.message || "保存失败");
  }
};

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除自提点「${row.name}」吗？`, "提示", { type: "warning" });
  } catch {
    return;
  }
  const admin = getUser();
  try {
    await deletePickupPoint({
      id: row.id,
      role: "ADMIN",
      adminId: admin?.id,
      adminName: admin?.nickname || admin?.username,
    });
    ElMessage.success("删除成功");
    loadList();
  } catch (e) {
    ElMessage.error(e?.message || "删除失败");
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
