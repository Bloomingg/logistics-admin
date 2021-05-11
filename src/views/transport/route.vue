<template>
  <div>
    <!-- 条件查询 -->
    <el-card shadow="always">
      <el-form :model="searchForm" inline>
        <el-row>
          <el-col :span="8">
            <el-form-item label="出发城市">
              <el-input
                v-model="searchForm.startCity"
                size="small"
                placeholder="请输入出发城市名称"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="终点城市">
              <el-input
                v-model="searchForm.endCity"
                size="small"
                placeholder="请输入终点城市名称"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-button
              @click="search"
              size="small"
              type="primary"
              icon="el-icon-search"
              >查询</el-button
            >
          </el-col>
          <el-col :span="2">
            <el-button @click="resetForm" size="small" type="primary"
              >重置</el-button
            >
          </el-col>
          <el-col :span="4">
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

    <!-- 已有线路表格 -->
    <el-card shadow="always">
      <el-table size="small" :data="routeData" style="width: 100%">
        <el-table-column prop="startCity" label="出发城市" min-width="180" />
        <el-table-column prop="endCity" label="终点城市" min-width="180" />
        <el-table-column prop="passCity" label="途经城市" min-width="180">
          <template slot-scope="scope">
            {{ scope.row.passCity | arrGet }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" min-width="80">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="edit(scope.row)"
            ></el-button>
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
        layout="prev, pager, next,total"
        @current-change="currentChange"
        :total="pageList.total"
      >
      </el-pagination>
    </el-card>

    <!-- 新增或编辑 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="closForm"
    >
      <el-form :model="changeForm" inline size="small">
        <el-form-item label="出发城市：">
          <el-input
            v-model="changeForm.startCity"
            placeholder="请输入出发城市名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="终点城市：">
          <el-input
            v-model="changeForm.endCity"
            placeholder="请输入终点城市名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="途经城市：">
          <el-tag
            :key="tag"
            v-for="tag in changeForm.passCity"
            closable
            size="mini"
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="mini"
            @click="showInput"
            >+ New Tag</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmChangeRoute">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllRoute,
  addRoute,
  updateRoute,
  deleteRoute,
} from "@/api/transport";
export default {
  name: "Route",
  filters: {
    //过滤器，将途经城市数组转为字符串
    arrGet(arr) {
      // console.log(arr);
      let result = arr.toString();
      // let result = arr + "";
      return result;
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      inputVisible: false,
      inputValue: "",
      title: "",
      dynamicTags: ["标签一", "标签二"],
      routeData: [],
      searchForm: {
        startCity: "",
        endCity: "",
        page: 1,
        size: 10,
      },
      changeForm: {
        startCity: "",
        endCity: "",
        passCity: [],
      },
      pageList: {
        total: 0,
      },
    };
  },
  methods: {
    //确认新增或编辑线路
    confirmChangeRoute() {
      if (this.title == "新增") {
        addRoute(this.changeForm).then((res) => {
          console.log(res);
          this.$message.success(res.msg);
          this.getRoute();
          this.dialogFormVisible = false;
        });
      } else {
        updateRoute(this.changeForm).then((res) => {
          console.log(res);
          this.$message.success(res.msg);
          this.getRoute();
          this.dialogFormVisible = false;
        });
      }
    },
    // 关闭编辑弹窗并重置form
    closForm() {
      this.changeForm = {
        startCity: "",
        endCity: "",
        passCity: [],
      };
    },
    // 获取列表
    getRoute() {
      getAllRoute(this.searchForm).then((res) => {
        console.log(res);
        this.routeData = res.data.routeList;
        this.pageList.total = res.data.total;
      });
    },
    //分页
    currentChange(val) {
      console.log(val);
      this.searchForm.page = val;
      this.getRoute();
    },
    //删除tag
    handleClose(tag) {
      this.changeForm.passCity.splice(this.changeForm.passCity.indexOf(tag), 1);
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
      if (this.changeForm.passCity.indexOf(inputValue) != -1) {
        this.$message("途经城市不能重复！");
      } else {
        if (inputValue) {
          this.changeForm.passCity.push(inputValue);
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
    edit(row) {
      this.title = "编辑";
      // this.changeForm = row;
      this.changeForm = Object.assign({}, row);
      this.dialogFormVisible = true;
    },
    //删除
    del(id) {
      deleteRoute({ _id: id }).then((res) => {
        console.log(res);
        this.$message(res.msg);
        this.getRoute();
      });
    },
    //查询
    search() {
      this.getRoute();
    },
    resetForm() {
      this.searchForm.startCity = "";
      this.searchForm.endCity = "";
      this.getRoute();
    },
  },
  mounted() {
    this.getRoute();
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