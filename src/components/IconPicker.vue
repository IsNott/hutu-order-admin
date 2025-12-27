<template>
  <div class="simple-icon-picker">
    <!-- 输入框触发器 -->
    <el-input
      v-model="displayValue"
      :placeholder="placeholder"
      readonly
      @click="showPicker = true"
      class="icon-input-trigger"
    >
      <template #prefix>
        <el-icon v-if="selectedIcon">
          <component :is="getIconComponent(selectedIcon)" />
        </el-icon>
      </template>
      <template #suffix>
        <el-icon @click.stop="clearSelection">
          <Close v-if="selectedIcon" />
          <ArrowDown v-else />
        </el-icon>
      </template>
    </el-input>

    <!-- 图标选择弹窗 -->
    <el-dialog
      v-model="showPicker"
      :title="dialogTitle"
      width="60%"
      :show-close="false"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      custom-class="icon-picker-dialog"
    >
      <div class="icons-grid">
        <div
          v-for="(IconComponent, iconName) in displayedIcons"
          :key="iconName"
          class="icon-cell"
          :class="{ 'icon-cell-selected': selectedIcon === iconName }"
          @click="handleIconSelect(iconName)"
          :title="iconName"
        >
          <el-icon class="icon-display">
            <component :is="IconComponent" />
          </el-icon>
        </div>
      </div>
      
      <!-- 分页（如果图标很多） -->
      <div class="pagination-container" v-if="totalPages > 1">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="totalIcons"
          :pager-count="5"
          small
        />
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPicker = false">取消</el-button>
          <el-button type="primary" @click="confirmSelection">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { Close, ArrowDown } from '@element-plus/icons-vue'

// 定义props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请选择图标'
  },
  dialogTitle: {
    type: String,
    default: '选择图标'
  },
  pageSize: {
    type: Number,
    default: 60
  },
  // 是否显示常用图标
  showCommonIcons: {
    type: Boolean,
    default: true
  }
})

// 定义emits
const emit = defineEmits(['update:modelValue', 'change'])

// 响应式数据
const showPicker = ref(false)
const selectedIcon = ref(props.modelValue)
const tempSelectedIcon = ref(props.modelValue)
const currentPage = ref(1)
const pageSize = ref(props.pageSize)

// 常用图标列表（可以根据需要调整）
const commonIcons = [
  'HomeFilled',
  'User',
  'Setting',
  'Search',
  'Edit',
  'Delete',
  'Plus',
  'Minus',
  'Check',
  'Close',
  'Refresh',
  'Upload',
  'Download',
  'Message',
  'Notification',
  'Star',
  'ShoppingCart',
  'Goods',
  'Shop',
  'Location'
]

// 所有图标
const allIcons = ref({})

// 初始化图标
onMounted(() => {
  allIcons.value = ElementPlusIconsVue
})

// 显示的图标（分页处理）
const displayedIcons = computed(() => {
  const icons = Object.entries(allIcons.value)
  
  // 如果显示常用图标且在第一页
  if (props.showCommonIcons && currentPage.value === 1) {
    // 从常用图标开始
    const commonIconsObj = {}
    commonIcons.forEach(iconName => {
      if (allIcons.value[iconName]) {
        commonIconsObj[iconName] = allIcons.value[iconName]
      }
    })
    
    // 如果是第一页，显示常用图标 + 其他图标
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    
    const allIconEntries = Object.entries(allIcons.value)
    const pageIcons = allIconEntries.slice(startIndex, endIndex)
    
    // 合并常用图标和当前页的图标
    const result = { ...commonIconsObj }
    pageIcons.forEach(([name, component]) => {
      if (!result[name]) {
        result[name] = component
      }
    })
    
    return result
  }
  
  // 普通分页逻辑
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  const pageIcons = icons.slice(startIndex, endIndex)
  
  return Object.fromEntries(pageIcons)
})

// 图标总数
const totalIcons = computed(() => {
  return Object.keys(allIcons.value).length
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(totalIcons.value / pageSize.value)
})

// 显示的值（选中的图标名称）
const displayValue = computed(() => {
  return selectedIcon.value
})

// 获取图标组件
const getIconComponent = (iconName) => {
  return allIcons.value[iconName]
}

// 处理图标选择（临时选择）
const handleIconSelect = (iconName) => {
  tempSelectedIcon.value = iconName
}

// 确认选择
const confirmSelection = () => {
  selectedIcon.value = tempSelectedIcon.value
  emit('update:modelValue', selectedIcon.value)
  emit('change', selectedIcon.value)
  showPicker.value = false
}

// 清空选择
const clearSelection = (e) => {
  e.stopPropagation()
  selectedIcon.value = ''
  tempSelectedIcon.value = ''
  emit('update:modelValue', '')
  emit('change', '')
}

// 监听外部modelValue变化
watch(() => props.modelValue, (newVal) => {
  selectedIcon.value = newVal
  tempSelectedIcon.value = newVal
})

// 弹窗显示时重置临时选择
watch(showPicker, (newVal) => {
  if (newVal) {
    tempSelectedIcon.value = selectedIcon.value
  }
})
</script>

<style scoped>
.simple-icon-picker {
  width: 100%;
}

.icon-input-trigger {
  cursor: pointer;
}

.icon-input-trigger :deep(.el-input__inner) {
  cursor: pointer;
}

.icon-input-trigger :deep(.el-input__suffix) {
  cursor: pointer;
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.icon-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f8f9fa;
}

.icon-cell:hover {
  background-color: #f0f9ff;
  border-color: #c6e2ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.icon-cell-selected {
  background-color: #ecf5ff;
  border-color: #409eff;
  border-width: 2px;
}

.icon-display {
  font-size: 24px;
  color: #606266;
}

.icon-cell-selected .icon-display {
  color: #409eff;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.icon-picker-dialog) {
  max-width: 800px;
}

:deep(.icon-picker-dialog .el-dialog__body) {
  padding-bottom: 10px;
}

:deep(.icon-picker-dialog .el-dialog__footer) {
  padding-top: 10px;
}
</style>