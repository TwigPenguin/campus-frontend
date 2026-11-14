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
            <el-option
              v-for="c in categories"
              :key="c.value"
              :label="c.label"
              :value="c.value"
            />
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

        <el-form-item label="物品数量" prop="stock">
          <el-input-number v-model="formData.stock" :min="1" :max="999" />
        </el-form-item>

        <el-form-item label="物品成色" prop="condition">
          <el-radio-group v-model="formData.condition">
            <el-radio label="全新">全新</el-radio>
            <el-radio label="9成新">9成新</el-radio>
            <el-radio label="7成新">7成新</el-radio>
            <el-radio label="6成新及以下">6成新及以下</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="自提点" prop="location">
          <el-select v-model="formData.location" placeholder="请选择线下交接自提点">
            <el-option
              v-for="p in pickupPoints"
              :key="p.id"
              :label="p.name"
              :value="p.name"
            />
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
            list-type="picture-card"
            :auto-upload="false"
            :limit="5"
            accept="image/*"
            v-model:file-list="fileList"
            :on-change="onFileChange"
            :on-remove="onFileRemove"
            :on-exceed="onExceed"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="el-upload__tip">
            支持 jpg/png/webp/gif，单张不超过 5MB，最多 5 张
          </div>
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
          <el-button type="primary" :loading="submitting" @click="submitForm">
            提交审核
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { publishGoods, uploadImage } from "../api/goods";
import { getPickupPoints } from "../api/pickup";
import { getUser } from "../utils/auth";
import { categories } from "../utils/dict";
import { useRouter } from "vue-router";

const formRef = ref(null);
const router = useRouter();
const submitting = ref(false);
const fileList = ref([]);
const pickupPoints = ref([]);

const formData = reactive({
  title: "",
  category: "",
  price: null,
  originalPrice: null,
  stock: 1,
  condition: "",
  location: "",
  description: "",
});

const rules = {
  title: [{ required: true, message: "请输入物品名称", trigger: "blur" }],
  category: [{ required: true, message: "请选择分类", trigger: "change" }],
  price: [{ required: true, message: "请输入价格", trigger: "blur" }],
  condition: [{ required: true, message: "请选择成色", trigger: "change" }],
  location: [{ required: true, message: "请选择自提点", trigger: "change" }],
};

function onFileChange(uploadFile, uploadFiles) {
  fileList.value = uploadFiles;
}

function onFileRemove() {
  // v-model:file-list 会自动更新
}

function onExceed() {
  ElMessage.warning("最多上传 5 张图片");
}

onMounted(async () => {
  try {
    const res = await getPickupPoints();
    pickupPoints.value = res.data.data || [];
  } catch {
    pickupPoints.value = [];
  }
});

async function uploadAllImages() {
  const urls = [];
  for (const item of fileList.value) {
    const raw = item.raw;
    if (!raw) continue;
    const fd = new FormData();
    fd.append("file", raw);
    const res = await uploadImage(fd);
    urls.push(res.data.data);
  }
  return urls;
}

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error("请完善必填信息");
      return;
    }
    const user = getUser();
    if (!user) {
      ElMessage.warning("请先登录才能发布物品");
      router.push({ path: "/login", query: { redirect: "/publish" } });
      return;
    }

    submitting.value = true;
    try {
      let image = "";
      if (fileList.value.length > 0) {
        const urls = await uploadAllImages();
        image = urls.join(",");
      }

      const submitData = {
        title: formData.title,
        category: formData.category,
        price: formData.price,
        originalPrice: formData.originalPrice,
        stock: formData.stock || 1,
        condition: formData.condition,
        location: formData.location,
        description: formData.description,
        status: "待审核",
        sellerId: user.id,
        seller: user.nickname || user.username,
        image,
      };

      await publishGoods(submitData);
      ElMessage.success("发布成功，请等待管理员审核！");
      setTimeout(() => router.push("/"), 800);
    } catch (error) {
      ElMessage.error(error?.message || "发布失败，请检查后端是否启动");
    } finally {
      submitting.value = false;
    }
  });
};

const resetForm = () => {
  formRef.value.resetFields();
  fileList.value = [];
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
.el-upload__tip {
  font-size: 12px;
  color: #999;
  margin-top: 6px;
}
</style>
