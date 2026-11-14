<template>
  <div class="app-root">
    <NavBar v-if="showNav" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import NavBar from "./components/NavBar.vue";

const route = useRoute();
const showNav = computed(
  () => route.path !== "/login" && !route.path.startsWith("/admin"),
);
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  background: #f5f7fa;
}
</style>
