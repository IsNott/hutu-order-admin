<template>
  <div class="card-item">
    <div class="card-icon">
      <svg-icon :icon-class="item.icon" class="icon" />
    </div>
    <div class="card-content">
      <div class="card-title">{{ item.title }}</div>
      <div class="card-val">{{ formatValue(item) }}</div>
      <div class="card-trend" v-if="item.ratio !== undefined">
        <span class="trend-icon" :class="item.ratio > 0 ? 'up' : 'down'">
          <el-icon>
            <CaretTop v-if="item.ratio > 0" />
            <CaretBottom v-else />
          </el-icon>
        </span>
        <span class="trend-value" :class="item.ratio > 0 ? 'up' : 'down'">
          {{ getRatioStr(item.ratio) }}
        </span>
        <span class="trend-label">{{ getCompareStr(item.compare) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, watch, computed } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'

// Data

// Computed

// Emits
const emit = defineEmits([

])

// Props
const props = defineProps({
  item: {
    type: Object,
    default: () => { }
  }
})

// Lifecycle hooks
onMounted(() => {

})

// Watchers

// Methods
const formatValue = (item) => {
  if (item.title === '营业额') {
    return `¥${item.val.toFixed(2)}`
  }
  return item.val
}

const getRatioStr = (ratio) => {
  const percent = Math.abs(ratio * 100).toFixed(1)
  return `${percent}%`
}

const getCompareStr = (type) => {
  switch (type) {
    case 'week':
      return '较上周'
    case 'month':
      return '较上月'
    default:
      return '较上日'
  }
}
</script>

<style scoped lang="scss">
.card-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  border: 1px solid #ebeef5;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08);
    border-color: #409EFF;
  }

  .card-icon {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      font-size: 28px;
      color: white;
    }

    &:nth-child(2) {
      background: linear-gradient(135deg, #67C23A 0%, #85ce61 100%);
    }

    &:nth-child(3) {
      background: linear-gradient(135deg, #E6A23C 0%, #ebb563 100%);
    }
  }

  .card-content {
    flex: 1;

    .card-title {
      font-size: 14px;
      color: #909399;
      margin-bottom: 8px;
    }

    .card-val {
      font-size: 28px;
      font-weight: 600;
      color: black;
      margin-bottom: 12px;
    }

    .card-trend {
      display: flex;
      align-items: center;
      gap: 6px;

      .trend-icon {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;

        &.down {
          background: rgba(103, 194, 58, 0.1);
          color: #67C23A;
        }

        &.up {
          background: rgba(245, 108, 108, 0.1);
          color: #F56C6C;
        }

        i {
          font-size: 12px;
        }
      }

      .trend-value {
        font-size: 14px;
        font-weight: 500;

        &.down {
          color: #67C23A;
        }

        &.up {
          color: #F56C6C;
        }
      }

      .trend-label {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}
</style>