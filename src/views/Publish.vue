<template>
  <div class="publish-container">
    <el-card class="publish-card">
      <template #header>
        <div class="card-header">
          <span>发布闲置物品</span>
        </div>
      </template>

      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="物品名称" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入物品名称（如：高等数学教材）"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="物品分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择分类">
            <el-option label="书籍教材" value="books" />
            <el-option label="数码电子" value="digital" />
            <el-option label="生活用品" value="life" />
          </el-select>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="出售价格(¥)" prop="price">
              <el-input-number
                v-model="formData.price"
                :min="0"
                :precision="2"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原价(¥)">
              <el-input-number
                v-model="formData.originalPrice"
                :min="0"
                :precision="2"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="物品成色" prop="condition">
          <el-radio-group v-model="formData.condition">
            <el-radio label="全新">全新</el-radio>
            <el-radio label="9成新">9成新</el-radio>
            <el-radio label="7成新">7成新</el-radio>
            <el-radio label="6成新及以下">6成新及以下</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="自提点" prop="location">
          <el-select
            v-model="formData.location"
            placeholder="请选择线下交接自提点"
          >
            <el-option label="图书馆服务台" value="lib" />
            <el-option label="北区宿舍管处" value="north" />
            <el-option label="南区食堂门口" value="south" />
          </el-select>
        </el-form-item>

        <el-form-item label="物品描述" prop="description">
          <el-input
            type="textarea"
            v-model="formData.description"
            :rows="4"
            placeholder="描述一下物品的使用情况、转手原因等..."
          />
        </el-form-item>

        <el-form-item label="物品图片" prop="images">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="5"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                只能上传jpg/png文件，且不超过5MB，最多5张
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-alert
            title="注意：提交后需等待管理员审核通过，物品才会在首页展示。"
            type="info"
            show-icon
            :closable="false"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交审核</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { publishGoods } from "../api/goods"; // 保留这一行即可
import { useRouter } from "vue-router";

const formRef = ref(null);
const router = useRouter();

const formData = reactive({
  title: "",
  category: "",
  price: null,
  originalPrice: null,
  condition: "",
  location: "",
  description: "",
  images: [],
});

const rules = {
  title: [{ required: true, message: "请输入物品名称", trigger: "blur" }],
  category: [{ required: true, message: "请选择分类", trigger: "change" }],
  price: [{ required: true, message: "请输入价格", trigger: "blur" }],
  condition: [{ required: true, message: "请选择成色", trigger: "change" }],
  location: [{ required: true, message: "请选择自提点", trigger: "change" }],
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error("请完善必填信息");
      return;
    }

    // 1. 真实环境：先检查用户有没有登录
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      ElMessage.warning("请先登录才能发布物品");
      router.push("/login");
      return;
    }

    // 2. 获取真实的用户信息
    const currentUser = JSON.parse(userStr);

    try {
      // 3. 组装真实数据
      const submitData = {
        title: formData.title,
        category: formData.category,
        price: formData.price,
        originalPrice: formData.originalPrice,
        condition: formData.condition,
        location: formData.location,
        description: formData.description,
        status: "待审核",
        sellerId: currentUser.id,
        seller: currentUser.nickname, // 当前真实登录的昵称
        image:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80", // 图片链接暂留
      };

      await publishGoods(submitData);

      ElMessage.success("发布成功，请等待管理员审核！");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("发布失败：", error);
      ElMessage.error("发布失败，请检查后端是否启动");
    }
  });
};

const resetForm = () => {
  formRef.value.resetFields();
};
</script>

<style scoped>
.publish-container {
  max-width: 800px;
  margin: 40px auto;
}
.publish-card {
  border-radius: 8px;
}
.card-header {
  font-size: 18px;
  font-weight: bold;
}
</style>
