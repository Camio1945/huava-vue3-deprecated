<template>
  <div>
    <popup
      ref="popupRef"
      :title="popupTitle"
      :async="true"
      width="550px"
      @confirm="handleSubmit"
      @close="handleClose"
    >
      <el-form
        class="ls-form"
        ref="formRef"
        :rules="rules"
        :model="formData"
        label-width="60px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            class="ls-input"
            v-model="formData.name"
            placeholder="请输入名称"
            maxlength="20"
            clearable
          />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input
            v-model="formData.description"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import { create, update, detail, isNameExists, type Role } from "@/api/sys/role"
import Popup from "@/components/Popup/index.vue"
import { type FormInstance, ElMessage, FormItemRule } from "element-plus"
import { computed, reactive, ref, shallowRef } from "vue"
import { Arrayable } from "element-plus/lib/utils"

const emit = defineEmits(["success", "close"])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref("create")
const popupTitle = computed(() => {
  if (mode.value === "create") {
    return "新增角色"
  }
  return mode.value == "update" ? "编辑角色" : "角色详情"
})
const formData = reactive({
  id: "",
  name: "",
  description: ""
})

const validateName = (rule: FormItemRule, value: string, callback: any) => {
  if (!value) {
    return callback()
  }
  isNameExists(formData.id, value).then((res) => {
    if (res) {
      callback(new Error("名称已经存在"))
    } else {
      callback()
    }
  })
}

const rules: Partial<Record<string, Arrayable<FormItemRule>>> = {
  name: [
    { required: true, message: "请输入名称", trigger: ["blur", "change"] },
    {
      min: 3,
      max: 10,
      message: "名称长度应该为 3 ~ 20 个字符",
      trigger: ["blur", "change"]
    },
    { validator: validateName, trigger: "blur" }
  ]
}

// const rules = {
//   name: [
//     {
//       required: true,
//       message: "请输入名称",
//       trigger: ["blur"],
//     },
//     {
//       min: 3,
//       max: 20,
//       message: "名称长度应该为 3 ~ 20 个字符",
//       trigger: ["blur"],
//     },
//     { validator: validateName, trigger: "blur" },
//   ],
// };

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = { ...formData }
  if (mode.value === "create") {
    await create(params)
    ElMessage.success("操作成功")
  } else if (mode.value === "update") {
    await update(params)
    ElMessage.success("操作成功")
  }
  popupRef.value?.close()
  emit("success")
}

const handleClose = () => {
  emit("close")
}

const open = (type: string) => {
  mode.value = type
  popupRef.value?.open()
}

const setFormData = async (id: string) => {
  const data: Role = await detail(id)
  formData.id = data.id
  formData.description = data.description
  formData.name = data.name
}

defineExpose({
  open,
  setFormData
})
</script>
