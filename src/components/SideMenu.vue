<template>
  <el-aside width="200px" class="category-aside">
    <el-menu
      :default-active="activeIndex"
      class="category-menu"
      @select="handleSelect"
    >
      <el-menu-item index="all"
        ><el-icon><Menu /></el-icon>全部分类</el-menu-item
      >
      <el-menu-item index="books"
        ><el-icon><Reading /></el-icon>书籍教材</el-menu-item
      >
      <el-menu-item index="digital"
        ><el-icon><Monitor /></el-icon>数码电子</el-menu-item
      >
      <el-menu-item index="life"
        ><el-icon><House /></el-icon>生活用品</el-menu-item
      >
      <el-menu-item index="beauty"
        ><el-icon><Present /></el-icon>美妆护肤</el-menu-item
      >
      <el-menu-item index="other"
        ><el-icon><More /></el-icon>其他闲置</el-menu-item
      >
    </el-menu>
  </el-aside>
</template>

<script setup>
import {
  Menu,
  Reading,
  Monitor,
  House,
  Present,
  More,
} from "@element-plus/icons-vue";

// 接收父组件传来的当前选中项（可选，默认全部分类）
const props = defineProps({
  activeIndex: { type: String, default: "all" },
});

const emit = defineEmits(["category-change"]);

const handleSelect = (index) => {
  // 触发事件，把分类传给父组件
  emit("category-change", index);
};
</script>

<style scoped>
.category-aside {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.category-menu {
  border-right: none;
}
</style>
