<template>
  <div>
    <el-card shadow="always">
      <el-form :model="searchForm" inline>
        <el-row>
          <el-col :span="6">
            <el-form-item label="出发城市">
              <el-input
                v-model="searchForm.startCity"
                size="small"
                placeholder="请输入出发城市名称"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="到达城市">
              <el-input
                v-model="searchForm.endCity"
                size="small"
                placeholder="请输入到达城市名称"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="物流班次">
              <el-input
                v-model="searchForm.transNo"
                size="small"
                placeholder="请输入物流班次"
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
          <el-col :span="2">
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

    <el-card shadow="always">
      <el-table size="small" :data="freqData" style="width: 100%">
        <el-table-column prop="startCity" label="出发城市" min-width="180" />
        <el-table-column prop="endCity" label="到达城市" min-width="180" />
        <el-table-column prop="transNo" label="物流班次" min-width="180" />
        <el-table-column prop="treTime" label="预计时间" min-width="180" />
        <el-table-column prop="address" label="操作" min-width="80">
          <template scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="edit(scope.row)"
              circle
            ></el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="del(scope.row._id)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

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
      width="400px"
    >
      <el-form :model="changeForm" inline size="small" label-width="80">
        <el-form-item label="运输线路：">
          <el-select
            v-model="value"
            placeholder="请选择"
            @change="selectChange"
          >
            <el-option
              v-for="item in routeOptions"
              :key="item.startCity"
              :label="item.label"
              :value="item.startCity + '+' + item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="到达城市：">
          <el-select v-model="changeForm.endCity" placeholder="请选择">
            <el-option
              v-for="item in acessOptions"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流班次：">
          <el-input
            v-model="changeForm.transNo"
            placeholder="请输入物流班次号"
          ></el-input>
        </el-form-item>
        <el-form-item label="预计时间：">
          <el-input
            v-model="changeForm.treTime"
            placeholder="请输入预计时间"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmChangeFrequency"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllFrequency,
  addFrequency,
  updateFrequency,
  deleteFrequency,
  getAllRoute,
} from "@/api/transport";
export default {
  name: "Frequency",
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
      value: "",
      acessValue: "",
      dialogFormVisible: false,
      inputVisible: false,
      inputValue: "",
      title: "",
      freqData: [],
      routeOptions: [],
      acessOptions: [],
      searchForm: {
        startCity: "",
        endCity: "",
        transNo: "",
        page: 1,
        size: 10,
      },
      changeForm: {
        startCity: "",
        endCity: "",
        transNo: "",
        treTime: "",
        routeId: "",
      },
      pageList: {
        total: 0,
      },
    };
  },
  methods: {
    selectChange(val) {
      this.acessOptions = [];
      console.log(val);
      const tmparr = val.split("+");
      // console.log(tmparr);
      this.changeForm.startCity = tmparr[0];
      const selectArr = this.routeOptions.filter((current) => {
        if (current.label == tmparr[1]) return current;
      });
      this.changeForm.routeId = selectArr[0]._id;
      let selectArr2 = selectArr[0].passCity;
      if (!selectArr2.includes(selectArr[0].endCity)) {
        selectArr2.push(selectArr[0].endCity);
      }
      // console.log(selectArr2);
      for (let i = 0; i < selectArr2.length; i++) {
        const obj = {
          label: selectArr2[i],
          value: selectArr2[i],
          index: Math.random(), //防止渲染出错
        };
        this.acessOptions.push(obj);
      }
      console.log(this.acessOptions);
    },
    //确认新增或编辑线路
    confirmChangeFrequency() {
      // console.log(this.changeForm);
      if (this.title == "新增") {
        addFrequency(this.changeForm).then((res) => {
          console.log(res);
          this.$message.success(res.msg);
        });
      } else {
        updateFrequency(this.changeForm).then((res) => {
          console.log(res);
          this.$message.success(res.msg);
        });
      }
      this.getFrequency();
      this.dialogFormVisible = false;
    },
    // 关闭编辑弹窗并重置form
    closForm() {
      this.changeForm = {
        startCity: "",
        endCity: "",
        transNo: "",
        treTime: "",
        routeId: "",
      };
      // this.routeOptions = [];
      this.value = "";
      this.acessOptions = [];
    },
    // 获取列表
    getFrequency() {
      getAllFrequency(this.searchForm).then((res) => {
        console.log(res);
        this.freqData = res.data.freqList;
        this.pageList.total = res.data.total;
      });
    },
    getRoute() {
      const reqData = {
        page: 1,
        size: 99999,
      };
      getAllRoute(reqData).then((res) => {
        console.log(res);
        this.routeOptions = res.data.routeList.map((current) => {
          current.label = current.startCity + "--" + current.endCity;
          return current;
        });
      });
    },
    //分页
    currentChange(val) {
      console.log(val);
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
    edit(row) {
      // console.log(row);
      this.title = "编辑";
      this.changeForm = Object.assign({}, row);
      const item = this.routeOptions.find((route) => {
        // console.log(route);
        return route._id == row.routeId;
      });
      // console.log(item);
      this.value = item.startCity + "--" + item.endCity;
      let tmpArr = item.passCity;
      if (!tmpArr.includes(item.endCity)) {
        tmpArr.push(item.endCity);
      }
      for (let i = 0; i < tmpArr.length; i++) {
        const obj = {
          label: tmpArr[i],
          value: tmpArr[i],
          index: Math.random(), //防止渲染出错
        };
        this.acessOptions.push(obj);
      }
      console.log(this.acessOptions);
      this.dialogFormVisible = true;
    },
    //删除
    del(id) {
      deleteFrequency({ _id: id }).then((res) => {
        console.log(res);
        this.$message(res.msg);
        this.getFrequency();
      });
    },
    //查询
    search() {
      this.getFrequency();
    },
    resetForm() {
      this.searchForm.startCity = "";
      this.searchForm.endCity = "";
      this.searchForm.transNo = "";
      this.getFrequency();
    },
  },
  mounted() {
    this.getFrequency();
    this.getRoute();
  },
};
</script>
</script>
<style lang='scss' scoped>
</style>