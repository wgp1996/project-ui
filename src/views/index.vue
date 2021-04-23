<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="padding: 16px 16px 0; margin-bottom: 32px">
      <el-col :xs="24" :sm="24" :lg="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-badge :value="menuNum" class="item">
              <el-button size="small">待办审核</el-button>
            </el-badge>
            <!-- <el-button style="float: right; padding: 3px 0" type="text"
              >操作按钮</el-button
            > -->
          </div>
          <div v-for="item in menuList" :key="item" class="text item">
            <div
              style="width: 33%; float: left; padding: 13px; text-align: center"
            >
              <el-badge :value="item.taskNum">
                <el-button
                  class="share-button"
                  icon="el-icon-menu"
                  type="primary"
                  style="padding: 20px 20px !important"
                  @click="openUrl(item)"
                  >{{ item.taskName }}</el-button
                >
              </el-badge>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-badge :value="taskNum" class="item">
              <el-button size="small">待办任务</el-button>
            </el-badge>
            <!-- <el-button style="float: right; padding: 3px 0" type="text"
              >操作按钮</el-button> -->
          </div>
          <div
            v-for="item in taskInfoList"
            :key="item"
            class="text item"
            @click="openTaskUrl"
          >
            <div
              style="
                width: 20%;
                float: left;
                padding: 10px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              {{ item.taskName }}
            </div>
            <div
              style="
                width: 20%;
                float: left;
                padding: 10px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              {{ item.projectName }}
            </div>
            <div
              style="
                width: 32%;
                float: left;
                padding: 10px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              <el-progress :percentage="item.taskNum"></el-progress>
            </div>
            <div
              style="
                width: 13%;
                float: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 5px 0px 10px 0px;
                text-align: center;
              "
            >
              <el-tag>{{ item.statusName }}</el-tag>
            </div>
            <div
              style="
                width: 15%;
                float: left;
                padding: 10px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
              "
            >
              {{ item.taskEndTime }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col> -->
    </el-row>
    <!-- <iframe v-clickoutside="handleClose" :src="frameSrc" id="mobsf" v-show="showMessage" scrolling="no" frameborder="0" style="position:fixed;right:0px;bottom:0px;width:330px;height:550px"></iframe>
    <div v-show="showStatus" @click="changeStatus()" style="position:fixed;right:0px;bottom:0px;width:150px;height:50px;line-height: 55px;background: antiquewhite;border-radius: 5px;"><img src="../assets/logo/logo.png" style="float: left;height: 100%;">我的聊天</div> -->
  </div>
</template>

<script>
import { sendAllList, selectShMenuList } from "@/api/system/taskInfo";
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import RaddarChart from "./dashboard/RaddarChart";
import PieChart from "./dashboard/PieChart";
import BarChart from "./dashboard/BarChart";
import Clickoutside from "element-ui/src/utils/clickoutside";
import { getInfo } from "@/api/login";
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};

export default {
  directives: { Clickoutside },
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      taskNum: 0,
      menuNum: "",
      taskInfoList: [],
      menuList: [],
      user: {},
      frameSrc: "",
      lineChartData: lineChartData.newVisitis,
      showMessage: false,
      showStatus: true,
      queryParams: {},
    };
  },
  created() {
    this.getSendList();
    // getInfo().then(response => {
    //     //this.user=response.user;
    //      this.frameSrc="http://localhost:8080/login?username="+response.user.userName+'&password=123'
    // });
  },
  methods: {
    getSendList() {
      sendAllList(this.queryParams).then((response) => {
        this.taskInfoList = response.rows;
        this.taskNum = response.total;
      });
      selectShMenuList().then((response) => {
        this.menuList = response.rows;
        let menuNum = 0;
        for (let i = 0; i < this.menuList.length; i++) {
          menuNum += parseInt(this.menuList[i].taskNum);
        }
        this.menuNum = menuNum;
      });
    },
    openTaskUrl() {
      // this.$router.push({ path: "/project/mission" });
    },
    openUrl(item) {
      //采购订单
      if (item.taskCode == "CGDD") {
        this.$router.push({ path: "/examine/purchaseOrderSh" });
      }
      //入库单
      if (item.taskCode == "RKD") {
        this.$router.push({ path: "/examine/purchaseWareSh" });
      }
      //采购结算
      if (item.taskCode == "CGJS") {
        this.$router.push({ path: "/examine/purchaseSettlementSh" });
      }
      //领料出库
      if (item.taskCode == "LLCK") {
        this.$router.push({ path: "/examine/pickingDeliverySh" });
      }
      //借用归还
      if (item.taskCode == "JYGH") {
        this.$router.push({ path: "/examine/pickingReturnSh" });
      }
      //分包合同
      if (item.taskCode == "FBHT") {
        this.$router.push({ path: "/examine/projectContractSh" });
      }
      //总包包合同
      if (item.taskCode == "ZBHT") {
        this.$router.push({ path: "/examine/contractGeneralSh" });
      }
      //立项申请单
      if (item.taskCode == "LXSQ") {
        this.$router.push({ path: "/examine/applySh" });
      }
      //产值提报单
      if (item.taskCode == "CZTB") {
        this.$router.push({ path: "/examine/projectReport" });
      }
      //产值提报单
      if (item.taskCode == "FYBX") {
        this.$router.push({ path: "/examine/feeApplyInfoSh" });
      }
    },
    changeStatus(data) {
      this.showMessage = true;
      this.showStatus = false;
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
    handleClose() {
      //this.frameSrc="http://localhost:8080/login";
      console.log(this.frameSrc);
      this.showMessage = false;
      this.showStatus = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
.text {
  font-size: 14px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 98%;
  height: 560px;
  overflow: auto;
}
</style>
