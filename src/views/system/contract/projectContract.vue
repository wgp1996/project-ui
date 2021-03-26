<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="合约名称" prop="contractName">
        <el-input
          v-model="queryParams.contractName"
          placeholder="请输入合约名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合约编号" prop="contractCode">
        <el-input
          v-model="queryParams.contractCode"
          placeholder="请输入合约编号"
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
      <el-form-item label="项目编码" prop="projectCode">
        <el-input
          v-model="queryParams.projectCode"
          placeholder="请输入项目编码"
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
          v-hasPermi="['system:projectContract:add']"
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
          v-hasPermi="['system:projectContract:edit']"
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
          v-hasPermi="['system:projectContract:remove']"
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
          v-hasPermi="['system:projectContract:effect']"
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
          v-hasPermi="['system:projectContract:cancel']"
          >取消提交</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:projectContract:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="projectContractList"
      @selection-change="handleSelectionChange"
    >

      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="状态" align="center" prop="statusName" />
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
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="inventSelect"
                  >引入清单</el-button
                >
              </el-col>
            </el-row>
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
              <span>{{ scope.row.inventoryNum }}</span>
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
    <project-select
      v-if="selectProjectDialog"
      ref="selectProject"
      @selectData="selectData"
    ></project-select>
    <invent-select
      v-if="selectInventDialog"
      ref="selectInvent"
      @selectInventData="selectInventData"
      @selectDataMore="selectDataMore"
    ></invent-select>
  </div>
</template>

<script>
import {
  listProjectContract,
  getProjectContract,
  delProjectContract,
  addProjectContract,
  updateProjectContract,
  exportProjectContract,
  effectProjectContract,
  cancelProjectContract
} from "@/api/system/projectContract";
import { djFlowList } from "@/api/system/flowInfo";
import {delProjectContractChild,getProjectContractChildByNum} from "@/api/system/projectContractChild"
import { systemFileList, delFileInfo } from "@/api/system/projectInfo";
import { getKhList } from "@/api/system/kh";
import projectSelect from "./projectSelect";
import inventSelect from "./inventSelect";
import { getToken } from "@/utils/auth";
export default {
  name: "ProjectContract",
  components: {
    projectSelect,
    inventSelect
  },
  data() {
    return {
      stepsActive: 0,
      stepsHistoryActive:0,
      stepsData: [],
      stepsDataHistory:[],
      openSh: false,
      activeName: "first",
      tableData:[],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 分包合同表格数据
      projectContractList: [],
      // 弹出层标题
      title: "",
      activeName: "first",
      fileList: [],
      personList: [],
      show: true,
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
      selectProjectDialog: false,
      selectInventDialog:false,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractName: undefined,
        contractCode: undefined,
        projectName: undefined,
        projectCode: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        contractName : [
          { required: true, message: "合约名称不能为空", trigger: "blur" },
        ],
         khCode : [
          { required: true, message: "乙方不能为空", trigger: "blur" },
        ],
         projectCode: [
          { required: true, message: "请选择项目", trigger: "blur" },
        ],
          isSp: [
          { required: true, message: "请选择是否审批", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    let queryParams = { khType: 2 };
    getKhList(queryParams).then((response) => {
      this.personList = response.rows;
    });
    this.getList();
  },
  methods: {
    //查看审批信息
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
    /** 提交按钮操作 */
    handleEffect(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认提交选中的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return effectProjectContract(ids);
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
          return cancelProjectContract(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("取消成功");
        })
        .catch(function () {});
    },
      //追加子表必填样式
    starAdd(obj) {
      if (obj.columnIndex === 0||obj.columnIndex === 2||obj.columnIndex === 4 ) {
        return "star";
      }
    },
    handleSuccess(res, file, fileList) {
      this.fileList = fileList;
      // 上传成功
      console.log(res);
      console.log(fileList);
      //保存到文件表中
      // let info = new Object();
      // info.name = response.data.fileName;
      // info.url = response.data.fileName;
      // this.fileList.push(info);
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
    //选择乙方
    selectPerson(data) {
      //根据编码找名称
      for (let i = 0; i < this.personList.length; i++) {
        if (this.personList[i].khCode == data) {
          this.form.khName = this.personList[i].khName;
          break;
        }
      }
    },
      handleEdit(index, row) {
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
        row.inventoryMoneyRate = row.inventoryMoney;
      }
    },
    /** 选择项目列表 */
    projectSelect() {
      this.selectProjectDialog = true;
      this.$nextTick(() => {
        this.$refs.selectProject.visible = true;
      });
    },
     /** 选择清单列表 */
     inventSelect() {
      this.selectInventDialog = true;
      this.$nextTick(() => {
        this.$refs.selectInvent.visible = true;
      });
    },
    selectData(row) {
      this.$nextTick(() => {
        this.form.projectCode = row.projectCode;
        this.form.projectName = row.projectName;
        this.$refs.selectProject.visible = false;
      });
    },
   //选择数据
    selectInventData(row) {
      //判断清单是否存在
      for (let i = 0; i < this.tableData.length; i++) {
          if(row.id==this.tableData[i].inventoryCode){
            return
          }
      }
      this.$nextTick(() => {
        console.log(row);
        let info = new Object();
        info.inventoryCode = row.id;
        info.inventoryName = row.inventoryName;
        info.inventoryUnit = row.inventoryUnit;
        info.inventoryPrice = row.inventoryPrice;
        info.inventoryNum="";
        info.inventoryMoney="";
        info.remark = "";
        this.tableData.push(info);
        this.$refs.selectInvent.visible = false;
      });
    },
    //批量选择数据
    selectDataMore(rows) {
      this.$nextTick(() => {
        for (let i = 0; i < this.tableData.length; i++) {
           for (let j = 0; j < rows.length; j++) {
              let row = rows[j];
              if(row.id==this.tableData[i].inventoryCode){
                return
              }
           }
        }
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i];
          let info = new Object();
          info.inventoryCode = row.id;
          info.inventoryName = row.inventoryName;
          info.inventoryUnit = row.inventoryUnit;
          info.inventoryPrice = row.inventoryPrice;
          info.inventoryNum="";
          info.inventoryMoney="";
          info.remark = "";
          this.tableData.push(info);
        }
        this.$refs.selectInvent.visible = false;
      });
    },
    /** 查询分包合同列表 */
    getList() {
      this.loading = true;
      listProjectContract(this.queryParams).then((response) => {
        this.projectContractList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openSh=false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        djNumber: undefined,
        contractName: undefined,
        contractCode: undefined,
        projectName: undefined,
        projectCode: undefined,
        projectTypeWork: undefined,
        lxrPhone: undefined,
        contractMoney: undefined,
        status: "0",
        flowNo: undefined,
        nodeNo: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        isSp: undefined,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加分包合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getProjectContract(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改分包合同";
         getProjectContractChildByNum(this.form.djNumber).then((response) => {
          this.tableData = response.rows;
        });
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
         for (let i = 0; i < this.tableData.length; i++) {
            if (
              this.tableData[i].inventoryCode == "" ||
              this.tableData[i].inventoryNum == ""||
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
        if (valid) {
          if (this.form.id != undefined) {
            updateProjectContract(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addProjectContract(this.form).then((response) => {
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
      handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        if(this.form.status>0){
          return
        }
        delProjectContractChild(row.id);
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(index, 1);
      }
      console.log(index, row);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除分包合同编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delProjectContract(ids);
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
      this.$confirm("是否确认导出所有分包合同数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportProjectContract(queryParams);
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