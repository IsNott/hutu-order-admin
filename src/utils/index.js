
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export function getWeekStr(weekNum) {
  switch (weekNum) {
    case 1:
      return "周一";
    case 2:
      return "周二";
    case 3:
      return "周三";
    case 4:
      return "周四";
    case 5:
      return "周五";
    case 6:
      return "周六";
    case 7:
      return "周日";
  }
}

export function getIconComponent(iconName){
  if (!iconName) return null
  
  // 确保图标名称正确（首字母大写）
  const formattedName = iconName.charAt(0).toUpperCase() + iconName.slice(1)
  
  // 从导入的图标中查找
  const icon = ElementPlusIconsVue[formattedName] || ElementPlusIconsVue[iconName]
  
  return icon || null
}