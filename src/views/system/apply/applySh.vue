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
      <el-form-item label="工程编码" prop="engineerCode">
        <el-input
          v-model="queryParams.engineerCode"
          placeholder="请输入工程编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工程名称" prop="engineerName">
        <el-input
          v-model="queryParams.engineerName"
          placeholder="请输入工程名称"
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
          v-hasPermi="['system:enginnerApply:examine']"
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
          v-hasPermi="['system:enginnerApply:cancelAudit']"
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
      :data="enginnerApplyList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据状态" align="center" prop="statusName" />
      <el-table-column label="单号" align="center" prop="djNumber" />
      <el-table-column label="工程编号" align="center" prop="engineerCode" />
      <el-table-column label="工程名称" align="center" prop="engineerName" />
      <el-table-column label="施工面积" align="center" prop="enginnerArea" />
      <el-table-column label="施工地址" align="center" prop="engineerAddress" />
      <el-table-column
        label="开始时间"
        align="center"
        prop="enginnerStartTime"
      />
      <el-table-column label="结束时间" align="center" prop="enginnerEndTime" />
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
    <!-- 添加或修改立项申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-tabs v-model="activeName" >
          <el-tab-pane label="基本信息" name="first">
            <el-form-item label="工程来源" prop="engineerFrom">
              <!-- <el-input v-model="form.postName" placeholder="请输入岗位名称" /> -->
              <el-select
                v-model="form.engineerFrom"
                placeholder="请选择工程来源"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in projectfromOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                >
                  <span style="width: 100%">{{ dict.dictLabel }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <div class="clearfix">
              <el-form-item
                label="工程编号"
                prop="engineerCode"
                style="float: left; width: 50%; color: red"
                class="redItem"
              >
                <el-input
                  v-model="form.engineerCode"
                  placeholder="手工录入工程编号"
                />
              </el-form-item>
              <el-form-item
                label=""
                prop="isFormal"
                style="float: left; width: 25%"
                label-width="50px"
              >
                <el-select
                  v-model="form.isFormal"
                  placeholder="请选择"
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    v-for="dict in formOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  >
                    <span style="width: 100%">{{ dict.dictLabel }}</span>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                label=""
                prop="isZb"
                style="float: left; width: 25%"
                label-width="50px"
              >
                <el-select
                  v-model="form.isZb"
                  placeholder="请选择"
                  filterable
                  style="width: 100%"
                >
                  <el-option
                    v-for="dict in contractOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  >
                    <span style="width: 100%">{{ dict.dictLabel }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="工程名称" prop="engineerName" class="redItem">
              <el-input
                v-model="form.engineerName"
                placeholder="请输入工程名称"
              />
            </el-form-item>
            <el-form-item label="启用审批" prop="isSp">
              <el-radio-group v-model="form.isSp">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">不启用</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="建设内容" prop="createContent">
              <el-input
                v-model="form.createContent"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-tab-pane>
          <!-- 第二个 -->
          <el-tab-pane label="指定项目部" name="second">
            <el-table
              :data="tableData"
              class="tb-edit"
              style="width: 100%"
              highlight-current-row
              :header-cell-class-name="starAdd"
            >
              <el-table-column prop="deptCode" label="项目部编码" width="180">
                <template scope="scope">
                  <el-input
                    :disabled="true"
                    size="small"
                    v-model="scope.row.deptCode"
                    placeholder="请输入项目编码"
                  ></el-input>
                  <!-- <span>{{scope.row.goodsCode}}</span> -->
                </template>
              </el-table-column>

              <el-table-column prop="deptName" label="项目部名称" width="180">
                <template scope="scope">
                  <el-input
                    :disabled="true"
                    size="small"
                    v-model="scope.row.deptName"
                    placeholder="请输入内容"
                  ></el-input>
                  <!-- <span>{{scope.row.goodsName}}</span> -->
                </template>
              </el-table-column>
              <el-table-column
                prop="enginnerNum"
                label="工程分项编号"
                width="180"
              >
                <template scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.enginnerNum"
                    placeholder="请输入单位信息"
                  ></el-input>
                  <!-- <span>{{scope.row.enginnerNum}}</span> -->
                </template>
              </el-table-column>
              <el-table-column label="备注" width="180" prop="remark">
                <template scope="scope">
                  <el-input
                    size="small"
                    v-model="scope.row.remark"
                    placeholder="请输入备注"
                  ></el-input>
                  <!-- <span>{{scope.row.remark}}</span> -->
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 第三个 -->
          <el-tab-pane label="工程信息" name="third">
            <el-form-item label="工程地址" prop="engineerAddress">
              <el-input
                v-model="form.engineerAddress"
                placeholder="请输入工程地址"
              />
            </el-form-item>
            <el-form-item label="建设单位" prop="engineerUnit">
              <el-input
                v-model="form.engineerUnit"
                placeholder="请输入工程地址"
              />
            </el-form-item>
            <div class="clearfix">
              <el-form-item
                label="联系人"
                prop="enginnerLxr"
                style="float: left; width: 50%"
              >
                <el-input v-model="form.enginnerLxr" placeholder="联系人" />
              </el-form-item>
              <el-form-item
                label="联系电话"
                prop="enginnerLxrPhone"
                style="float: left; width: 50%"
              >
                <el-input
                  v-model="form.enginnerLxrPhone"
                  placeholder="联系电话"
                />
              </el-form-item>
            </div>
            <div class="clearfix">
              <el-form-item
                label="计划工期"
                prop="enginnerTime"
                style="float: left; width: 50%"
              >
                <el-input
                  v-model="form.enginnerTime"
                  placeholder="请输入计划工期"
                />
              </el-form-item>

              <el-form-item
                label="施工面积"
                prop="enginnerArea"
                style="float: left; width: 50%"
              >
                <el-input v-model="form.enginnerArea" placeholder="施工面积" />
              </el-form-item>
            </div>
            <div class="clearfix">
              <el-form-item
                label="开始时间"
                prop="enginnerStartTime"
                style="float: left; width: 50%"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="form.enginnerStartTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                label="结束时间"
                prop="enginnerEndTime"
                style="float: left; width: 50%"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="form.enginnerEndTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </div>
            <el-form-item label="泵房设备" prop="enginnerDevice">
              <el-input v-model="form.enginnerDevice" placeholder="泵房设备" />
              <!-- <el-select
                            v-model="form.enginnerDevice"
                            placeholder="请选择"
                            filterable
                            style="width: 100%"
                          >
                                  <el-option
                                    v-for="dict in contractOptions"
                                    :key="dict.dictValue"
                                    :label="dict.dictLabel"
                                    :value="dict.dictValue"
                                  >
                                  <span style="width: 100%">{{ dict.dictLabel }}</span>
                                </el-option>
                            </el-select> -->
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                rows="2"
                v-model="form.remark"
                placeholder=""
              />
            </el-form-item>
          </el-tab-pane>
          <!-- 第四个 -->
          <el-tab-pane label="立项申请" name="fourth">
            <el-form-item
              label="有无总包"
              prop="isZb"
              style="float: left; width: 50%"
            >
              <el-select placeholder="请选择" filterable style="width: 100%">
                <el-option
                  v-for="dict in contractOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                >
                  <span style="width: 100%">{{ dict.dictLabel }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="总包单位"
              prop="isZb"
              style="float: left; width: 100%"
            >
              <el-select placeholder="请选择" filterable style="width: 100%">
                <el-option
                  v-for="dict in contractOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                >
                  <span style="width: 100%">{{ dict.dictLabel }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-col :span="12">
              <el-form-item label="合同金额" prop="postCode">
                <el-input placeholder="合同金额" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同状态" prop="status">
                <el-select placeholder="请选择" filterable style="width: 100%">
                  <!-- <el-option
                    v-for="dict in htOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  >
                    <span style="width: 100%">{{ dict.dictLabel }}</span>
                  </el-option> -->
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-form-item label="备注" prop="postCode" style="float:left;width:50%;">
                         <el-input v-model="form.postCode" placeholder="备注" type="textarea" />
                </el-form-item> -->
          </el-tab-pane>
          <el-tab-pane label="附件" name="fivth">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  shList,
  getEnginnerApply,
  examine,
  cancelAudit,
} from "@/api/system/enginnerApply";
import { systemFileList } from "@/api/system/projectInfo";
import {
  listEnginnerByEnginner,
  delEnginnerApplyChild,
} from "@/api/system/enginnerApplyChild";
import { djFlowList } from "@/api/system/flowInfo";
export default {
  name: "",
  data() {
    return {
      showSh: true,
      showCancel: false,
      statusTabs: "one",
      stepsActive: 0,
      stepsHistoryActive: 0,
      stepsData: [],
      stepsDataHistory: [],
      activeName: "first",
      fileList: [],
      tableData: [],
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
      // 立项申请表格数据
      enginnerApplyList: [],
      projectfromOptions: [],
      contractOptions: [],
      // 是否正式编号
      formOptions: [],
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
      this.getDicts("sys_apply_code").then((response) => {
      console.log(response);
      this.statusOptions = response.data;
    });
    this.getDicts("sys_apply_contract").then((response) => {
      this.contractOptions = response.data;
    });
    this.getDicts("sys_tatus").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_project_from").then((response) => {
      this.projectfromOptions = response.data;
      console.log(response);
    });
    this.getDicts("sys_projectcode_from").then((response) => {
      this.formOptions = response.data;
      console.log(response);
    });
    this.getDicts("sys_ht_status").then((response) => {
      this.htOptions = response.data;
    });
  },
  methods: {
    //追加子表必填样式
    starAdd(obj) {
      if (obj.columnIndex === 7 || obj.columnIndex === 8) {
        return "star";
      }
    },
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
    hadelOpenFile(file) {
      window.open(file.url);
    },
    handleRemove(file, fileList) {
      return;
      //this.fileList = fileList;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    /** 查询立项申请列表 */
    getList() {
      this.loading = true;
      shList(this.queryParams).then((response) => {
        this.enginnerApplyList = response.rows;
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
      getEnginnerApply(id).then((response) => {
        this.form = response.data;
        this.form.isFormal = this.form.isFormal + "";
        this.form.isZb = this.form.isZb + "";
        listEnginnerByEnginner(this.form.engineerCode).then((response) => {
          console.log(response);
          this.tableData = response.rows;
        });
        systemFileList(this.form.djNumber).then((response) => {
          this.fileList = response.rows;
        });
        this.open = true;
        this.title = "详细信息";
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
          return cancelAudit(ids, nodeNos);
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
          examine(this.shForm).then((response) => {
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