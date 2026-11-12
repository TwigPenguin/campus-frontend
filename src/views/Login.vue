<template>
  <div class="login-container">
    <el-card class="login-card">
      <!-- 动态标题：切换登录/注册 -->
      <h2 class="title">{{ isLogin ? "校园二手交易平台" : "注册新账号" }}</h2>

      <el-form :model="loginForm" label-width="0">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="请输入学号/工号"
            size="large"
          />
        </el-form-item>

        <!-- 注册时才显示昵称输入框 -->
        <el-form-item v-if="!isLogin">
          <el-input
            v-model="loginForm.nickname"
            placeholder="请输入昵称（如：李同学）"
            size="large"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            size="large"
            @click="handleSubmit"
          >
            {{ isLogin ? "登 录" : "注 册" }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="footer-links">
        <!-- 点击切换状态 -->
        <span @click="isLogin = !isLogin" class="toggle-btn">
          {{ isLogin ? "还没有账号？去注册" : "已有账号？去登录" }}
        </span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { loginApi, registerApi } from "../api/goods"; // 引入真实的接口

const router = useRouter();
const isLogin = ref(true); // true表示登录，false表示注册
const loginForm = reactive({ username: "", password: "", nickname: "" });

const handleSubmit = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning("请输入账号和密码");
    return;
  }

  try {
    if (isLogin.value) {
      // ========= 登录逻辑 =========
      const res = await loginApi(loginForm);
      if (res.data.code === 200) {
        ElMessage.success("登录成功！");
        localStorage.setItem("user", JSON.stringify(res.data.data));
        router.push("/");
      } else {
        ElMessage.error(res.data.message || "登录失败");
      }
    } else {
      // ========= 注册逻辑 =========
      const res = await registerApi(loginForm);
      if (res.data.code === 200) {
        ElMessage.success("注册成功，请直接登录！");
        isLogin.value = true; // 自动切回登录界面
      } else {
        ElMessage.error(res.data.message || "注册失败");
      }
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("网络异常，请检查后端是否启动");
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
}
.toggle-btn {
  cursor: pointer;
  color: #3b82f6; /* 蓝色提示可点击 */
}
.toggle-btn:hover {
  text-decoration: underline;
}
</style>
