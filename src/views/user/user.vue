<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="用户名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.title" placeholder="用户岗位" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" placeholder="用户电话" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索用户
      </el-button>
      <el-button v-permission="['user:create']" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit-outline" @click="handleCreate">
        添加用户
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
      @sort-change="sortChange"
    >
      <el-table-column label="用户ID" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" prop="name" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户岗位" prop="title" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户电话" prop="phone" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate" width="170px" align="center" />
      <el-table-column label="修改时间" prop="updateDate" width="170px" align="center" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-permission="['user:update']" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" v-permission="['user:delete']" size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUserList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="用户岗位" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="用户电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="temp.roleIds" v-loading="formLoading" multiple class="filter-item" placeholder="选择角色(可为空)">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button v-permission="['user:create', 'user:update']" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提 交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserList, createUser, getUserWithRoles, updateUser, deleteUser } from '@/api/user'
import { fetchRoles } from '@/api/role'
import permission from '@/directive/permission/index.js' // 权限判断指令
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import role from 'mock/role'

export default {
  name: 'UserManager',
  components: { Pagination },
  directives: { waves, permission },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      formLoading: false,
      list: null,
      total: 0,
      listQuery: {
        name: undefined,
        title: undefined,
        phone: undefined,
        page: 1,
        limit: 20,
        sort: 'id',
        rank: 'ASC'
      },
      temp: {
        id: undefined,
        name: '',
        title: '',
        phone: '',
        roleIds: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改用户',
        create: '添加用户'
      },
      rules: {
        name: [{ required: true, message: '用户名称不能为空', trigger: 'change' }],
        phone: [{ required: true, message: '用户电话不能为空', trigger: 'change' }]
      },
      roles: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.listLoading = true
      fetchUserList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getUserList()
    },
    sortChange(data) {
      const { prop, order } = data
      this.listQuery.sort = prop

      if (order === 'ascending' || order === null) {
        this.listQuery.rank = 'ASC'
      } else {
        this.listQuery.rank = 'DESC'
      }

      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        title: '',
        phone: '',
        roleIds: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true

      if (this.roles.length === 0) {
        // get selectable roles
        this.formLoading = true
        fetchRoles().then(response => {
          this.roles = response.data

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
          createUser(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '添加用户成功',
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

      getUserWithRoles(row.id).then(response => {
        this.temp.id = response.data.id
        this.temp.name = response.data.name
        this.temp.title = response.data.title
        this.temp.phone = response.data.phone
        this.temp.roleIds = response.data.roles.map(role => role.id)
      })

      if (this.roles.length === 0) {
        // get selectable roles
        this.formLoading = true
        fetchRoles().then(response => {
          this.roles = response.data

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
          updateUser(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '修改用户成功',
              type: 'success',
              duration: 5000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteUser(row.id).then(response => {
        this.$notify({
          title: 'Success',
          message: '删除用户成功',
          type: 'success',
          duration: 5000
        })
        this.getUserList()
      })
    }
  }
}
</script>
