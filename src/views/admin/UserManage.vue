<template>
  <div class="user-page">
    <el-card shadow="never">
      <template #header>
        <span>用户管理</span>
      </template>
      <el-table :data="users" style="width: 100%" border v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="username" label="学号/工号" width="150" />
        <el-table-column prop="nickname" label="昵称" width="150" />
        <el-table-column prop="role" label="角色" width="110">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'ADMIN' ? 'danger' : 'info'">
              {{ scope.row.role === "ADMIN" ? "管理员" : "学生" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="110">
          <template #default="scope">
            <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180">
          <template #default="scope">{{ formatTime(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
              v-if="scope.row.role !== 'ADMIN'"
              size="small"
              :type="scope.row.status === '正常' ? 'danger' : 'success'"
              plain
              @click="toggleBan(scope.row)"
            >
              {{ scope.row.status === "正常" ? "封禁" : "解封" }}
            </el-button>
            <span v-else>—</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getAdminUsers, setUserStatus } from "../../api/admin";
import { getUser } from "../../utils/auth";
import { formatTime } from "../../utils/dict";

const users = ref([]);
const loading = ref(false);

const loadUsers = async () => {
  loading.value = true;
  try {
    const res = await getAdminUsers("ADMIN");
    users.value = res.data.data || [];
  } catch (e) {
    ElMessage.error(e?.message || "加载用户失败");
  } finally {
    loading.value = false;
  }
};

const toggleBan = async (row) => {
  const action = row.status === "正常" ? "封禁" : "解封";
  try {
    await ElMessageBox.confirm(`确定${action}用户「${row.username}」吗？`, "提示", {
      type: "warning",
    });
  } catch {
    return;
  }
  const admin = getUser();
  try {
    await setUserStatus({
      id: row.id,
      status: row.status === "正常" ? "封禁" : "正常",
      role: "ADMIN",
      adminId: admin?.id,
      adminName: admin?.nickname || admin?.username,
    });
    ElMessage.success(`${action}成功`);
    loadUsers();
  } catch (e) {
    ElMessage.error(e?.message || `${action}失败`);
  }
};

onMounted(loadUsers);
</script>
