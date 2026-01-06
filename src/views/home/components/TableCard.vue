<template>
  <div class="info-card">
    <div class="card-header">
      <div class="header-title">
        <span>{{ props.title }}</span>
      </div>
      <el-button v-if="props.showMore" type="text" size="small" class="more-btn" @click="handleMore">
        {{ props.moreText }}
        <el-icon><ArrowRight/></el-icon>
      </el-button>
    </div>
    <slot name="table">
    </slot>
  </div>
</template>

<script setup>
import { onMounted, defineProps, defineEmits } from 'vue'

// Data

// Computed

// Emits
const emit = defineEmits([
  'more'
])

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showMore: {
    type: Boolean,
    default: false
  },
  moreText: {
    type: String,
    default: '更多'
  }
})

// Lifecycle hooks
onMounted(() => {

})

// Watchers

// Methods
const handleMore = () => {
  emit('more')
}
</script>

<style scoped lang="scss">
.info-card {
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

    .more-btn {
      color: #909399;

      &:hover {
        color: #409EFF;
      }
    }
  }

  .rate-display {
    :deep(.el-rate) {
      .el-rate__icon {
        font-size: 14px;
      }
    }
  }
}
</style>