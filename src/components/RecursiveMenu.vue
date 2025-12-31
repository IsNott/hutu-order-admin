<!-- components/RecursiveMenu.vue -->
<template>
  <template v-for="item in menuItems" :key="item.sort">
    <!-- 没有子菜单的项 -->
    <el-menu-item v-if="!item.hasChildren" :index="getIndexPath(item)">
      <!-- <svg-icon :icon-class="item.icon" /> -->
      <el-icon>
        <component :is="getIconComponent(item.icon)" />
      </el-icon>
      <span>{{ item.title }}</span>
    </el-menu-item>

    <!-- 有子菜单的项 -->
    <el-sub-menu v-else :index="getIndexPath(item)">
      <template #title>
        <el-icon>
          <component :is="getIconComponent(item.icon)" />
        </el-icon>
        <span>{{ item.title }}</span>
      </template>
      <!-- 递归调用 -->
      <RecursiveMenu :menu-items="item.children" :parent-index="getIndexPath(item)" @select="$emit('select', $event)" />
    </el-sub-menu>
  </template>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { getIconComponent } from '@/utils'

const props = defineProps({
  menuItems: {
    type: Array,
    default: () => []
  },
  parentIndex: {
    type: String,
    default: ''
  }
})

// 进行排序（index重复时，index小的排前面）
const sortedMenuItems = computed(() => {
  props.menuItems.sort((a, b) => {
    if (a.index === b.index) {
      return a.index
    }
    return a.index - b.index
  })
})

const emit = defineEmits(['select'])

const getIndexPath = (item) => {
  return props.parentIndex
    ? `${props.parentIndex}-${item.sort}`
    : item.sort.toString()
}
</script>