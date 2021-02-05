<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
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
      </el-col>
    </el-row>
    <!-- <iframe v-clickoutside="handleClose" :src="frameSrc" id="mobsf" v-show="showMessage" scrolling="no" frameborder="0" style="position:fixed;right:0px;bottom:0px;width:330px;height:550px"></iframe>
    <div v-show="showStatus" @click="changeStatus()" style="position:fixed;right:0px;bottom:0px;width:150px;height:50px;line-height: 55px;background: antiquewhite;border-radius: 5px;"><img src="../assets/logo/logo.png" style="float: left;height: 100%;">我的聊天</div> -->
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import Clickoutside from "element-ui/src/utils/clickoutside";
import { getInfo } from "@/api/login";
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  directives: { Clickoutside },
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      user:{},
      frameSrc:"",
      lineChartData: lineChartData.newVisitis,
      showMessage:false,
      showStatus:true
    }
  },
  created(){
   
    // getInfo().then(response => {
    //     //this.user=response.user;
    //      this.frameSrc="http://localhost:8080/login?username="+response.user.userName+'&password=123'
    // });
  },
  methods: {
    changeStatus(data){
        this.showMessage=true;
        this.showStatus=false;
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    handleClose() {
       //this.frameSrc="http://localhost:8080/login";
       console.log(this.frameSrc)
       this.showMessage=false;
       this.showStatus=true;
    },
  }
}
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
