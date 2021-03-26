<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="单号" prop="djNumber">
        <el-input
          v-model="queryParams.djNumber"
          placeholder="请输入单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
  <el-form-item label="项目编号" prop="projectCode">
        <el-input
          v-model="queryParams.projectCode"
          placeholder="请输入项目编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-if="showSh"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleEffect"
          v-hasPermi="['system:projectReport:examine']"
          >审核</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="showCancel">
        <el-button
          type="danger"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleCancel"
          v-hasPermi="['system:projectReport:cancelAudit']"
          >取消审核</el-button
        >
      </el-col>
    </el-row>
    <el-tabs type="card" v-model="statusTabs" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="one"></el-tab-pane>
      <el-tab-pane label="已审核" name="two"></el-tab-pane>
    </el-tabs>
    <el-table
      v-loading="loading"
      :data="projectReportList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单号" align="center" prop="djNumber" />
      <el-table-column label="状态" align="center" prop="statusName" />
      <el-table-column label="单据日期" align="center" prop="djTime" />
      <el-table-column label="合同金额" align="center" prop="htMoney" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="标题" align="center" prop="djTitle" />
      <el-table-column label="项目编号" align="center" prop="projectCode" />
      <el-table-column label="开始时间" align="center" prop="startTime" />
      <el-table-column label="结束时间" align="center" prop="endTime" />
      <el-table-column label="申请人" align="center" prop="createBy" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:projectReport:edit']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSelectFlow(scope.row)"
            v-hasPermi="['system:projectReport:edit']"
            >查看审批</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog title="审核流程" :visible.sync="openSh" width="500px">
      <el-tabs type="border-card">
        <el-tab-pane label="最新审批">
            <el-steps :space="100" direction="vertical" :active="stepsActive">
              <el-step
                :status="item.stepStatus"
                :title="
                  item.prName + ' - ' + item.statusName + ' - ' + item.auditTime
                "
                :description="item.auditInfo"
                v-for="(item, index) in stepsData"
                :key="index"
              ></el-step>
            </el-steps>
        </el-tab-pane>
        <el-tab-pane label="历史审批">
              <el-steps :space="100" direction="vertical" :active="stepsHistoryActive">
                <el-step
                  :status="item.stepStatus"
                  :title="
                    item.prName + ' - ' + item.statusName + ' - ' + item.auditTime
                  "
                  :description="item.auditInfo"
                  v-for="(item, index) in stepsDataHistory"
                  :key="index"
                ></el-step>
              </el-steps>
        </el-tab-pane>
      </el-tabs>
 
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="流程审核" :visible.sync="openLcsh" width="500px">
      <el-form ref="shForm" :model="shForm" :rules="rules" label-width="120px">
        <el-form-item label="审核结果" prop="status">
          <el-radio-group v-model="shForm.status">
            <el-radio :label="1">审核通过</el-radio>
            <el-radio :label="2">审核退回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="auditInfo">
          <el-input
            type="textarea"
            :rows="4"
            v-model="shForm.auditInfo"
            placeholder="请输入审核意见,200字以内"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改产值提报对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row :gutter="10" class="mb8">
              <el-col :span="12">
                <!-- <el-form-item label="单号" prop="djNumber">
                                <el-input v-model="form.djNumber" placeholder="请输入单号" />
                </el-form-item>-->
                <el-form-item label="流水号" prop="djNumber">
                  <el-input
                    v-model="form.djNumber"
                    placeholder="自动生成"
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!-- <el-form-item label="状态"> -->
                <!-- <el-input v-model="form.status" placeholder="自动生成" :disabled="true"/>   -->
                <!-- <el-radio-group v-model="form.status">
                                  <el-radio label="1">请选择字典生成</el-radio>
                </el-radio-group>-->
                <!-- </el-form-item> -->
                <el-form-item label="单据日期" prop="djTime">
                  <el-date-picker
                    clearable
                    style="width: 100%"
                    v-model="form.djTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择单据时间"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="合同编号" prop="htDjNumber">
              <el-input
                v-model="form.htDjNumber"
                placeholder="请输入合同编号"
                :disabled="true"
              />
              <el-button
                icon="el-icon-plus"
                type="primary"
                style="position: absolute; right: 0px; top: 0px"
              ></el-button>
            </el-form-item>
            <el-form-item label="标题" prop="djTitle">
              <el-input v-model="form.djTitle" placeholder="请输入标题" />
            </el-form-item>
            <el-row :gutter="10" class="mb8">
              <el-col :span="12">
                <el-form-item label="合同金额" prop="htMoney">
                  <el-input
                    v-model="form.htMoney"
                    placeholder="请输入合同金额"
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目名称" prop="projectName">
                  <el-input
                    v-model="form.projectName"
                    placeholder="请输入项目名称"
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="mb8">
              <el-col :span="12">
                <el-form-item label="开始时间" prop="startTime">
                  <el-input v-model="form.startTime" placeholder :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间" prop="endTime">
                  <el-input v-model="form.endTime" placeholder :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="mb8">
              <el-col :span="12">
                <el-form-item label="天数" prop="dayNum">
                  <el-input v-model="form.dayNum" placeholder :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发票金额" prop="fpMoney">
                  <el-input
                    v-model="form.fpMoney"
                    placeholder="请输入发票金额"
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- <el-form-item label="项目编号" prop="projectCode">
                    <el-input v-model="form.projectCode" placeholder="请输入项目编号" />
            </el-form-item>-->
            <el-row :gutter="10" class="mb8">
              <el-col :span="12">
                <el-form-item label="产值金额" prop="czMoney">
                  <el-input
                    v-model="form.czMoney"
                    placeholder="请输入产值金额"
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="已付金额" prop="yfMoney">
                  <el-input
                    v-model="form.yfMoney"
                    placeholder="请输入已付金额"
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="启用审批" prop="isSp">
              <el-radio-group v-model="form.isSp">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">不启用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="申请人" prop="remark">
              <el-input
                v-model="form.createBy"
                :disabled="true"
                placeholder
              />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="输入备注" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="产值明细" name="second">
          <el-table
            :data="tableData"
            class="tb-edit"
            style="width: 100%"
            highlight-current-row
          >
            <el-table-column
              prop="inventoryName"
              label="分部分项内容"
              width="200"
            >
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.inventoryName"
                  placeholder="分部分项内容"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="inventoryUnit" label="单位" width="120">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.inventoryUnit"
                  :readonly="true"
                  placeholder="请输入单位"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="inventoryNum" label="数量" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.inventoryNum"
                  placeholder="请输入数量"
                     :readonly="true"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="inventoryCheckNum"
              label="复核数量"
              width="120"
            >
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.inventoryCheckNum"
                  placeholder="请输入数量"
                  :readonly="true"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="inventoryPrice" label="单价" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.inventoryPrice"
                  :readonly="true"
                  placeholder="单价信息"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="inventoryMoney" label="金额" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.inventoryMoney"
                  placeholder="金额信息"
                  :readonly="true"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="备注" width="150" prop="remark">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.remark"
                  placeholder="请输入备注"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
           <el-tab-pane label="合同附件" name="two">
          <el-row :gutter="15" class="mb8">
            <el-col :span="1.5">
              <el-upload
                class="upload-demo"
                ref="upload"
                :file-list="fileList"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :on-preview="hadelOpenFile"
                :auto-upload="false"
              >
                <el-button size="small" type="primary" :disabled="true"
                  >选取文件</el-button
                >
                <el-button
                  style="margin-left: 10px"
                  :disabled="true"
                  size="small"
                  type="success"
                  >上传到服务器</el-button
                >
              </el-upload>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
             
  </div>
</template>

<script>
import {
  shListProjectReport,
  getProjectReport,
  examineProjectReport,
  cancelAuditProjectReport,
} from "@/api/system/projectReport";
import {getProjectReportChildList} from "@/api/system/projectReportChild"
import { systemFileList, getProjectInfoByCode } from "@/api/system/projectInfo";
import { djFlowList } from "@/api/system/flowInfo";
export default {
  name: "ProjectReport",
  data() {
    return {
      tableData:[],
      showSh: true, 
      showCancel: false,
      statusTabs: "one",
      stepsActive: 0,
      stepsHistoryActive:0,
      stepsData: [],
      stepsDataHistory:[],
      activeName: "first",
      fileList: [],
      selectProjectDialog: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中数组
      nodeNos: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      personList: [],
      // 产值提报表格数据
      projectReportList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openSh: false,
      openLcsh: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        type: "0",
        pageSize: 10,
        djNumber: undefined,
        status: undefined,
        projectCode: undefined,
        projectName: undefined,
        khName: undefined,
        contractMoney: undefined,
        flowNo: undefined,
        nodeNo: undefined,
      },
      // 表单参数
      form: {},
      shForm: {},
      projectForm: {},
      // 表单校验
      rules: {
        status: [
          { required: true, message: "请选择审核结果!", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleClick(tab, event) {
      //待审核
      if (tab.index == 0) {
        this.queryParams.type = "0";
        this.showCancel = false;
        this.showSh = true;
      }
      //已审核
      if (tab.index == 1) {
        this.queryParams.type = "1";
        this.showCancel = true;
        this.showSh = false;
      }
      this.getList();
    },
    handleSuccess(res, file, fileList) {
      this.fileList = fileList;
      // 上传成功
      console.log(res);
      console.log(fileList);
    },
    hadelOpenFile(file){
        window.open(file.url);
    },
    handleRemove(file, fileList) {
      return
      //this.fileList = fileList;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    /** 查询产值提报列表 */
    getList() {
      this.loading = true;
      shListProjectReport(this.queryParams).then((response) => {
        this.projectReportList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openSh = false;
      this.openLcsh = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        djNumber: undefined,
        status: "0",
        projectCode: undefined,
        projectName: undefined,
        projectJpersonCode: undefined,
        projectJpersonName: undefined,
        projectYpersonCode: undefined,
        projectYpersonName: undefined,
        projectBpersonCode: undefined,
        projectBpersonName: undefined,
        contractMoney: undefined,
        flowNo: undefined,
        nodeNo: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
      };
      this.resetForm("form");
      this.resetForm("shForm");
      this.resetForm("projectForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.djNumber);
      this.nodeNos = selection.map((item) => item.nodeNo);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    handleSelectFlow(row) {
      this.stepsActive = parseInt(row.nodeNo) - 1;
      djFlowList(row.djNumber,0).then((response) => {
        this.stepsData = response.rows;
        //判断是否为空
        for (let i = 0; i < this.stepsData.length; i++) {
          if (this.stepsData[i].auditTime == null) {
            this.stepsData[i].auditTime == "";
          }
        }
        console.log(this.stepsData);
      });
      djFlowList(row.djNumber,-1).then((response) => {
        this.stepsDataHistory = response.rows;
        this.stepsHistoryActive=this.stepsDataHistory.length;
        //判断是否为空
        for (let i = 0; i < this.stepsDataHistory.length; i++) {
          if (this.stepsDataHistory[i].auditTime == null) {
            this.stepsDataHistory[i].auditTime == "";
          }
        }
      });
      
      this.openSh = true;
    },
    handleEffect(row) {
      this.shForm.nodeNo = this.nodeNos[0];
      this.shForm.djId = this.ids[0];
      console.log(this.shForm);
      this.openLcsh = true;
    },
    /** 详情按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getProjectReport(id).then((response) => {
        this.form = response.data;
        systemFileList(this.form.djNumber).then((response) => {
          this.fileList = response.rows;
        });
        getProjectReportChildList(this.form.djNumber).then((response) => {
          this.tableData = response.rows;
        });
        this.open = true;
        this.title = "产值提报详情";
      });
    },
    /** 取消按钮操作 */
    handleCancel(row) {
      const ids = row.id || this.ids;
      const nodeNos = row.nodeNos || this.nodeNos;
      this.$confirm("是否确认取消选择的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return cancelAuditProjectReport(ids, nodeNos);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("取消成功");
        })
        .catch(function () {});
    },
    /** 审核按钮 */
    submitForm: function () {
      console.log(this.shForm);
      this.$refs["shForm"].validate((valid) => {
        if (valid) {
          examineProjectReport(this.shForm).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("审核成功");
              this.openLcsh = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
  },
};
</script>