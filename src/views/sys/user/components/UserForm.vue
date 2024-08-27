<template>
  <div>
    <popup ref="popupRef" :title="popupTitle" :async="true" @confirm="handleSubmit" @close="handleClose">
      <el-form class="ls-form" ref="formRef" :rules="rules" :model="formData" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input class="ls-input" v-model="formData.username" placeholder="请输入用户名" maxlength="20" clearable />
        </el-form-item>
        <el-form-item label="修改密码" prop="isUpdatingPassword" v-if="mode === 'update'">
          <el-radio-group v-model="isUpdatingPassword">
            <el-radio :value="1">使用新密码</el-radio>
            <el-radio :value="0">不修改密码</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="mode === 'create' || isUpdatingPassword">
          <el-input
            :type="passwordVisible ? 'text' : 'password'"
            class="ls-input"
            v-model="formData.password"
            placeholder="请输入密码"
            maxlength="20"
          >
            <template #suffix>
              <span @click="passwordVisible = !passwordVisible" style="cursor: pointer">
                <el-icon v-if="passwordVisible"><View /></el-icon>
                <el-icon v-else><Hide /></el-icon>
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input class="ls-input" v-model="formData.realName" placeholder="请输入姓名" maxlength="20" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input
            class="ls-input"
            v-model="formData.phoneNumber"
            placeholder="请输入手机号"
            maxlength="20"
            clearable
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formData.gender">
            <el-radio value="M">男</el-radio>
            <el-radio value="F">女</el-radio>
            <el-radio value="U">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnabled">
          <el-radio-group v-model="formData.isEnabled">
            <el-radio :value="true">启用</el-radio>
            <el-radio :value="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="禁用原因" prop="disabledReason" v-if="!formData.isEnabled">
          <el-input
            class="ls-input"
            v-model="formData.disabledReason"
            placeholder="请输入禁用原因"
            maxlength="200"
            clearable
          />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-checkbox-group v-model="formData.roleIds">
            <el-checkbox :value="item.id" v-for="item in roles" v-bind:key="item.id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img :src="avatarUrl || '/upload.png'" class="avatar" alt="" />
          </el-upload>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import { create, update, detail, isUsernameExists, type User, type CreateOrUpdateUserRequestData } from "@/api/sys/user"
import { page as rolePage, Role, RoleResData } from "@/api/sys/role"
import Popup from "@/components/Popup/index.vue"
import { type FormInstance, ElMessage, FormItemRule } from "element-plus"
import { computed, reactive, ref, shallowRef } from "vue"
import { Arrayable } from "element-plus/lib/utils"
import { getToken } from "@/utils/cache/cookies"
import { View, Hide } from "@element-plus/icons-vue"
import { Attachment } from "@/api/common/attachment"
import { setFormDataByDbData } from "@/utils/fn"

const emit = defineEmits(["success", "close"])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref("create")
const popupTitle = computed(() => {
  if (mode.value === "create") {
    return "新增用户"
  }
  return mode.value == "update" ? "编辑用户" : "用户详情"
})

const isUpdatingPassword = ref<number>(0)
const passwordVisible = ref<boolean>(false)
const avatarUrl = ref<string | undefined>(undefined)
const uploadUrl = ref<string>(import.meta.env.VITE_BASE_API + "/common/attachment/upload")
const headers = ref<any>({ Authorization: "Bearer " + getToken() })
const roles = ref<Role[]>([])

const handleAvatarSuccess = (res: Attachment, file: File) => {
  avatarUrl.value = import.meta.env.VITE_BASE_API + res.url
  formData.avatar = res.url
  console.log(avatarUrl.value)
  console.log(res, file)
}

const beforeAvatarUpload = (file: File) => {
  const isJPGorPNG = file.type === "image/jpeg" || file.type === "image/png"
  const isLt512K = file.size / 1024 <= 512
  if (!isJPGorPNG) {
    ElMessage.error("上传头像图片只能是 JPG 或 PNG 格式")
  }
  if (!isLt512K) {
    ElMessage.error("上传头像图片大小不能超过 512 KB")
  }
  return isJPGorPNG && isLt512K
}

const formData: CreateOrUpdateUserRequestData = reactive({
  id: "",
  username: "",
  password: "",
  realName: "",
  phoneNumber: "",
  gender: "U",
  isEnabled: true,
  disabledReason: "",
  roleIds: [],
  avatar: ""
})

const validateUsername = (rule: FormItemRule, value: string, callback: any) => {
  if (!value) {
    return callback()
  }
  isUsernameExists(formData.id, value).then((res) => {
    if (res) {
      callback(new Error("用户名已经存在"))
    } else {
      callback()
    }
  })
}

const rules: Partial<Record<string, Arrayable<FormItemRule>>> = {
  username: [
    { required: true, message: "请输入用户名", trigger: ["blur", "change"] },
    {
      min: 3,
      max: 20,
      message: "用户名长度应该为 3 ~ 20 个字符",
      trigger: ["blur", "change"]
    },
    { validator: validateUsername, trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: ["blur", "change"] },
    {
      min: 8,
      max: 20,
      message: "密码长度应该为 8 ~ 20 个字符",
      trigger: ["blur", "change"]
    }
  ],
  roleIds: [{ required: true, message: "请选择角色", trigger: ["blur", "change"] }],
  disabledReason: [{ required: true, message: "请输入禁用原因", trigger: ["blur", "change"] }]
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = { ...formData }
  if (mode.value === "create") {
    await create(params)
  } else if (mode.value === "update") {
    await update(params)
  }
  ElMessage.success("操作成功")
  popupRef.value?.close()
  emit("success")
}

const handleClose = () => {
  emit("close")
}

const open = async (type: string) => {
  mode.value = type
  popupRef.value?.open()
  const roleResData: RoleResData = await rolePage({ current: 1, size: 500, searchCount: false })
  roles.value = roleResData.list
}

const setFormData = async (id: string) => {
  const data: User = await detail(id)
  setFormDataByDbData(formData, data)
  formData.password = ""
  if (data.avatar) {
    avatarUrl.value = import.meta.env.VITE_BASE_API + data.avatar
  }
}

defineExpose({
  open,
  setFormData
})
</script>
<style lang="scss" scoped>
.avatar-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
