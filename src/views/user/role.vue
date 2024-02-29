<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit-outline" @click="handleCreate">
        添加角色
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="角色ID" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="name" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色键值" prop="roleKey" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roleKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色描述" prop="description" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate" width="170px" align="center" />
      <el-table-column label="修改时间" prop="updateDate" width="170px" align="center" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getRoleList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="角色键值" prop="roleKey">
          <el-input v-model="temp.roleKey" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <!-- <el-form-item label="角色权限">
          <el-select v-model="temp.permissionIds" v-loading="formLoading" multiple class="filter-item" placeholder="配置角色的权限(可为空)">
            <el-option v-for="item in permissions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="角色权限">
          <el-checkbox-group v-model="temp.permissionIds" style="width: 500px">
            <el-checkbox v-for="item in permissions" :key="item.id" :label="item.id" :value="item.id">
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchRoleList, createRole, getRoleWithPermissions, updateRole, deleteRole } from '@/api/role'
import { fetchPermissions } from '@/api/permission'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import role from 'mock/role'

export default {
  name: 'RoleManager',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      formLoading: false,
      list: null,
      total: 0,
      listQuery: {
        roleKey: undefined,
        name: undefined,
        description: undefined,
        page: 1,
        limit: 20,
        sort: 'id',
        rank: 'ASC'
      },
      temp: {
        id: undefined,
        roleKey: '',
        name: '',
        description: '',
        permissionIds: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改角色',
        create: '添加角色'
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'change' }],
        roleKey: [{ required: true, message: '角色键值不能为空', trigger: 'change' }]
      },
      permissions: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      this.listLoading = true
      fetchRoleList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        roleKey: '',
        name: '',
        description: '',
        permissionIds: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

      if (this.permissions.length === 0) {
        // get selectable roles
        this.formLoading = true
        fetchPermissions().then(response => {
          this.permissions = response.data

          setTimeout(() => {
            this.formLoading = false
          }, 1.5 * 1000)
        })
      }

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRole(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '添加角色成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      // this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true

      getRoleWithPermissions(row.id).then(response => {
        this.temp.id = response.data.id
        this.temp.name = response.data.name
        this.temp.roleKey = response.data.roleKey
        this.temp.description = response.data.description
        this.temp.permissionIds = response.data.permissions.map(permission => permission.id)
      })

      if (this.permissions.length === 0) {
        // get selectable roles
        this.formLoading = true
        fetchPermissions().then(response => {
          this.permissions = response.data

          setTimeout(() => {
            this.formLoading = false
          }, 1.5 * 1000)
        })
      }

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          updateRole(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '修改角色成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteRole(row.id).then(response => {
        this.$notify({
          title: 'Success',
          message: '删除角色成功',
          type: 'success',
          duration: 5000
        })
        this.getRoleList()
      })
    }
  }
}
</script>
