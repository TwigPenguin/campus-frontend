<template>
  <div class="stats-page">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <div class="title">总用户数</div>
          <div class="number">1,245</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <div class="title">在售物品数</div>
          <div class="number">350</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <div class="title">今日成交量</div>
          <div class="number" style="color: #f56c6c">42</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card
      shadow="never"
      style="margin-top: 20px; text-align: center; padding: 50px 0; color: #999"
    >
      <el-icon :size="40"><DataAnalysis /></el-icon>
      <p>图表区域（以后在这里接入 Echarts 绘制折线图和饼图）</p>
    </el-card>
  </div>
</template>

<script setup></script>

<style scoped>
.data-card {
  text-align: center;
}
.title {
  color: #666;
  font-size: 16px;
  margin-bottom: 10px;
}
.number {
  font-size: 32px;
  font-weight: bold;
  color: #3b82f6;
}
</style>
