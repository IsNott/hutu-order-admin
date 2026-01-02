<template>
  <el-dialog :title="title" :model-value="dialogVisible" width="1200px" :before-close="handleClose">
    <el-form ref="editFormRef" :rules="rules" :model="editForm" label-width="100px">
      <el-form-item label="类型" prop="type">
        <el-select v-model="editForm.type" placeholder="请选择类型" style="width: 100%">
          <el-option label="首页轮播" :value="0"></el-option>
          <el-option label="活动轮播" :value="1"></el-option>
          <el-option label="活动卡片" :value="2"></el-option>
        </el-select>
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
      <el-form-item label="图片列表" prop="slideShowItemList">
        <div class="image-table-container">
          <div class="add-btn-container">
            <el-button type="primary" @click="handleAddImageRow" icon="Plus">添加图片</el-button>
          </div>

          <div v-if="slideShowItemList.length > 0" class="image-table-header">
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
            <el-row v-for="(item, index) in slideShowItemList" :key="index" class="table-row" :gutter="10">
              <el-col :span="4">
                <el-form-item :prop="`slideShowItemList[${index}].imageList`">
                  <!-- <el-upload class="image-uploader" action="" :file-list="item.imageList" :limit="1"
                    :on-change="(file, fileList) => handleImageChange(file, fileList, index)"
                    :on-remove="(file, fileList) => handleImageRemove(file, fileList, index)" list-type="picture-card">
                    <el-icon>
                      <Plus />
                    </el-icon>
                  </el-upload> -->
                  <Uploader
                    :file-limit="1"
                    :size="1"
                    :data="{ type: item.type }"
                    :file-list="item.imageList"
                    :type="'img'"
                    :drag="false"
                    :multiple="false"
                    @remove="(file, fileList) => handleImageRemove(file, fileList, index)"
                    @success="(resp, file) => handleImageSuccess(resp)"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item :prop="`slideShowItemList[${index}].link`">
                  <el-input v-model="item.link" placeholder="请输入跳转链接" size="small" />
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item :prop="`slideShowItemList[${index}].sort`">
                  <el-input-number v-model="item.sort" :min="0" :step="1" size="small" placeholder="排序"
                    style="width: 100%" />
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
                <el-button v-if="index > 0" size="small" icon="Top" @click="handleMoveUp(index)">
                  上移
                </el-button>
                <el-button v-if="index < slideShowItemList.length - 1" size="small" icon="Bottom"
                  @click="handleMoveDown(index)">
                  下移
                </el-button>
              </el-col>
            </el-row>
          </div>

          <div v-if="slideShowItemList.length === 0" class="empty-state">
            <el-empty description="暂无图片，点击上方按钮添加" />
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
  rowId: {
    type: Number,
    required: false,
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
const slideShowItemList = ref([])

const rules = {
  type:[
    {
      required: true,
      message: '请选择类型',
      trigger: 'blur'
    }
  ],
  slideShowItemList: [
    {
      validator: (rule, value, callback) => {
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
  if (props.rowId) {
    slideShowApi.details(props.rowId).then(res => {
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      editForm.value = res.data
      if (editForm.value.slideShowItemList) {
        slideShowItemList.value = editForm.value.slideShowItemList.map(item => ({
          ...item,
          imageList: item.imageUrl ? [{ url: item.imageUrl }] : []
        }))
      }
    })
  }
})

const handleAddImageRow = () => {
  slideShowItemList.value.push({
    id: null,
    slideShowId: editForm.value.id,
    imageList: [],
    link: '',
    sort: slideShowItemList.value.length + 1,
    richText: false,
    outside: false,
  })
}

const handleRemoveImageRow = (index) => {
  slideShowItemList.value.splice(index, 1)
  slideShowItemList.value.forEach((item, idx) => {
    item.sort = idx + 1
  })
}

const handleMoveUp = (index) => {
  if (index > 0) {
    const temp = slideShowItemList.value[index]
    slideShowItemList.value[index] = slideShowItemList.value[index - 1]
    slideShowItemList.value[index - 1] = temp
    updateSortValues()
  }
}

const handleMoveDown = (index) => {
  if (index < slideShowItemList.value.length - 1) {
    const temp = slideShowItemList.value[index]
    slideShowItemList.value[index] = slideShowItemList.value[index + 1]
    slideShowItemList.value[index + 1] = temp
    updateSortValues()
  }
}

const updateSortValues = () => {
  slideShowItemList.value.forEach((item, index) => {
    item.sort = index + 1
  })
}

const handleImageChange = (file, fileList, index) => {
  slideShowItemList.value[index].imageList = fileList
}

const handleImageRemove = (file, fileList, index) => {
  slideShowItemList.value[index].imageList = fileList
}

const submitEdit = () => {
  editFormRef.value?.validate(async (valid) => {
    if (!valid) {
      return
    }

    const submitData = {
      ...editForm.value,
      slideShowItemList: slideShowItemList.value.map(item => ({
        ...item,
        imageUrl: item.imageList.length > 0 ? item.imageList[0].url : ''
      }))
    }

    const apiCall = submitData.id ? slideShowApi.update : slideShowApi.add
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
  editForm.value = { ...empty }
  slideShowItemList.value = []
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