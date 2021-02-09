<template>
  <div class="search-box">
    <div class="search-item">
      <van-search
        v-model="searchForm.orderId"
        show-action
        clearable
        placeholder="请输入物流运单号"
        @search="onSearch"
      >
        <template slot="action">
          <van-button size="small" type="primary" @click="onSearch"
            >搜索</van-button
          >
        </template>
      </van-search>
    </div>
    <van-popup
      v-model="showPopover"
      @close="colsePop"
      round
      closeable
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-steps direction="vertical" :active="current">
        <van-step v-for="sta in statusList" :key="sta.title">
          <h3>{{ sta.title }}</h3>
          <p>{{ sta.time }}</p>
        </van-step>
      </van-steps>
    </van-popup>
  </div>
</template>

<script>
import { getOrder } from "@/api/order";
import Vue from "vue";
import { Search, Popup, Button, Step, Steps, Toast } from "vant";
Vue.use(Search);
Vue.use(Popup);
Vue.use(Button);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Toast);
export default {
  name: "Search",
  components: {
    Search,
    Popup,
    Button,
    Step,
    Steps,
    Toast,
  },
  filters: {},
  data() {
    return {
      showPopover: false,
      current: 0,
      statusList: [],
      searchForm: {
        orderId: "",
        page: 1,
      },
    };
  },
  methods: {
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
    onSearch() {
      if (this.searchForm.orderId == "") {
        Toast.fail("请输入订单号");
        return false;
      }
      getOrder(this.searchForm).then((res) => {
        console.log(res);
        const orderList = res.data.orderList;
        if (orderList.length > 0) {
          if (orderList[0].status == 0) {
            let obj = {};
            obj.title =
              "【" +
              orderList[0].frequencyInfo[0].startCity +
              "】" +
              "　" +
              "待取货";
            obj.time = this.dateFilter(orderList[0].add_time);
            this.statusList.push(obj);
          } else if (orderList[0].status == 1) {
            let obj = {};
            obj.title =
              "【" +
              orderList[0].frequencyInfo[0].startCity +
              "】" +
              "　" +
              "待取货";
            obj.time = this.dateFilter(orderList[0].add_time);
            this.statusList.push(obj);

            obj = {};
            obj.title =
              "【" +
              orderList[0].frequencyInfo[0].startCity +
              "】" +
              "　" +
              "已取货";
            obj.time = orderList[0].obtain_time;
            this.statusList.push(obj);
          } else if (orderList[0].status == 2) {
            let obj = {};
            obj.title =
              "【" +
              orderList[0].frequencyInfo[0].startCity +
              "】" +
              "　" +
              "待取货";
            obj.time = this.dateFilter(orderList[0].add_time);
            this.statusList.push(obj);

            obj = {};
            obj.title =
              "【" +
              orderList[0].frequencyInfo[0].startCity +
              "】" +
              "　" +
              "已取货";
            obj.time = orderList[0].obtain_time;
            this.statusList.push(obj);

            obj = {};
            obj.title =
              "【" +
              orderList[0].frequencyInfo[0].startCity +
              "】" +
              "　" +
              "已发出";
            obj.time = orderList[0].track[0].startTime;
            this.statusList.push(obj);

            obj = {};
            obj.title =
              "【" + orderList[0].track[0].curPost + "】" + "　" + "当前位置";
            obj.time = this.dateFilter(orderList[0].track[0].last_time);
            this.statusList.push(obj);

            obj = {};
            obj.title =
              "【" + orderList[0].track[0].curPost + "】" + "　" + "预计送达";
            obj.time = orderList[0].track[0].endTime;
            this.statusList.push(obj);
          } else if (orderList[0].status == 3) {
            let obj = {};
            obj.title =
              "【" +
              orderList[0].frequencyInfo[0].startCity +
              "】" +
              "　" +
              "待取货";
            obj.time = this.dateFilter(orderList[0].add_time);
            this.statusList.push(obj);
            obj = {};
            obj.title =
              "【" +
              orderList[0].frequencyInfo[0].startCity +
              "】" +
              "　" +
              "已取货";
            obj.time = orderList[0].obtain_time;
            this.statusList.push(obj);

            obj = {};
            obj.title =
              "【" +
              orderList[0].frequencyInfo[0].startCity +
              "】" +
              "　" +
              "已发出";
            obj.time = orderList[0].track[0].startTime;
            this.statusList.push(obj);

            obj = {};
            obj.title =
              "【" +
              orderList[0].frequencyInfo[0].endCity +
              "】" +
              "　" +
              "已签收";
            obj.time = this.dateFilter(orderList[0].track[0].last_time);
            this.statusList.push(obj);
          }
          this.showPopover = true;
        } else {
          Toast.fail("暂无该订单信息");
        }
        this.current = this.statusList.length - 1;
      });
    },
    colsePop() {
      this.statusList = [];
    },
  },
};
</script>
<style lang='scss' scoped>
.search-box {
  position: relative;
  height: 100vh;
  // display: flex;
  // flex-direction: row;
  // align-content: center;
  // justify-content: center;
  .search-item {
    position: relative;
    width: 80%;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    // .van-search__action {
    //   background-color: #b6b6b6;
    // }
  }
  .van-step--vertical {
    padding: 0;
  }
}
</style>