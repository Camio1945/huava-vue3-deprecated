<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="name">
          <el-input v-model="searchData.name" placeholder="名称" title="名称" />
        </el-form-item>
        <el-form-item prop="description" label="">
          <el-input v-model="searchData.description" placeholder="描述" title="描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleCreate">新增角色</el-button>
          <el-button type="danger" :icon="Delete" v-if="false">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="名称" align="center" />
          <el-table-column prop="sort" label="排序" align="center" />
          <el-table-column prop="description" label="描述" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)" v-if="scope.row.id != 1">
                修改
              </el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)" v-if="scope.row.id != 1">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <RoleForm v-if="isFormVisible" ref="formRef" @success="getTableData" @close="isFormVisible = false" />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref, shallowRef, watch } from "vue"
import { del, page, type Role } from "@/api/sys/role"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import RoleForm from "./components/RoleForm.vue"

const formRef = shallowRef<InstanceType<typeof RoleForm>>()
const isFormVisible = ref<boolean>(false)

defineOptions({
  // 命名当前组件
  name: "rolePage"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 删
const handleDelete = (row: Role) => {
  ElMessageBox.confirm(`正在删除角色：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    del(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 查
const tableData = ref<Role[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "",
  description: ""
})
const getTableData = () => {
  loading.value = true
  page({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    username: searchData.name || undefined,
    description: searchData.description || undefined
  })
    .then((data) => {
      paginationData.total = data.total
      tableData.value = data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

const handleCreate = async () => {
  isFormVisible.value = true
  await nextTick()
  // RoleForm.vue -> open
  formRef.value?.open("create")
}

const handleUpdate = async (data: Role) => {
  isFormVisible.value = true
  await nextTick()
  // RoleForm.vue -> open
  formRef.value?.open("update")
  formRef.value?.setFormData(data.id)
}

//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, {
  immediate: true
})
</script>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
