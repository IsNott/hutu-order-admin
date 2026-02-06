<template>
  <el-dialog :title="title" :model-value="dialogVisible" width="1000px" :before-close="handleClose">
    <el-form ref="editFormRef" :rules="rules" :model="editForm" label-width="120px">
      <div class="selection">
        <div class="line-title">
          <div class="line" />
          <div class="title">基础信息</div>
        </div>
      </div>
      <el-form-item label="封面" required>
        <uploader ref="uploaderRef" :type="'img'" :accept="'image/jpeg, image/png'" :drag="true" :multiple="false"
          :tip="'文件最大1MB, 仅支持jpg、png格式'" :data="editForm.coverUrl"></uploader>
      </el-form-item>
      <el-form-item label="商品名称" prop="itemName">
        <el-input v-model="editForm.itemName" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="单价" prop="itemPrice">
        <el-input v-model.number="editForm.itemPrice" placeholder="请输入单价">
          <template #append>
            元
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="预计制作时长" prop="expectMakeTime">
        <el-input v-model.number="editForm.expectMakeTime" placeholder="请输入预计制作时长" prefix="el-icon-time">
          <template #append>
            分
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="itemDescription">
        <el-input type="textarea" v-model="editForm.itemDescription" placeholder="请输入商品描述" />
      </el-form-item>
      <el-form-item label="轮播图" required>
        <uploader ref="imageRef" :type="'img'" :accept="'image/jpeg, image/png'" :drag="true"
          :tip="'文件最大1MB, 仅支持jpg、png格式'" :file-limit="9" :data="editForm.images" />
      </el-form-item>
      <div class="selection">
        <div class="line-title">
          <div class="line" />
          <div class="title">SKU</div>
        </div>
        <el-button type="primary" @click="addSpec" size="small" style="margin-left: 10px;"><el-icon>
            <Plus />
          </el-icon></el-button>
      </div>
      <div class="sku-specs-wrapper">
        <el-form-item>
          <div class="sku-specs-list">
            <div v-for="(spec, specIndex) in editForm.skuSpecs" :key="spec.skuSpec?.id || specIndex" class="spec-item">
              <div class="spec-header">
                <div class="spec-title">
                  <el-input v-model="spec.skuSpec.specLabel" placeholder="规格名称"
                    style="width: 200px; margin-right: 10px;" />
                  <el-checkbox v-model="spec.skuSpec.required" style="margin-right: 10px;">
                    必选
                  </el-checkbox>
                  <el-checkbox v-model="spec.skuSpec.multi">
                    可多选
                  </el-checkbox>
                </div>
                <div class="spec-actions">
                  <el-button type="danger" size="small" @click="removeSpec(specIndex)"
                    :disabled="editForm.skuSpecs.length <= 1">
                    <el-icon>
                      <CircleClose />
                    </el-icon>
                  </el-button>
                </div>
              </div>

              <!-- 规格选项列表 -->
              <div class="spec-options">
                <div class="option-actions">
                  <div class="sku-title">规格选项</div>
                  <el-button type="primary" plain size="small" @click="addOption(specIndex)">
                    <el-icon>
                      <Plus />
                    </el-icon>
                  </el-button>
                </div>
                <div v-for="(option, optionIndex) in spec.skuOptionList" :key="option.id || optionIndex"
                  class="option-item">
                  <el-input v-model="option.optionLabel" placeholder="选项名称"
                    style="width: 200px; margin-right: 10px;" />
                  <el-input-number v-model="option.additionalPrice" :min="0" :step="0.01" :precision="2"
                    controls-position="" style="width: 200px; margin-right: 10px;" placeholder="附加价格">
                    <template #prefix>
                      <span>￥</span>
                    </template>
                  </el-input-number>
                  <el-input v-model="option.optionCode" placeholder="选项编码(可选)"
                    style="width: 150px; margin-right: 10px;" />
                  <el-checkbox v-model="option.nowDisabled">
                    禁用
                  </el-checkbox>
                  <el-button type="danger" size="small" @click="removeOption(specIndex, optionIndex)"
                    :disabled="spec.skuOptionList.length <= 1">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </div>
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
import { itemApi } from '../api'
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
  },
  selectedStoreId: {
    type: String,
    required: false,
  }
})

const emit = defineEmits(['close', 'update:dialogVisible'])
const stores = ref([])
const editForm = ref({})
const editFormRef = ref(null)
const uploaderRef = ref(null)
const imageRef = ref(null)
const rules = {
  itemName: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  itemPrice: [
    { required: true, message: '请输入单价', trigger: 'blur' }
  ],
  expectMakeTime: [
    { required: true, message: '请输入预计制作时长', trigger: 'blur' }
  ]
}

onMounted(() => {
  if (props.rowId) {
    itemApi.details(props.rowId).then(res => {
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      editForm.value = res.data

      if (!editForm.value.skuSpecs) {
        editForm.value.skuSpecs = []
      }
    })
  }
})


const addSpec = () => {
  const specIndex = editForm.value?.skuSpecs?.length
  editForm.value.skuSpecs?.push({
    skuSpec: {
      specLabel: '',
      multi: false,
      required: true,
      sortOrder: specIndex,
      delFlag: false
    },
    skuOptionList: []
  })
  // 为新规格添加一个默认选项
  addOption(specIndex)
}
const removeSpec = (specIndex) => {
  editForm.value.skuSpecs.splice(specIndex, 1)
}

const addOption = (specIndex) => {
  const optionList = editForm.value.skuSpecs[specIndex].skuOptionList
  const optionIndex = optionList.length
  optionList.push({
    optionLabel: '',
    optionCode: '',
    additionalPrice: 0.00,
    nowDisabled: false,
    sortOrder: optionIndex,
    delFlag: false
  })
}

const removeOption = (specIndex, optionIndex) => {
  editForm.value.skuSpecs[specIndex].skuOptionList.splice(optionIndex, 1)
}

const validateSkuSpecs = () => {
  if (!editForm.value.skuSpecs || editForm.value.skuSpecs.length === 0) {
    ElMessage.error('请至少添加一个SKU规格')
    return false
  }

  for (const spec of editForm.value.skuSpecs) {
    if (!spec.skuSpec.specLabel || spec.skuSpec.specLabel.trim() === '') {
      ElMessage.error('请填写规格名称')
      return false
    }

    if (!spec.skuOptionList || spec.skuOptionList.length === 0) {
      ElMessage.error(`规格"${spec.skuSpec.specLabel}"需要至少一个选项`)
      return false
    }

    const optionLabels = new Set()
    for (const option of spec.skuOptionList) {
      if (!option.optionLabel || option.optionLabel.trim() === '') {
        ElMessage.error(`规格"${spec.skuSpec.specLabel}"的选项名称不能为空`)
        return false
      }

      if (optionLabels.has(option.optionLabel.trim())) {
        ElMessage.error(`规格"${spec.skuSpec.specLabel}"的选项名称不能重复`)
        return false
      }
      optionLabels.add(option.optionLabel.trim())
    }
  }

  return true
}

const submitEdit = () => {
  editFormRef.value?.validate(async (valid) => {
    if (!valid) {
      return
    }
    if (!validateSkuSpecs()) {
      return
    }
    editForm.value.coverUrl = uploaderRef.value.fileList[0].url
    if (!editForm.value.coverUrl) {
      ElMessage.error('请上传封面')
      return
    }
    editForm.value.images = imageRef.value.getFileRequest()
    if (!editForm.value.images || editForm.value.images.length === 0) {
      ElMessage.error('请上传轮播图')
      return
    }
    const apiCall = editForm.value.id ? itemApi.update : itemApi.add
    const res = await apiCall(editForm.value)
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
  editForm.value = {}
  editFormRef.value?.resetFields()
  editFormRef.value?.clearValidate()
}
</script>

<style scoped lang="scss">
:deep(.el-dialog__footer) {
  text-align: center important;
}

.line-title {
  display: flex;
  align-items: center;

  .line {
    background: rgb(10, 60, 167);
    width: 6px;
    height: 20px;
    // margin-right: 10px;
    border-radius: 2px;
  }

  .title {
    font-size: 22px;
    // font-weight: 500;
    margin-left: 10px;
  }
}

.sku-title {
  font-size: 20px;
  // font-weight: 500;
}

.sku-specs-wrapper {
  margin-top: 20px;
}

.spec-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}

.spec-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #dee2e6;
}

.spec-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.spec-actions {
  display: flex;
  align-items: center;
}

.spec-options {
  margin-top: 10px;
}

.option-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
}

.option-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  // padding-left: 10px;
}

.selection {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  padding: 10 20px;
}

.spec-actions-global {
  margin-top: 20px;
  text-align: center;
}

// 响应式调整
@media (max-width: 768px) {

  .spec-title,
  .option-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .spec-title>*,
  .option-item>* {
    margin-bottom: 8px;
    width: 100% !important;
  }

  .spec-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .spec-actions {
    margin-top: 10px;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>