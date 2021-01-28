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
      <el-form-item label="合同甲方" prop="projectJpersonName">
        <el-input
          v-model="queryParams.projectJpersonName"
          placeholder="请输入甲方名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同乙方" prop="projectYpersonName">
        <el-input
          v-model="queryParams.projectYpersonName"
          placeholder="请输入乙方名称"
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
          v-hasPermi="['system:contractGenera:examine']"
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
          v-hasPermi="['system:contractGenera:cancelAudit']"
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
      :data="contractGeneraList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据状态" align="center" prop="statusName" />
      <el-table-column label="单号" align="center" prop="djNumber" />
      <el-table-column label="项目编号" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column
        label="合同甲方"
        align="center"
        prop="projectJpersonName"
      />
      <el-table-column
        label="合同乙方"
        align="center"
        prop="projectYpersonName"
      />
      <el-table-column label="合同总额" align="center" prop="contractMoney" />
      <el-table-column label="制单人" align="center" prop="createBy" />
      <el-table-column label="制单日期" align="center" prop="createTime" />
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
            v-hasPermi="['system:contractGenera:edit']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSelectFlow(scope.row)"
            v-hasPermi="['system:contractGenera:edit']"
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
    <!-- 添加或修改总包合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model="form.projectName"
                :readonly="true"
                placeholder="项目名称"
              />
            </el-form-item>
            <el-form-item label="合同甲方" prop="projectJpersonCode">
              <el-input
                v-model="form.projectJpersonName"
                :readonly="true"
                placeholder="合同甲方"
              />
            </el-form-item>
            <el-form-item label="合同乙方" prop="projectYpersonCode">
              <el-input
                v-model="form.projectYpersonName"
                :readonly="true"
                placeholder="合同乙方"
              />
            </el-form-item>
            <el-form-item label="合同丙方" prop="projectBpersonCode">
              <el-input
                v-model="form.projectBpersonName"
                :readonly="true"
                placeholder="合同丙方"
              />
            </el-form-item>
            <el-form-item label="合同总额" prop="contractMoney">
              <el-input
                :readonly="true"
                v-model="form.contractMoney"
                placeholder="请输入合同总额"
              />
            </el-form-item>
            <el-form-item label="启用审批" prop="isSp">
              <el-radio-group v-model="form.isSp">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">不启用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                :readonly="true"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-form>
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
        <el-tab-pane label="项目信息" name="three">
          <el-form ref="projectForm" :model="projectForm" label-width="120px">
            <el-form-item label="项目编码" prop="projectCode">
              <el-input
                v-model="projectForm.projectCode"
                :readonly="true"
                placeholder="请输入项目编码"
              />
            </el-form-item>
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                :readonly="true"
                v-model="projectForm.projectName"
                placeholder="请输入项目名称"
              />
            </el-form-item>
            <el-form-item label="项目简称" prop="projectNameJc">
              <el-input
                :readonly="true"
                v-model="projectForm.projectNameJc"
                placeholder="项目简称"
              />
            </el-form-item>
            <el-form-item label="项目类型" prop="projectType">
              <el-input
                :readonly="true"
                v-model="projectForm.projectTypeName"
                placeholder="项目类型"
              />
            </el-form-item>
            <el-form-item label="项目经理" prop="projectManagerName">
              <el-input
                :readonly="true"
                v-model="projectForm.projectManagerName"
                placeholder="项目经理"
              />
            </el-form-item>
            <el-form-item label="开工日期" prop="projectStartTime">
              <el-date-picker
                :readonly="true"
                clearable
                style="width: 100%"
                v-model="projectForm.projectStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="开工日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="完工日期" prop="projectEndTime">
              <el-date-picker
                clearable
                :readonly="true"
                style="width: 100%"
                v-model="projectForm.projectEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="完工日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="启用预算">
              <el-radio-group v-model="projectForm.ysStatus">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">不启用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="项目说明">
              <el-input
                :readonly="true"
                type="textarea"
                :rows="2"
                v-model="projectForm.remark"
                placeholder="请输入项目说明,200字以内"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  shListContractGenera,
  getContractGenera,
  examineContractGenera,
  cancelAuditContractGenera,
} from "@/api/system/contractGenera";
import { systemFileList, getProjectInfoByCode } from "@/api/system/projectInfo";
import { djFlowList } from "@/api/system/flowInfo";
export default {
  name: "ContractGenera",
  data() {
    return {
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
      // 总包合同表格数据
      contractGeneraList: [],
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
        projectJpersonCode: undefined,
        projectJpersonName: undefined,
        projectYpersonCode: undefined,
        projectYpersonName: undefined,
        projectBpersonCode: undefined,
        projectBpersonName: undefined,
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
    /** 查询总包合同列表 */
    getList() {
      this.loading = true;
      shListContractGenera(this.queryParams).then((response) => {
        this.contractGeneraList = response.rows;
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
      getContractGenera(id).then((response) => {
        this.form = response.data;
        systemFileList(this.form.djNumber).then((response) => {
          this.fileList = response.rows;
        });
        getProjectInfoByCode(response.data.projectCode).then((response) => {
          this.projectForm = response.data;
        });
        this.open = true;
        this.title = "总包合同详情";
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
          return cancelAuditContractGenera(ids, nodeNos);
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
          examineContractGenera(this.shForm).then((response) => {
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