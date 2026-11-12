<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="title">校园二手交易平台</h2>
      <el-form :model="loginForm" label-width="0">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="请输入学号/工号"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            size="large"
            @click="handleLogin"
            >登 录</el-button
          >
        </el-form-item>
      </el-form>
      <div class="footer-links">
        <span>还没有账号？去注册</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { loginApi, registerApi } from "../api/goods"; // 引入真实接口

const router = useRouter();
const loginForm = reactive({ username: "", password: "" });

// 核心逻辑：真实调用后端登录
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning("请输入账号和密码");
    return;
  }

  try {
    const res = await loginApi(loginForm);

    // 假设后端返回结构是 { code: 200, message: "操作成功", data: {...User对象} }
    if (res.data.code === 200) {
      ElMessage.success("登录成功！");

      // 【关键】把真实的用户信息（包括 ID 和 昵称）存入本地，供其他页面调用
      localStorage.setItem("user", JSON.stringify(res.data.data));

      router.push("/");
    } else {
      // 如果后端抛出 "学号或密码错误"，显示出来
      ElMessage.error(res.data.message || "登录失败");
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("网络异常，请检查后端服务是否启动");
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 10px;
}
.title {
  text-align: center;
  color: #3b82f6;
  margin-bottom: 30px;
}
.login-btn {
  width: 100%;
  background-color: #3b82f6;
}
.footer-links {
  text-align: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}
</style>
