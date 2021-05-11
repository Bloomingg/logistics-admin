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
      <el-table size="small" :data="trackData" style="width: 100%">
        <el-table-column prop="transNo" label="物流班次" min-width="180">
          <template slot-scope="scope">
            {{ scope.row.frequencyInfo[0].transNo }}
          </template>
        </el-table-column>
        <el-table-column prop="startCity" label="出发城市" min-width="180">
          <template slot-scope="scope">
            {{ scope.row.frequencyInfo[0].startCity }}
          </template>
        </el-table-column>
        <el-table-column prop="endCity" label="到达城市" min-width="180">
          <template slot-scope="scope">
            {{ scope.row.frequencyInfo[0].endCity }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="出发时间" min-width="180" />
        <el-table-column prop="endTime" label="预计到达时间" min-width="180" />
        <el-table-column prop="curPost" label="当前位置" min-width="180" />
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
      width="500px"
    >
      <el-form :model="changeForm" inline size="small" label-width="80">
        <el-form-item label="物流班次：">
          <el-select v-model="changeForm.frequencyId" placeholder="请选择">
            <el-option
              v-for="item in freqList"
              :key="item._id"
              :label="item.transNo"
              :value="item._id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="出发时间：">
          <el-input
            v-model="changeForm.statrTime"
            placeholder="请输入预计时间"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="预计行程：">
          <el-date-picker
            @change="dateSelect"
            v-model="dateValue"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="当前位置：">
          <el-input
            v-model="changeForm.curPost"
            placeholder="请输入当前位置"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmChangeTrack">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllFrequency } from "@/api/transport";
import {
  getAllTrack,
  addTrack,
  updateTrack,
  deleteTrack,
} from "@/api/transport";
export default {
  name: "LogisticsTrack",
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
      dateValue: "",
      inputValue: "",
      title: "",
      freqList: [],
      dynamicTags: ["标签一", "标签二"],
      trackData: [],
      searchForm: {
        startCity: "",
        endCity: "",
        transNo: "",
        page: 1,
        size: 10,
      },
      changeForm: {
        frequencyId: "",
        startTime: "",
        endTime: "",
        curPost: "",
      },
      pageList: {
        total: 0,
      },
    };
  },
  methods: {
    // 获取班次列表
    getFeq() {
      getAllFrequency({ page: 1, size: 1000 }).then((res) => {
        console.log(res);
        this.freqList = res.data.freqList;
      });
    },
    // 选择时间
    dateSelect(val) {
      console.log(val);
      if (val != null) {
        this.changeForm.startTime = val[0];
        this.changeForm.endTime = val[1];
      } else {
        this.changeForm.startTime = "";
        this.changeForm.endTime = "";
      }
    },
    //确认新增或编辑线路
    confirmChangeTrack() {
      if (this.title == "新增") {
        addTrack(this.changeForm).then((res) => {
          console.log(res);
          this.getTrack();
          this.$message.success(res.msg);
          this.dialogFormVisible = false;
        });
      } else {
        updateTrack(this.changeForm).then((res) => {
          console.log(res);
          this.getTrack();
          this.$message.success(res.msg);
          this.dialogFormVisible = false;
        });
      }
      // this.getTrack();
      // this.dialogFormVisible = false;
    },
    // 关闭编辑弹窗并重置form
    closForm() {
      this.changeForm = {
        transNo: "",
        startTime: "",
        endTime: "",
        curPost: "",
      };
      this.dateValue = "";
    },
    // 获取跟踪列表
    getTrack() {
      getAllTrack(this.searchForm).then((res) => {
        console.log(res);
        this.trackData = res.data.trackList;
        this.pageList.total = res.data.total;
      });
    },
    //分页
    currentChange(val) {
      console.log(val);
      this.searchForm.page = val;
      this.getTrack();
    },
    //新增
    add() {
      this.title = "新增";
      this.dialogFormVisible = true;
    },
    //编辑
    edit(row) {
      this.title = "编辑";
      this.changeForm = Object.assign({}, row);
      this.dateValue = [row.startTime, row.endTime];
      // console.log(this.dateValue);
      this.dialogFormVisible = true;
    },
    //删除
    del(id) {
      deleteTrack({ _id: id }).then((res) => {
        console.log(res);
        this.$message(res.msg);
        this.getTrack();
      });
    },
    //查询
    search() {
      this.getTrack();
    },
    resetForm() {
      this.searchForm.startCity = "";
      this.searchForm.endCity = "";
      this.getTrack();
    },
  },
  mounted() {
    this.getFeq();
    this.getTrack();
  },
};
</script>
<style lang='scss' scoped>
.el-date-editor--datetimerange.el-input__inner {
  width: 350px;
}
</style>