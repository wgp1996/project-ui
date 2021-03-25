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
      <el-form-item label="合同乙方" prop="khName">
        <el-input
          v-model="queryParams.khName"
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
          v-hasPermi="['system:projectContract:examine']"
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
          v-hasPermi="['system:projectContract:cancelAudit']"
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
      :data="projectContractList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据状态" align="center" prop="statusName" />
      <el-table-column label="单号" align="center" prop="djNumber" />
      <el-table-column label="合约名称" align="center" prop="contractName" />
      <el-table-column label="合约编号" align="center" prop="contractCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="项目编码" align="center" prop="projectCode" />
      <el-table-column label="乙方" align="center" prop="khName" />
      <el-table-column label="联系电话" align="center" prop="lxrPhone" />
      <el-table-column label="合约金额" align="center" prop="contractMoney" />
      <el-table-column label="制单人" align="center" prop="createBy" />
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
            v-hasPermi="['system:projectContract:edit']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSelectFlow(scope.row)"
            v-hasPermi="['system:projectContract:edit']"
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
    <!-- 添加或修改分包合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-tabs v-model="activeName">
       <el-tab-pane label="基础信息" name="first">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="合约编号" prop="contractCode">
              <el-input
                v-model="form.contractCode"
                placeholder="请输入合约编号"
              />
            </el-form-item>
                   <el-form-item label="合约名称" prop="contractName">
              <el-input
                v-model="form.contractName"
                placeholder="请输入合约名称"
              />
            </el-form-item>
            <el-form-item
              label="选择项目"
              prop="projectCode"
              style="width: 80%; position: relative"
            >
              <el-input
                v-model="form.projectName"
                :readonly="true"
                placeholder="请选择项目"
              />
              <el-button
                icon="el-icon-plus"
                type="primary"
                style="position: absolute; right: -50px; top: 0px"
                @click="projectSelect"
              ></el-button>
            </el-form-item>
            <el-form-item label="合同乙方" prop="khCode">
              <!-- <el-input v-model="form.projectJpersonCode" placeholder="请输入乙方编码" /> -->
              <el-select
                v-model="form.khCode"
                placeholder="请选择合同乙方"
                filterable
                style="width: 100%"
                @change="selectPerson"
              >
                <el-option
                  v-for="item in personList"
                  :key="item.khCode"
                  :label="item.khName"
                  :value="item.khCode"
                >
                  <span style="float: left; width: 50%">{{ item.khCode }}</span>
                  <span style="float: left; width: 50%">{{ item.khName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工种" prop="projectTypeWork">
              <el-input
                v-model="form.projectTypeWork"
                placeholder="请输入工种"
              />
            </el-form-item>
            
            <el-form-item label="启用审批" prop="isSp">
              <el-radio-group v-model="form.isSp">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">不启用</el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="clearfix">
              <el-form-item
                label="联系电话"
                prop="lxrPhone"
                style="width: 46%; float: left"
              >
                <el-input
                  v-model="form.lxrPhone"
                  placeholder="请输入联系电话"
                />
              </el-form-item>
              <el-form-item
                label="合约金额"
                prop="contractMoney"
                style="width: 46%; float: right"
              >
                <el-input
                  v-model="form.contractMoney"
                  placeholder="请输入合约金额"
                />
              </el-form-item>
            </div>

         <el-form-item label="审核意见" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
          </el-form>
        </el-tab-pane>
         <el-tab-pane label="合同清单明细" name="second">
            <el-table
              :data="tableData"
              class="tb-edit"
              style="width: 100%"
              highlight-current-row
              :header-cell-class-name="starAdd"
            >
              <el-table-column prop="inventoryName" label="分部分项内容" width="200">
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
                    v-model="scope.row.inventoryUnit" :readonly="true"
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
                :onkeyup="
                  (scope.row.inventoryNum = scope.row.inventoryNum.replace(
                    /[^\d.]/g,
                    ''
                  ))
                "
                @change="handleEdit(scope.$index, scope.row)"
              ></el-input>
            </template>
               </el-table-column>
                   <el-table-column
                prop="inventoryPrice"
                label="单价"
                width="120"
              >
                <template scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.inventoryPrice" :readonly="true"
                    placeholder="单价信息"
                  ></el-input>
                </template>
              </el-table-column>
                   <el-table-column
                prop="inventoryMoney"
                label="金额"
                width="120"
              >
                <template scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.inventoryMoney"
                    placeholder="金额信息" :readonly="true"
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
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  shListProjectContract,
  getProjectContract,
  examineProjectContract,
  cancelAuditProjectContract,
} from "@/api/system/projectContract";
import {getProjectContractChildByNum} from "@/api/system/projectContractChild"
import { systemFileList, getProjectInfoByCode } from "@/api/system/projectInfo";
import { djFlowList } from "@/api/system/flowInfo";
export default {
  name: "ProjectContract",
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
      // 分包合同表格数据
      projectContractList: [],
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
    /** 查询分包合同列表 */
    getList() {
      this.loading = true;
      shListProjectContract(this.queryParams).then((response) => {
        this.projectContractList = response.rows;
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
      getProjectContract(id).then((response) => {
        this.form = response.data;
        systemFileList(this.form.djNumber).then((response) => {
          this.fileList = response.rows;
        });
        getProjectContractChildByNum(this.form.djNumber).then((response) => {
          this.tableData = response.rows;
        });
        this.open = true;
        this.title = "分包合同详情";
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
          return cancelAuditProjectContract(ids, nodeNos);
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
          examineProjectContract(this.shForm).then((response) => {
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