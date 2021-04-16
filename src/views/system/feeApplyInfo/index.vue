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
          ref="inputVal"
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
          v-hasPermi="['system:feeApplyInfo:add']"
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
          v-hasPermi="['system:feeApplyInfo:edit']"
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
          v-hasPermi="['system:feeApplyInfo:remove']"
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
          v-hasPermi="['system:feeApplyInfo:effect']"
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
          v-hasPermi="['system:feeApplyInfo:cancel']"
          >取消提交</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:feeApplyInfo:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="feeApplyInfoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单号" align="center" prop="djNumber" />
      <el-table-column label="单据状态" align="center" prop="statusName" />
      <el-table-column label="单据日期" align="center" prop="djTime" />
      <!-- <el-table-column label="类型" align="center" prop="djType" /> -->
      <el-table-column label="报销事由" align="center" prop="applyContent" />
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

    <!-- 添加或修改费用报销单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="单号" prop="djNumber">
              <el-input
                v-model="form.djNumber"
                placeholder="自动生成"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="单据日期" prop="djTime">
              <!-- <el-input v-model="form.djTime" placeholder="请输入单据日期" /> -->
              <el-date-picker
                style="width: 100%"
                v-model="form.djTime"
                type="date"
                placeholder="单据日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="类型" prop="djType">
              <el-radio-group v-model="form.djType">
                <el-radio :label="0">代控类</el-radio>
                <el-radio :label="1">非代控类</el-radio>
              </el-radio-group>
            </el-form-item>
             <el-form-item label="启用审批" prop="isSp">
              <el-radio-group v-model="form.isSp">
                <el-radio :label="0">不启用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="报销事由" prop="applyContent">
              <el-input
                type="textarea"
                v-model="form.applyContent"
                placeholder="请输入报销事由"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="费用明细" name="second">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="feeSelect"
                >选择费用项目</el-button
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
            <el-table-column prop="feeCode" label="费用项目编码" width="120">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.feeCode"
                  placeholder="费用项目编码"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="feeName" label="费用项目名称" width="120">
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.feeName"
                  placeholder="费用项目名称"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="feeMoney" label="金额" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.feeMoney"
                  placeholder="金额"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="feeNum" label="凭证张数" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.feeNum"
                  placeholder="凭证张数"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="projectCode" label="项目" width="180">
              <template scope="scope">
                <el-select
                  v-model="scope.row.projectCode"
                  placeholder="请选择项目"
                  filterable
                  style="width: 100%"
                  @change="selectProject"
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectCode"
                    :label="item.projectName"
                    :value="item.projectCode"
                  >
                    <span style="float: left; width: 100%">{{
                      item.projectName
                    }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="applyContent" label="报销事由" width="150">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.applyContent"
                  placeholder="报销事由"
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
        <el-tab-pane label="附件信息" name="three">
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
    <child-select
      ref="selectchild"
      @selectchild="selectchild"
      @selectchildMore="selectchildMore"
    ></child-select>
  </div>
</template>

<script>
import {
  listFeeApplyInfo,
  getFeeApplyInfo,
  delFeeApplyInfo,
  addFeeApplyInfo,
  updateFeeApplyInfo,
  exportFeeApplyInfo,
  effectFeeApplyInfo,
  cancelFeeApplyInfo,
} from "@/api/system/feeApplyInfo";

import {
  listFeeApplyInfoChild,
  delFeeApplyInfoChild,
} from "@/api/system/feeApplyInfoChild";
import { getProjectList } from "@/api/system/projectInfo";
import { djFlowList } from "@/api/system/flowInfo";
import { getToken } from "@/utils/auth";
import childSelect from "./childSelect";
import { systemFileList, delFileInfo } from "@/api/system/projectInfo";
export default {
  name: "FeeApplyInfo",
  components: {
    childSelect,
  },
  data() {
    return {
      stepsActive: 0,
      stepsHistoryActive: 0,
      stepsData: [],
      stepsDataHistory: [],
      openSh: false,
      fileList: [],
      tableData: [],
      projectList: [],
      number: "",
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
      activeName: "first",
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
      // 费用报销单表格数据
      feeApplyInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        djNumber: undefined,
        djTime: undefined,
        status: undefined,
        djType: undefined,
        flowNo: undefined,
        nodeNo: undefined,
        isSp: undefined,
        applyContent: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        djTime: [
          { required: true, message: "请选择单据日期", trigger: "blur" },
        ],
         isSp: [
          { required: true, message: "请选择是否审批", trigger: "blur" },
        ],
        djType: [{ required: true, message: "请选择类型", trigger: "blur" }],
        applyContent: [
          { required: true, message: "请输入报销事由", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    getProjectList().then((response) => {
      this.projectList = response.rows;
    });
  },
  methods: {
    //追加子表必填样式
    starAdd(obj) {
      if (
        obj.columnIndex === 0 ||
        obj.columnIndex === 1 ||
        obj.columnIndex === 2 ||
        obj.columnIndex === 3
      ) {
        return "star";
      }
    },
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
    handleSuccess(res, file, fileList) {
      this.fileList = fileList;
      // 上传成功
      console.log(fileList);
    },
    handleRemove(file, fileList) {
      if (file.id != null && file.id != "" && file.id != undefined) {
        delFileInfo(file.id);
      }
      this.fileList = fileList;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    selectchild(row) {
      this.$nextTick(() => {
        let info = new Object();
        info.feeCode = row.feeCode;
        info.feeName = row.feeName;
        this.tableData.push(info);
        this.$refs.selectchild.visible = false;
      });
    },
    //批量选择数据
    selectchildMore(rows) {
      this.$nextTick(() => {
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i];
          let info = new Object();
          info.feeCode = row.feeCode;
          info.feeName = row.feeName;
          this.tableData.push(info);
        }
        this.$refs.selectchild.visible = false;
      });
    },
    /** 操作 */
    feeSelect() {
      this.$nextTick(() => {
        this.$refs.selectchild.getList();
        this.$refs.selectchild.visible = true;
      });
    },

    selectProject(data) {
      //根据编码找名称
      for (let i = 0; i < this.projectList.length; i++) {
        if (this.projectList[i].projectCode == data) {
          this.form.projectName = this.projectList[i].projectName;
          break;
        }
      }
    },
    /** 查询费用报销单列表 */
    getList() {
      this.loading = true;
      listFeeApplyInfo(this.queryParams).then((response) => {
        this.feeApplyInfoList = response.rows;
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
        djTime: undefined,
        status: "0",
        djType: undefined,
        flowNo: undefined,
        nodeNo: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        isSp: undefined,
        applyContent: undefined,
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
      this.title = "添加费用报销单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getFeeApplyInfo(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改费用报销单";
        listFeeApplyInfoChild(this.form.djNumber).then((response) => {
          this.tableData = response.rows;
        });
        systemFileList(this.form.djNumber).then((response) => {
          this.fileList = response.rows;
        });
      });
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
          return effectFeeApplyInfo(ids);
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
          return cancelFeeApplyInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("取消成功");
        })
        .catch(function () {});
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.tableData.length == 0) {
            this.msgError("检查明细必填项!");
            return;
          } else {
            for (let i = 0; i < this.tableData.length; i++) {
              if (
                this.tableData[i].feeCode == "" ||
                //this.tableData[i].projectCode == "" ||
                this.tableData[i].feeMoney == "" ||
                this.tableData[i].feeNum == ""
              ) {
                this.msgError("检查明细必填项!");
                return;
              }
            }
          }
          let fileList = [];
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
            updateFeeApplyInfo(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addFeeApplyInfo(this.form).then((response) => {
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
    // 删除字表信息
    handleChildDelete(index, row) {
      if (this.form.status > 0) {
        this.msgError("该状态禁止删除!");
        return;
      }
      if (this.tableData.length == 1) {
        this.msgError("明细不能为空!");
        return;
      }
      if (row.id != "" && row.id != undefined && row.id != null) {
        delFeeApplyInfoChild(row.id);
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
        '是否确认删除费用报销单编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delFeeApplyInfo(ids);
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
      this.$confirm("是否确认导出所有费用报销单数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportFeeApplyInfo(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
<style >
table th.star div::after {
  content: "*";
  color: red;
}
</style>