<template>
  <div class="stats-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="title">总用户数</div>
          <div class="number">{{ stats.userCount ?? 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="title">在售物品数</div>
          <div class="number">{{ stats.onSaleCount ?? 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="title">待审核物品</div>
          <div class="number" style="color: #e6a23c">{{ stats.pendingCount ?? 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="title">累计成交量</div>
          <div class="number" style="color: #f56c6c">{{ stats.dealCount ?? 0 }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="10">
        <el-card shadow="never">
          <template #header><span>商品分类分布</span></template>
          <div class="pie-wrap" v-if="hasCategory">
            <svg viewBox="0 0 200 200" width="200" height="200">
              <circle
                v-for="(seg, i) in pieSegments"
                :key="i"
                cx="100"
                cy="100"
                r="80"
                fill="none"
                :stroke="seg.color"
                stroke-width="32"
                :stroke-dasharray="`${seg.length} ${CIRC - seg.length}`"
                :stroke-dashoffset="seg.offset"
                :transform="'rotate(-90 100 100)'"
              />
            </svg>
            <div class="pie-legend">
              <div v-for="seg in pieSegments" :key="seg.category" class="legend-item">
                <span class="dot" :style="{ background: seg.color }"></span>
                <span>{{ categoryLabel(seg.category) }}</span>
                <span class="count">{{ seg.count }}</span>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无分类数据" :image-size="60" />
        </el-card>
      </el-col>

      <el-col :span="14">
        <el-card shadow="never">
          <template #header><span>近 7 日成交量趋势</span></template>
          <div v-if="trend.length">
            <svg :viewBox="`0 0 ${chartW} ${chartH}`" class="line-chart">
              <line
                v-for="i in 4"
                :key="'h' + i"
                :x1="PAD"
                :x2="chartW - PAD"
                :y1="gridY(i)"
                :y2="gridY(i)"
                stroke="#eee"
              />
              <polyline
                :points="linePoints"
                fill="none"
                stroke="#3b82f6"
                stroke-width="2"
              />
              <circle
                v-for="(p, i) in pointList"
                :key="'c' + i"
                :cx="p.x"
                :cy="p.y"
                r="4"
                fill="#3b82f6"
              />
              <text
                v-for="(p, i) in pointList"
                :key="'t' + i"
                :x="p.x"
                :y="chartH - PAD + 16"
                text-anchor="middle"
                font-size="11"
                fill="#999"
              >
                {{ trend[i].date }}
              </text>
              <text
                v-for="(p, i) in pointList"
                :key="'v' + i"
                :x="p.x"
                :y="p.y - 10"
                text-anchor="middle"
                font-size="11"
                fill="#333"
              >
                {{ trend[i].count }}
              </text>
            </svg>
          </div>
          <el-empty v-else description="暂无交易数据" :image-size="60" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" style="margin-top: 20px">
      <template #header><span>最新订单</span></template>
      <el-table :data="recentOrders" style="width: 100%">
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column prop="goodsTitle" label="物品" />
        <el-table-column prop="amount" label="金额(元)" width="100" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="createTime" label="下单时间" width="180">
          <template #default="scope">{{ formatTime(scope.row.createTime) }}</template>
        </el-table-column>
      </el-table>
      <el-empty v-if="recentOrders.length === 0" description="暂无订单" :image-size="60" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getStats } from "../../api/admin";
import { categoryLabel, formatTime } from "../../utils/dict";

const stats = ref({});
const trend = ref([]);
const recentOrders = ref([]);

const CATEGORY_COLORS = {
  books: "#3b82f6",
  digital: "#f56c6c",
  life: "#67c23a",
  beauty: "#e6a23c",
  other: "#909399",
};
const CIRC = 2 * Math.PI * 80;

const hasCategory = computed(() => {
  const list = stats.value.categories || [];
  return list.some((c) => (c.count || 0) > 0);
});

const pieSegments = computed(() => {
  const list = (stats.value.categories || []).filter((c) => (c.count || 0) > 0);
  const total = list.reduce((acc, c) => acc + (c.count || 0), 0);
  let offset = 0;
  return list.map((c) => {
    const count = c.count || 0;
    const length = (count / total) * CIRC;
    const seg = {
      category: c.category,
      count,
      length,
      offset: -offset,
      color: CATEGORY_COLORS[c.category] || "#909399",
    };
    offset += length;
    return seg;
  });
});

const PAD = 30;
const chartW = 560;
const chartH = 260;

const pointList = computed(() => {
  if (trend.value.length === 0) return [];
  const max = Math.max(...trend.value.map((t) => t.count || 0), 1);
  const innerW = chartW - PAD * 2;
  const innerH = chartH - PAD * 2 - 20;
  return trend.value.map((t, i) => {
    const x = trend.value.length === 1 ? chartW / 2 : PAD + (innerW * i) / (trend.value.length - 1);
    const y = PAD + innerH - ((t.count || 0) / max) * innerH;
    return { x, y };
  });
});

const linePoints = computed(() =>
  pointList.value.map((p) => `${p.x},${p.y}`).join(" ")
);

function gridY(i) {
  const innerH = chartH - PAD * 2 - 20;
  return PAD + (innerH * i) / 3;
}

onMounted(async () => {
  try {
    const res = await getStats("ADMIN");
    const data = res.data.data || {};
    stats.value = data;
    trend.value = data.trend || [];
    recentOrders.value = data.recentOrders || [];
  } catch (e) {
    console.error("加载统计失败", e);
  }
});
</script>

<style scoped>
.data-card {
  text-align: center;
}
.title {
  color: #666;
  font-size: 15px;
  margin-bottom: 10px;
}
.number {
  font-size: 32px;
  font-weight: bold;
  color: #3b82f6;
}
.pie-wrap {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
  padding: 10px 0;
}
.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.count {
  color: #999;
  margin-left: 4px;
}
.line-chart {
  width: 100%;
  height: auto;
}
</style>
