<template>
  <el-dialog :title="title" :model-value="dialogVisible" width="1000px" :before-close="handleClose">
    <el-form ref="editFormRef" :model="editForm" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单标题" prop="title">
            <el-input v-model="editForm.title" :placeholder="'请输入菜单标题'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单编码" prop="name">
            <el-input v-model="editForm.name" :placeholder="'请输入菜单编码'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="组件路径">
            <el-input v-model="editForm.component" :disabled="editForm.type == 1" :placeholder="'请输入组件路径(相对/src/views, 不需要带.vue后缀)'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="访问路由" prop="path">
            <el-input v-model="editForm.path" :disabled="editForm.type == 1" :placeholder="'请输入访问路由'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单图标" prop="icon">
            <icon-picker v-model="editForm.icon" placeholder="请选择菜单图标" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input v-model="editForm.sort" :placeholder="'请输入排序'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单类型" prop="type">
            <el-select clearable v-model="editForm.type" placeholder="请选择">
              <el-option label="目录" :value="1"></el-option>
              <el-option label="菜单" :value="2"></el-option>
              <el-option label="按钮" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model="editForm.permission" :disabled="editForm.type == 1"
              :placeholder="editForm.type == 1 ? '' : '请输入权限标识'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="是否显示" prop="visible">
        <!-- <el-input v-model="editForm.visible" :placeholder="'请输入是否显示'" /> -->
        <el-switch v-model="editForm.visible" />
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
import { menuApi } from '../api'
import IconPicker from '@/components/IconPicker.vue'
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
  type: {
    type: Number,
    default: null
  },
  parentId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'update:dialogVisible'])
const empty = {}
const editForm = ref({
  visible: true
})
const editFormRef = ref(null)
const vaildNeedPermission = (rule, value, callback) => {
  if (props.type == 1) {
    callback()
  } else {
    if (!value) {
      callback(new Error('请输入权限标识'))
    } else {
      callback()
    }
  }
}

const vaildNeedComponent = (rule, value, callback) => {
  if (props.type == 1 || props.type == 3) {
    callback()
  } else {
    if (!value) {
      callback(new Error('请输入组件路径'))
    } else {
      callback()
    }
  }
}

const rules = {
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路由路径（对应前端路由path）', trigger: 'blur' }
  ],
  component: [
    { validator: vaildNeedComponent, trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入菜单标题（对应前端meta.title）', trigger: 'blur' }
  ],
  icon: [
    { required: true, message: '请输入菜单图标', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ],
  visible: [
    { required: true, message: '请输入是否显示（1显示，0隐藏）', trigger: 'blur' }
  ],
  keepAlive: [
    { required: true, message: '请输入是否缓存（1缓存，0不缓存）', trigger: 'blur' }
  ],
  type: [
    { required: false, message: '请输入菜单类型（1菜单，2按钮）', trigger: 'blur' }
  ],
  permission: [
    { validator: vaildNeedPermission, trigger: 'blur' }
  ],
}

onMounted(async () => {
  if (props.rowId) {
    menuApi.details(props.rowId).then(res => {
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      editForm.value = res.data
    })
  }
  if(props.type){
    editForm.value.type = props.type
  }
})


const submitEdit = () => {
  editFormRef.value?.validate(async (valid) => {
    if (!valid) {
      return
    }
    editForm.value.parentId = props.parentId
    editForm.value.type = props.type
    const apiCall = editForm.value.id ? menuApi.update : menuApi.add
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
  editForm.value = { ...empty }
  editFormRef.value?.resetFields()
  editFormRef.value?.clearValidate()
}
</script>

<style scoped lang="scss">
::v-deep(.el-dialog__footer) {
  text-align: center;
}
</style>