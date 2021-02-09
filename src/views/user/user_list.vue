<template>
  <div>
    <!-- 条件查询 -->
    <el-card shadow="always">
      <el-form :model="searchForm" inline>
        <el-row>
          <!-- <el-col :span="9">
            <el-form-item label="物流班次">
              <el-input
                v-model="searchForm.startCity"
                size="small"
                placeholder="请输入物流班次"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="9">
            <el-form-item label="订单号">
              <el-input
                v-model="searchForm.endCity"
                size="small"
                placeholder="请输入订单号"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="3">
            <el-button
              @click="search"
              size="small"
              type="primary"
              icon="el-icon-search"
              >查询</el-button
            >
          </el-col> -->
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

    <!-- 用户列表 -->
    <el-card shadow="always">
      <el-table size="small" :data="userData" style="width: 100%">
        <el-table-column prop="_id" label="用户ID" min-width="180" />
        <el-table-column prop="username" label="用户帐名" min-width="120" />
        <el-table-column prop="role" label="用户角色" min-width="120">
          <template scope="scope">
            <el-popover placement="right" width="300" trigger="click">
              <div class="access-box">
                <el-select
                  @change="roleSelect(scope.row)"
                  class="access-option"
                  v-model="scope.row.role_id"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in roleData"
                    :key="item._id"
                    :label="item.title"
                    :value="item._id"
                  >
                  </el-option>
                </el-select>
                <!-- <el-button size="small" type="info" @click="submitRole"
                  >保存</el-button
                > -->
              </div>
              <el-tag slot="reference" size="mini">{{ scope.row.role }}</el-tag>
              <!-- <el-button
                size="small"
                type="info"
                icon="el-icon-edit"
                circle
                slot="reference"
                @click="edit(scope.row._id)"
              ></el-button> -->
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="add_time" label="注册时间" min-width="120">
          <template scope="scope">
            {{ scope.row.add_time | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="last_time" label="最近登录时间" min-width="180">
          <template scope="scope">
            {{ scope.row.last_time | dateFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="账号状态" min-width="80">
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
        </el-table-column>
        <el-table-column prop="status" label="操作" min-width="80">
          <template slot-scope="scope">
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

    <!-- 新增 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="changeForm" inline size="small">
        <el-form-item label="用户名">
          <el-input
            v-model="changeForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="changeForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="changeForm.role_id" placeholder="请选择">
            <el-option
              v-for="item in roleData"
              :key="item._id"
              :label="item.title"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            style="display: block"
            v-model="changeForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="禁用"
            :active-value="activeValue"
            :inactive-value="inactiveValue"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  updateStatus,
  getRoles,
  addUser,
  deleteUser,
} from "@/api/user";

export default {
  name: "UserList",
  filters: {
    //过滤器，将途经城市数组转为字符串
    arrGet(arr) {
      // console.log(arr);
      let result = arr.toString();
      // let result = arr + "";
      return result;
    },
    /**
     * 时间过滤器
     */
    dateFilter(val) {
      var date = new Date(val);
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
      dialogFormVisible: false,
      inputVisible: false,
      activeValue: 1,
      inactiveValue: 0,
      inputValue: "",
      title: "",
      supperId: "",
      userData: [],
      roleData: [],
      searchForm: {
        username: "",
        page: 1,
      },
      changeForm: {},
      pageList: {
        total: 0,
        current: 1,
      },
      roleOptions: [
        {
          label: "超级管理员",
          value: 0,
        },
        {
          label: "系统管理员",
          value: 1,
        },
      ],
    };
  },
  methods: {
    // 提交新增
    submitAdd() {
      addUser(this.changeForm).then((res) => {
        console.log(res);
        this.$message.success(res.msg);
        this.getUserList();
        this.dialogFormVisible = false;
      });
    },
    // 选择角色
    roleSelect(row) {
      console.log(row);
      if (row.role_id == this.supperId) {
        row.is_Supper = 1;
      } else {
        row.is_Supper = 0;
      }
      updateStatus(row).then((res) => {
        console.log(res);
        this.$message(res.msg);
        this.getUserList();
      });
    },
    // submitRole() {},
    // 账户状态控制
    statusChange(row) {
      updateStatus(row).then((res) => {
        console.log(res);
        this.$message(res.msg);
        this.getUserList();
      });
    },
    // 获取角色列表
    getRole() {
      getRoles({ page: 1, size: 999 }).then((res) => {
        console.log(res);
        this.roleData = res.data.roleList;
        this.roleData.forEach((cur) => {
          if (cur.title == "超级管理员") this.supperId = cur._id;
        });
        this.getUserList();
      });
    },
    // 获取用户列表
    getUserList() {
      getUserList(this.searchForm).then((res) => {
        console.log(res);
        const tmpData = res.data.userList;
        tmpData.forEach((cur) => {
          if (cur.role_id != "" && cur.role_id != undefined) {
            this.roleData.forEach((curr) => {
              if (curr._id == cur.role_id) cur.role = curr.title;
            });
          } else {
            cur.role = "暂无";
          }
        });
        this.userData = tmpData;
        console.log(this.userData);
        this.pageList.total = res.data.total;
        this.pageList.current = res.data.page;
      });
    },
    //分页
    currentChange(val) {
      console.log(val);
    },
    //删除tag
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    //新增tag
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //确定新增
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (this.dynamicTags.indexOf(inputValue) != -1) {
        this.$message("途经城市不能重复！");
      } else {
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //新增
    add() {
      this.title = "新增";
      this.dialogFormVisible = true;
    },
    //编辑
    edit(id) {
      this.title = "编辑";
      this.dialogFormVisible = true;
    },
    //删除
    del(id) {
      deleteUser(id).then((res) => {
        this.$message.success(res.msg);
        this.getUserList();
      });
    },
    //查询
    search() {},
  },
  beforeMount() {
    this.getRole();
  },
};
</script>
<style lang='scss' scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>