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
          </el-col> -->

          <el-col :span="16">
            <el-form-item label="订单号">
              <el-input
                v-model="searchForm.orderId"
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
          </el-col>
          <el-col :span="2">
            <el-button @click="resetForm" size="small" type="primary"
              >重置</el-button
            >
          </el-col>
          <el-col :span="3">
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
      <el-table size="small" :data="orderData" style="width: 100%">
        <el-table-column prop="_id" label="订单号" min-width="180" />
        <el-table-column prop="frequencyInfo" label="物流班次" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.frequencyInfo[0].transNo }}
          </template>
        </el-table-column>
        <el-table-column prop="frequencyInfo" label="出发城市" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.frequencyInfo[0].startCity }}
          </template>
        </el-table-column>
        <el-table-column prop="frequencyInfo" label="到达城市" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.frequencyInfo[0].endCity }}
          </template>
        </el-table-column>
        <el-table-column prop="obtain_time" label="取件时间" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.obtain_time | isNull }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.status | setStatus }}
          </template>
        </el-table-column>
        <el-table-column prop="send_time" label="发货时间" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.send_time | isNull }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" min-width="80">
          <template slot-scope="scope">
            {{ scope.row.price | isNull }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" min-width="120">
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
        layout="prev, pager, next"
        @current-change="currentChange"
        :total="pageList.total"
      >
      </el-pagination>
    </el-card>

    <!-- 新增或编辑 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="changeForm" inline size="small" label-width="100px">
        <el-form-item label="班次号：">
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
        <el-form-item label="订单状态：">
          <el-select v-model="changeForm.status" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取件时间：">
          <el-date-picker
            v-model="changeForm.obtain_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发货时间：">
          <el-date-picker
            v-model="changeForm.send_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单金额：">
          <el-input
            v-model="changeForm.price"
            placeholder="请输入订单金额"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrder, addOrder, updateOrder, deleteOrder } from "@/api/order";
import { getAllFrequency } from "@/api/transport";
export default {
  name: "OrderManger",
  filters: {
    //过滤器
    isNull(val) {
      if (val == "" || val == undefined) {
        return "暂无";
      } else {
        return val;
      }
    },
    setStatus(val) {
      console.log(val);
      if (val == 0) {
        return "待取货";
      } else if (val == 1) {
        return "已取货";
      } else if (val == 2) {
        return "已发出";
      } else if (val == 3) {
        return "已签收";
      }
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      inputVisible: false,
      inputValue: "",
      title: "",
      orderData: [],
      searchForm: {
        page: 1,
        size: 10,
        orderId: "",
      },
      freqList: [],
      changeForm: {},
      statusList: [
        {
          label: "待取货",
          value: 0,
        },
        {
          label: "已取货",
          value: 1,
        },
        {
          label: "已发出",
          value: 2,
        },
        {
          label: "已签收",
          value: 3,
        },
      ],
      pageList: {
        total: 0,
        page: 1,
      },
    };
  },
  methods: {
    // 确认新增或修改订单信息
    confirmEdit() {
      if (this.title == "新增") {
        addOrder(this.changeForm).then((res) => {
          console.log(res);
          this.$message(res.msg);
          this.dialogFormVisible = false;
          this.getOrder();
        });
      } else {
        updateOrder(this.changeForm).then((res) => {
          console.log(res);
          this.$message(res.msg);
          this.dialogFormVisible = false;
          this.getOrder();
        });
      }
    },
    // 获取班次列表
    getFeq() {
      getAllFrequency({ page: 1, size: 1000 }).then((res) => {
        console.log(res);
        this.freqList = res.data.freqList;
      });
    },
    // 获取订单
    getOrder() {
      getOrder(this.searchForm).then((res) => {
        console.log(res);
        // res.data.orderList.forEach((order) => {
        //   order.transNo = order.frequencyInfo[0].transNo;
        //   order.startCity = order.frequencyInfo[0].startCity;
        //   order.endCity = order.frequencyInfo[0].endCity;
        // });
        this.orderData = res.data.orderList;
        this.pageList.total = res.data.total;
        this.pageList.page = res.data.page;
        // console.log(this.orderData);
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
    edit(row) {
      this.title = "编辑";
      this.dialogFormVisible = true;
      this.changeForm = Object.assign({}, row);
    },
    //删除
    del(id) {
      deleteOrder(id).then((res) => {
        this.$message(res.msg);
        this.getOrder();
      });
    },
    //查询
    search() {
      this.getOrder();
    },
    resetForm() {
      this.searchForm.orderId = "";
      this.getOrder();
    },
  },
  mounted() {
    this.getFeq();
    this.getOrder();
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