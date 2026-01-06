<template>
  <el-dialog :title="title" :model-value="dialogVisible" width="1200px" :before-close="handleClose">
    <el-form ref="editFormRef" :rules="rules" :model="editForm" label-width="100px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="editForm.name" :placeholder="'请输入分类名称'" />
      </el-form-item>
      <el-form-item label="分类值" prop="type">
        <el-input v-model.number="editForm.type" :placeholder="'请输入分类值'" />
      </el-form-item>
      <el-form-item label="开始时间" prop="availableStartTime">
        <el-date-picker style="width: 100%" v-model="editForm.availableStartTime" type="date"
          placeholder="请选择开始时间（留空为长期）" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="结束时间" prop="availableEndTime">
        <el-date-picker style="width: 100%" v-model="editForm.availableEndTime" type="date" placeholder="请选择结束时间（留空为长期）"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="备注" prop="mark">
        <el-input v-model="editForm.mark" :placeholder="'请输入备注'" />
      </el-form-item>
      <el-form-item label="图片列表">
        <div class="image-table-container">
          <div class="add-btn-container">
            <el-button type="primary" @click="handleAddImageRow" icon="Plus">添加图片</el-button>
          </div>

          <div v-if="slideShowItems.length > 0" class="image-table-header">
            <el-row class="table-header-row">
              <el-col :span="4">图片</el-col>
              <el-col :span="4">跳转链接</el-col>
              <el-col :span="4">排序</el-col>
              <el-col :span="4">是否富文本</el-col>
              <el-col :span="4">是否外链</el-col>
              <el-col :span="4">操作</el-col>
            </el-row>
          </div>

          <div class="image-table-body">
            <el-row v-for="(item, index) in slideShowItems" :key="index" class="table-row" :gutter="10">
              <el-col :span="4">
                <el-form-item :prop="`slideShowItems[${index}].attachUrl`">
                  <Uploader
                    :ref="el => setUploader(el, index)"
                    :data="item.attachUrl"
                    :drag="false"
                    :size="2"
                    :accept="'.jpg,.png'"
                    :tip="'文件最大2MB, 仅支持jpg、png格式'"
                    :multiple="false"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item :prop="`slideShowItems[${index}].navigateUrl`">
                  <el-input v-model="item.navigateUrl" placeholder="请输入跳转链接" size="small" />
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item :prop="`slideShowItems[${index}].sortOrder`">
                  <el-input-number v-model="item.sortOrder" :min="0" :step="1" size="small" placeholder="排序"
                    style="width: 80%" />
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item label-width="0">
                  <el-switch v-model="item.richText" active-text="是" inactive-text="否" />
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item label-width="0">
                  <el-switch v-model="item.outside" active-text="是" inactive-text="否" />
                </el-form-item>
              </el-col>

              <el-col :span="4" class="action-col">
                <el-button type="danger" size="small" icon="Delete" @click="handleRemoveImageRow(index)">
                  删除
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { slideShowApi } from '../api'
import Uploader from '@/components/Uploader.vue'
const props = defineProps({
  title: {
    type: String,
    default: '操作'
  },
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'update:dialogVisible'])
const empty = {}
const editForm = ref(empty)
const editFormRef = ref(null)
const slideShowItems = ref([])
const uploaderList = ref([])
const rules = {
  type:[
    {
      required: true,
      message: '请选择类型',
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    }
  ],
  slideShowItems: [
    {
      validator: (rule, value, callback) => {
        console.log(value);
        
        if (!value || value.length === 0) {
          callback(new Error('至少需要添加一张图片'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

onMounted(async () => {
})

const setUploader = (el, index) => {
  if(el){
    uploaderList.value[index] = el
  }
}

const handleAddImageRow = () => {
  slideShowItems.value.push({
    id: null,
    slideShowId: editForm.value.id,
    navigateUrl: '',
    sortOrder: slideShowItems.value.length + 1,
    richText: false,
    outside: false,
  })
}

const handleRemoveImageRow = (index) => {
  slideShowItems.value.splice(index, 1)
  slideShowItems.value.forEach((item, idx) => {
    item.sort = idx + 1
  })
}

const handleMoveUp = (index) => {
  if (index > 0) {
    const temp = slideShowItems.value[index]
    slideShowItems.value[index] = slideShowItems.value[index - 1]
    slideShowItems.value[index - 1] = temp
    updateSortValues()
  }
}

const handleMoveDown = (index) => {
  if (index < slideShowItems.value.length - 1) {
    const temp = slideShowItems.value[index]
    slideShowItems.value[index] = slideShowItems.value[index + 1]
    slideShowItems.value[index + 1] = temp
    updateSortValues()
  }
}

const updateSortValues = () => {
  slideShowItems.value.forEach((item, index) => {
    item.sortOrder = index + 1
  })
}

const submitEdit = () => {
  editFormRef.value?.validate(async (valid) => {
    if (!valid) {
      return
    }
    slideShowItems.value.forEach((item, index) => {
      item.id = ''
      item.attachUrl = uploaderList.value[index]?.fileList[0]?.url || ''
    })
    const submitData = {
      ...editForm.value,
      slideShowItems: slideShowItems.value
    }
    const apiCall = slideShowApi.add
    const res = await apiCall(submitData)
    if (res.code !== 200) {
      ElMessage.error(res.message)
      return
    }
    ElMessage.success(res.message)
    handleClose()
  })
}

const handleClose = () => {
  emit('update:dialogVisible', false)
  emit('close')
  editForm.value = { }
  slideShowItems.value = []
  editFormRef.value?.resetFields()
  editFormRef.value?.clearValidate()
}
</script>

<style scoped lang="scss">
::v-deep(.el-dialog__footer) {
  text-align: center;
}

.image-table-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 16px;
  background-color: #fff;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  .add-btn-container {
    margin-bottom: 16px;
  }

  .image-table-header {
    background-color: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
    padding: 12px 0;
    margin-bottom: 8px;

    .table-header-row {
      font-weight: bold;
      color: #606266;
      padding: 0 8px;
    }
  }

  .image-table-body {
    .table-row {
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
      align-items: center;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #fafafa;
      }
    }

    .action-col {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
  }

  .empty-state {
    padding: 40px 0;
    text-align: center;
    color: #909399;
  }
}

.image-uploader {
  :deep(.el-upload) {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
}

.el-col {
  padding: 0 8px;
}
</style>