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
      <el-table size="small" :data="accessData" style="width: 100%">
        <el-table-column prop="module_name" label="角色名称" min-width="180" />
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

    <!-- 新增或编辑 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="380px">
      <el-form
        :model="changeForm"
        inline
        size="small"
        label-width="80px"
        ref="roleForm"
      >
        <el-form-item label="节点名称">
          <el-input
            v-model="changeForm.module_name"
            placeholder="请输入节点名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="节点类型">
          <el-select v-model="changeForm.type" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点排序">
          <el-input
            v-model="changeForm.sort"
            placeholder="请输入节点排序"
          ></el-input>
        </el-form-item>
        <el-form-item label="节点描述">
          <el-input
            type="textarea"
            v-model="changeForm.description"
            placeholder="请输入节点描述"
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
import { addAccess, getAccess, deleteAccess } from "@/api/user";
export default {
  name: "Access",
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
      dialogFormVisible: false,
      changeForm: {},
      searchForm: {},
      accessData: [],
      typeOptions: [
        {
          label: "模块",
          value: 1,
        },
        {
          label: "菜单",
          value: 2,
        },
        // {
        //   label:"操作",
        //   value:3
        // },
      ],
    };
  },
  methods: {
    // 获取权限列表
    getAccesses() {
      getAccess()
        .then((res) => {
          console.log(res);
          this.accessData = res.data.accessList;
        })
        .catch((err) => this.$message.error(err.msg));
    },
    add() {
      this.dialogFormVisible = true;
    },
    // 确认新增权限
    comfirmEdit() {
      addAccess(this.changeForm)
        .then((res) => {
          console.log(res);
          this.$message.success(res.msg);
          this.dialogFormVisible = false;
          this.getAccesses();
        })
        .catch((err) => {
          this.$message.error(err.msg);
          this.dialogFormVisible = false;
          this.getAccesses();
        });
    },
    // 删除权限
    del(id) {
      deleteAccess(id)
        .then((res) => {
          this.$message.success(res.msg);
          this.getAccesses();
        })
        .catch((err) => {
          this.$message.error(res.msg);
          this.getAccesses();
        });
    },
  },
  mounted() {
    this.getAccesses();
  },
};
</script>
<style lang='scss' scoped>
</style>