<template>
  <div>
    <!-- 条件查询 -->
    <el-card shadow="always">
      <el-form :model="searchForm" inline>
        <el-row>
          <el-col :offset="22" :span="2">
            <el-button
              @click="add"
              size="small"
              type="primary"
              icon="el-icon-plus"
              >新增</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 角色列表 -->
    <el-card shadow="always">
      <el-table size="small" :data="roleData" style="width: 100%">
        <el-table-column prop="title" label="角色名称" min-width="180" />
        <el-table-column prop="description" label="角色描述" min-width="120" />
        <el-table-column prop="add_time" label="添加时间" min-width="120">
          <template scope="scope">
            {{ scope.row.add_time | dateFilter }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="status" label="操作" min-width="80">
          <template slot-scope="scope">
            <el-switch
              @change="statusChange(scope.row)"
              style="display: block"
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用"
              :active-value="activeValue"
              :inactive-value="inactiveValue"
            >
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column prop="status" label="操作" min-width="80">
          <template slot-scope="scope" v-if="scope.row.title != '超级管理员'">
            <el-popover
              @hide="hideChange"
              placement="right"
              width="300"
              trigger="click"
            >
              <div class="access-box">
                <el-select
                  class="access-option"
                  v-model="accessArr"
                  multiple
                  placeholder="请选择"
                >
                  <el-option
                    @change="accessSelect"
                    v-for="item in accessOptions"
                    :key="item._id"
                    :label="item.module_name"
                    :value="item._id"
                  >
                  </el-option>
                </el-select>
                <el-button size="small" type="info" @click="submitAccess"
                  >保存</el-button
                >
              </div>

              <el-button
                size="small"
                type="info"
                icon="el-icon-edit"
                circle
                slot="reference"
                @click="edit(scope.row._id)"
              ></el-button>
            </el-popover>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="del(scope.row._id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页 -->
    <el-card shadow="always">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="currentChange"
        :total="pageList.total"
        :current-page="pageList.current"
      >
      </el-pagination>
    </el-card>

    <!-- 新增或编辑 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="380px">
      <el-form
        :model="changeForm"
        inline
        size="small"
        label-width="80px"
        ref="roleForm"
      >
        <el-form-item label="角色名称">
          <el-input
            v-model="changeForm.title"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            type="textarea"
            v-model="changeForm.description"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRole,
  getRoles,
  getAccess,
  deleteRole,
  editRoleAccess,
  addRoleAccess,
  getRoleAccess,
} from "@/api/user";
// import { getInfo } from "@/api/login";
export default {
  name: "Role",
  filters: {
    /**
     * 时间过滤器
     */
    dateFilter(val) {
      var date = new Date(val);
      console.log(new Date());
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
  },
  data() {
    return {
      title: "",
      role_id: "",
      _id: "",
      dialogFormVisible: false,
      addStatus: false,
      roleData: [],
      searchForm: {},
      changeForm: {
        title: "",
        description: "",
      },
      accessOptions: [],
      accessArr: [],
      pageList: {
        page: 1,
        size: 10,
        total: 0,
        current: 1,
      },
    };
  },
  methods: {
    // 权限选择关闭时已选角色列表
    hideChange() {
      this.accessArr = [];
    },
    // 获取权限列表
    getAccesses() {
      getAccess()
        .then((res) => {
          console.log(res);
          this.accessOptions = res.data.accessList;
          console.log(this.accessOptions);
        })
        .catch((err) => this.$message.error(err.msg));
    },
    // 获取角色列表
    getRole() {
      getRoles(this.pageList).then((res) => {
        console.log(res);
        this.roleData = res.data.roleList;
        this.pageList.total = res.data.total;
        this.pageList.current = res.page;
      });
    },
    // 翻页
    currentChange(val) {
      this.pageList.page = val;
      this.getRole();
    },
    accessSelect(val) {
      console.log(val);
    },
    // 新增或修改角色对应权限
    submitAccess() {
      console.log(this.accessArr);
      if (this.accessArr.length == 0) return false;
      const reqData = {
        access_id: this.accessArr,
        role_id: this.role_id,
      };
      if (this.addStatus) {
        addRoleAccess(reqData).then((res) => {
          console.log(res);
          this.$message.success(res.msg);
          this.getRole();
        });
      } else {
        reqData._id = this._id;
        editRoleAccess(reqData).then((res) => {
          console.log(res);
          this.$message.success(res.msg);
          this.getRole();
        });
      }
    },
    add() {
      this.dialogFormVisible = true;
    },
    // 编辑角色 获取选择数据
    edit(id) {
      this.role_id = id;
      getRoleAccess(id).then((res) => {
        console.log(res);
        if (res.data.RoleAccessList.length == 0) {
          this.addStatus = true;
        } else {
          this.accessArr = res.data.RoleAccessList[0].access_id;
          this._id = res.data.RoleAccessList[0]._id;
          this.addStatus = false;
        }
      });
    },
    // 删除角色
    del(id) {
      deleteRole(id)
        .then((res) => {
          this.$message.success(res.msg);
          this.getRole();
        })
        .catch((err) => {
          this.$message.error(res.msg);
          this.getRole();
        });
    },
    // 确定编辑
    comfirmEdit() {
      if (this.changeForm.title == "") return false;
      addRole(this.changeForm).then((res) => {
        console.log(res);
        this.$message.success(res.msg);
        this.resetForm("roleForm");
        this.getRole();
        this.dialogFormVisible = false;
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  mounted() {
    // getInfo().then((res) => console.log(res));
    this.getRole();
    this.getAccesses();
  },
};
</script>
<style lang='scss' scoped>
.access-box {
  display: flex;
  justify-content: space-between;
  .access-option {
    width: 98%;
    // .el-input__inner {
    //   // width: 100%;
    // }
  }
}
</style>