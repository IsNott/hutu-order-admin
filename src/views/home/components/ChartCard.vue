<template>
  <div class="chart-card">
    <div class="card-header">
      <div class="header-title">
        <span>{{ props.title }}</span>
      </div>
      <div class="date-filter">
        <slot name="filter">
        </slot>
      </div>
    </div>
    <div class="chart-container">
      <div class="chart-placeholder">
        <div class="placeholder-content" :id="key">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import * as echarts from 'echarts'
// Data
const chart = ref(null)
const key = new Date().getTime()
// Computed

// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

watch(() => props.data, (nVal) => {
  // chart.value.setOption(props.data)
  chart.value.setOption(nVal)
})

// Lifecycle hooks
onMounted(() => {
  chart.value = echarts.init(document.getElementById(key))
  chart.value.setOption(props.data)
})

// Watchers

// Methods

</script>

<style scoped lang="scss">
.chart-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebeef5;

    .header-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 500;
      color: #303133;

      .header-icon {
        font-size: 20px;
        color: #409EFF;
      }
    }

    .date-filter {
      width: 120px;
    }
  }

  .chart-container {
    flex: 1;
    min-height: 300px;

    .chart-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f9f9f9;
      border-radius: 8px;

      .placeholder-content {
        text-align: center;
        color: #909399;
        width: 450px;
        height: 300px;

        .placeholder-icon {
          font-size: 60px;
          color: #dcdfe6;
          margin-bottom: 20px;
        }

        .placeholder-text {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 8px;
          color: #606266;
        }

        .placeholder-hint {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
}
</style>