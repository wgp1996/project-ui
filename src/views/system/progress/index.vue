<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:projectReport:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:projectReport:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:projectReport:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleEffect"
          v-hasPermi="['system:projectReport:effect']"
          >提交</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleCancel"
          v-hasPermi="['system:projectReport:cancel']"
          >取消提交</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:projectReport:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="projectReportList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
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
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSelectFlow(scope.row)"
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
                @click="projectSelect"
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
                  <!-- <el-input v-model="form.startTime" placeholder="请输入开始时间" /> -->
                  <el-date-picker
                    clearable
                    style="width: 100%"
                    v-model="form.startTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择开始时间"
                    @change="changestarttime"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间" prop="endTime">
                  <!-- <el-input v-model="form.endTime" placeholder="请输入结束时间" /> -->
                  <el-date-picker
                    clearable
                    style="width: 100%"
                    v-model="form.endTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择结束时间"
                    @change="changeendtime"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="mb8">
              <el-col :span="12">
                <el-form-item label="天数" prop="dayNum">
                  <el-input v-model="form.dayNum" placeholder />
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
                v-model="user.ownerNameJc"
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
            :header-cell-class-name="starAdd"
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
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <span>{{ scope.row.inventoryNum }}</span>
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
                <span>{{ scope.row.inventoryNum }}</span>
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
            <el-table-column label="操作">
              <template scope="scope">
                <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
                <el-button
                  size="small"
                  type="danger"
                  @click="handleChildDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
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
                :action="upload.url"
                :headers="upload.headers"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :auto-upload="false"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >选取文件</el-button
                >
                <el-button
                  style="margin-left: 10px"
                  size="small"
                  type="success"
                  @click="submitUpload"
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
          <el-steps
            :space="100"
            direction="vertical"
            :active="stepsHistoryActive"
          >
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
    <progress-select
      v-if="selectProjectDialog"
      ref="selectProject"
      @selectData="selectData"
    ></progress-select>
  </div>
</template>

<script>
import {
  listProjectReport,
  getProjectReport,
  delProjectReport,
  addProjectReport,
  updateProjectReport,
  exportProjectReport,
  effectProjectReport,
  cancelProjectReport,
} from "@/api/system/projectReport";
import { djFlowList } from "@/api/system/flowInfo";
import { getProjectContractChildByNum } from "@/api/system/projectContractChild";
import {
  delProjectReportChild,
  getProjectReportChildList,
} from "@/api/system/projectReportChild";
import progressSelect from "./progressSelect";
import { systemFileList, delFileInfo } from "@/api/system/projectInfo";
import { getInfo } from "@/api/login";
import { getToken } from "@/utils/auth";
var validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入数字"));
  } else if (!/^[0-9]*$/.test(value)) {
    callback(new Error("请输入数字"));
  } else {
    callback();
  }
};
export default {
  name: "ProjectReport",
  components: {
    progressSelect,
  },
  data() {
    return {
      fileList: [],
      stepsActive: 0,
      stepsHistoryActive: 0,
      stepsData: [],
      stepsDataHistory: [],
      openSh: false,
      activeName: "first",
      tableData: [],
      user: {
        ownerCode: "",
        ownerName: "",
        ownerNameJc: "",
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/common/upload",
      },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      selectProjectDialog: false,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 产值提报表格数据
      projectReportList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      activeName: "first",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        djNumber: undefined,
        status: undefined,
        djTime: undefined,
        htDjNumber: undefined,
        htMoney: undefined,
        projectName: undefined,
        projectCode: undefined,
        startTime: undefined,
        endTime: undefined,
        yfMoney: undefined,
        fpMoney: undefined,
        czMoney: undefined,
        flowNo: undefined,
        nodeNo: undefined,
        isSp: undefined,
      },
      endTime: "",
      startTime: "",
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        djTime: [
          { required: true, message: "单据日期不能为空", trigger: "blur" },
        ],
        htDjNumber: [
          { required: true, message: "合同编号不能为空", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
        ],
        isSp: [{ required: true, message: "请选择是否审批", trigger: "blur" }],
        dayNum: [{ required: true, message: "天数不能为空", trigger: "blur" }],
        inventoryNum: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    getInfo().then((response) => {
      this.user.ownerNameJc = response.user.nickName;
    });
  },
  methods: {
    //查看审批信息
    handleSelectFlow(row) {
      this.stepsActive = parseInt(row.nodeNo) - 1;
      djFlowList(row.djNumber, 0).then((response) => {
        this.stepsData = response.rows;
        //判断是否为空
        for (let i = 0; i < this.stepsData.length; i++) {
          if (this.stepsData[i].auditTime == null) {
            this.stepsData[i].auditTime == "";
          }
        }
        console.log(this.stepsData);
      });
      djFlowList(row.djNumber, -1).then((response) => {
        this.stepsDataHistory = response.rows;
        this.stepsHistoryActive = this.stepsDataHistory.length;
        //判断是否为空
        for (let i = 0; i < this.stepsDataHistory.length; i++) {
          if (this.stepsDataHistory[i].auditTime == null) {
            this.stepsDataHistory[i].auditTime == "";
          }
        }
      });

      this.openSh = true;
    },
    /** 提交按钮操作 */
    handleEffect(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认提交选中的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return effectProjectReport(ids);
        })

        .then(() => {
          this.getList();
          this.msgSuccess("提交成功");
        })
        .catch(function () {});
    },
    /** 取消提交按钮操作 */
    handleCancel(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认取消选中的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return cancelProjectReport(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("取消成功");
        })
        .catch(function () {});
    },
    // 开始时间
    changestarttime(data){
         this.startTime=new Date(data).getTime();
        if(this.startTime!=''&&this.endTime!=''){
          if(Number(this.startTime)>Number(this.endTime)){
              this.msgError("日期格式不正确");
             this.form.startTime=''
              this.form.endTime=''
              this.form.dayNum=''
              this.startTime=''
              this.endTime=''
          }else{
            
            this.form.dayNum=(this.endTime - this.startTime) / (1000*3600*24);
          }
        }
    },
    // 结束时间
    changeendtime(data){
         this.endTime=new Date(data).getTime()
           console.log(this.endTime)
          if(this.startTime!=''&&this.endTime!=''){
          if(Number(this.startTime)>Number(this.endTime)){
              this.msgError("日期格式不正确");
              this.form.startTime=''
              this.form.endTime=''
              this.form.dayNum=''
              this.startTime=''
              this.endTime=''
          }else{
            this.form.dayNum=(this.endTime - this.startTime) / (1000*3600*24);
          }
        }
    },
    handleSuccess(res, file, fileList) {
      this.fileList = fileList;
      // 上传成功
      console.log(res);
      console.log(fileList);
    },
    handleRemove(file, fileList) {
      if (file.id != null && file.id != "" && file.id != undefined) {
        if (this.form.status == 0) {
          delFileInfo(file.id);
        }
      }
      this.fileList = fileList;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    /** 选择合同编号 */
    projectSelect() {
      this.selectProjectDialog = true;
      this.$nextTick(() => {
        this.$refs.selectProject.visible = true;
      });
    },
    /** 查询产值提报列表 */
    getList() {
      this.loading = true;
      listProjectReport(this.queryParams).then((response) => {
        this.projectReportList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openSh = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        djNumber: undefined,
        status: "0",
        djTime: this.getTime(),
        htDjNumber: undefined,
        htMoney: undefined,
        projectName: undefined,
        projectCode: undefined,
        startTime: undefined,
        endTime: undefined,
        yfMoney: undefined,
        fpMoney: undefined,
        czMoney: undefined,
        flowNo: undefined,
        nodeNo: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        isSp: undefined,
        djTitle: undefined,
        dayNum: undefined,
      };
      this.resetForm("form");
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    //追加子表必填样式
    starAdd(obj) {
      if (obj.columnIndex === 2) {
        return "star";
      }
    },
    editTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    getTime() {
      var date = new Date();
      var year = date.getFullYear(); //得到当前年份
      var month = this.editTime(date.getMonth() + 1); //得到当前月份
      var day = this.editTime(date.getDate()); //得到当前几号
      var hour = this.editTime(date.getHours()); //得到当前小时
      var min = this.editTime(date.getMinutes()); //得到当前分钟
      var seconds = this.editTime(date.getSeconds()); //得到当前秒
      var weeks = date.getDay();
      var week;
      switch (weeks) {
        case 0:
          week = "星期日";
          break;
        case 1:
          week = "星期一";
          break;
        case 2:
          week = "星期二";
          break;
        case 3:
          week = "星期三";
          break;
        case 4:
          week = "星期四";
          break;
        case 5:
          week = "星期五";
          break;
        case 6:
          week = "星期六";
          break;
      }
      return year + "-" + month + "-" + day;
    },
    selectData(row) {
      console.log(row);
      this.$nextTick(() => {
        this.tableData = [];
        this.form.htMoney = row.contractMoney;
        this.form.projectName = row.projectName;
        this.form.projectCode = row.projectCode;
        this.form.htDjNumber = row.djNumber;
        getProjectContractChildByNum(row.djNumber).then((response) => {
          for (let i = 0; i < response.rows.length; i++) {
            let info = new Object();
            info.inventoryId = response.rows[i].id;
            info.inventoryName = response.rows[i].inventoryName;
            info.inventoryUnit = response.rows[i].inventoryUnit;
            info.inventoryPrice = response.rows[i].inventoryPrice;
            info.inventoryNum = "";
            info.inventoryCheckNum = "";
            info.inventoryMoney = "";
            info.remark = "";
            this.tableData.push(info);
          }
        });
        this.$refs.selectProject.visible = false;
      });
    },
    handleEdit(index, row) {
      if (!/^[0-9]*$/.test(row.inventoryNum)) {
        this.msgError("请输入数字!");
        row.inventoryNum = "";
      }
      if (
        row.inventoryNum != "" &&
        row.inventoryNum != null &&
        row.inventoryNum != undefined &&
        row.inventoryPrice != "" &&
        row.inventoryPrice != null &&
        row.inventoryPrice != undefined
      ) {
        row.inventoryMoney = (
          parseFloat(row.inventoryNum) * parseFloat(row.inventoryPrice)
        ).toFixed(2);
        row.inventoryCheckNum = row.inventoryNum;
      }
    },
    handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        if (this.form.status > 0) {
          return;
        }
        delProjectReportChild(row.id);
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(index, 1);
      }
      console.log(index, row);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加产值提报";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getProjectReport(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改产值提报";
        getProjectReportChildList(this.form.djNumber).then((response) => {
          this.tableData = response.rows;
        });
        systemFileList(this.form.djNumber).then((response) => {
          this.fileList = response.rows;
        });
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              this.tableData[i].inventoryId == "" ||
              this.tableData[i].inventoryNum == "" ||
              this.tableData[i].inventoryMoney == ""
            ) {
              this.msgError("检查明细必填项!");
              return;
            }
          }
          let fileList = [];
          console.log(this.fileList);
          for (let i = 0; i < this.fileList.length; i++) {
            if (
              this.fileList[i].id != "" &&
              this.fileList[i].id != null &&
              this.fileList[i].id != undefined
            ) {
              continue;
            }
            let info = new Object();
            info.name = this.fileList[i].response.name;
            info.url = this.fileList[i].response.url;
            fileList.push(info);
          }
          this.form.fileRows = JSON.stringify(fileList);
          this.form.rows = JSON.stringify(this.tableData);
          if (this.form.id != undefined) {
            updateProjectReport(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addProjectReport(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除产值提报编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delProjectReport(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有产值提报数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportProjectReport(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
<style>
.cell .el-select + span {
  display: none;
}
.cell .el-input + span {
  display: none;
}
.el-table__expanded-cell {
  padding: 0 !important;
  margin: 0 !important;
}
.tb-edit .el-input {
  display: block !important;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
}
.tb-edit .current-row .el-select {
  display: block;
}
.tb-edit .current-row .el-select + span {
  display: none;
}
table th.star div::after {
  content: "*";
  color: red;
}
.el-input.is-disabled .el-input__inner {
  color: #606266;
}
.changeBlue .el-form-item__label {
  color: #1890ff;
}
</style>