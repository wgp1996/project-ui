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
          v-hasPermi="['system:pickingReturn:add']"
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
          v-hasPermi="['system:pickingReturn:edit']"
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
          v-hasPermi="['system:pickingReturn:remove']"
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
          v-hasPermi="['system:pickingReturn:effect']"
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
          v-hasPermi="['system:pickingReturn:cancel']"
          >取消提交</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:pickingReturn:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="pickingReturnList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单号" align="center" prop="djNumber" />
      <el-table-column label="状态" align="center" prop="statusName" />
      <el-table-column label="单据日期" align="center" prop="djTime" />
      <el-table-column label="领料类型" align="center" prop="packType" />
      <el-table-column label="项目编码" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="班组名称" align="center" prop="khName" />
      <el-table-column label="归还仓库名称" align="center" prop="storeName" />
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

    <!-- 添加或修改借用归还单对话框 -->
    <!-- 添加或修改领料出库单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px">
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
            <el-form-item label="隶属项目" prop="projectName">
              <el-input
                v-model="form.projectName"
                placeholder="请选择隶属项目"
                :disabled="true"
              />
              <el-button
                icon="el-icon-plus"
                type="primary"
                style="position: absolute; right: 0px; top: 0px"
                @click="projectSelect"
              ></el-button>
            </el-form-item>
            <el-form-item label="归还班组" prop="khName">
              <el-input
                v-model="form.khName"
                placeholder="请选择归还班组"
                :disabled="true"
              />
              <el-button
                icon="el-icon-plus"
                type="primary"
                style="position: absolute; right: 0px; top: 0px"
                @click="supplierSelect"
              ></el-button>
            </el-form-item>
            <el-form-item label="归还仓库" prop="storeName">
              <el-select
                v-model="form.storeName"
                placeholder="请选择仓库"
                filterable
                style="width: 100%"
                @change="selectPerson"
              >
                <el-option
                  v-for="item in personList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                >
                  <span style="float: left; width: 50%">{{
                    item.dictLabel
                  }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="启用审批" prop="isSp">
              <el-radio-group v-model="form.isSp">
                <el-radio :label="0">不启用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="归还明细" name="second">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="goodsSelectchild"
                >引入归还明细</el-button
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
            <el-table-column
              prop="goodsCode"
              label="物料编码"
              width="150"
              fixed
            >
              <template scope="scope">
                <el-input
                  fixed
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsCode"
                  placeholder="物资编码"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column
              prop="goodsName"
              label="物料名称"
              width="150"
              fixed
            >
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsName"
                  :readonly="true"
                  placeholder="请输入物资名称"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="goodsNum" label="数量" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.goodsNum"
                  placeholder="请输入数量"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="goodsPrice" label="价格" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  :readonly="true"
                  v-model="scope.row.goodsPrice"
                  placeholder="请输入价格"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="goodsMoney" label="金额" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.goodsMoney"
                  placeholder="请输入金额"
                  :readonly="true"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="goodsGg" label="规格" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.goodsGg"
                  placeholder="金额信息"
                  :readonly="true"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="goodsDw" label="单位" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.goodsDw"
                  placeholder="单位"
                  :readonly="true"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.remark"
                  placeholder="备注"
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
    <goods-select
      v-if="selectProjectDialog"
      ref="selectProject"
      @selectData="selectData"
    ></goods-select>
    <!-- 供货商 归还班组-->
    <supplier-select
      v-if="selectSupplierSelectDialog"
      ref="selectSupplier"
      @selectDataSupplie="selectDataSupplie"
    ></supplier-select>
    <!-- 字表选项 -->
    <child-select
      v-if="selectGoodsDialogchild"
      ref="selectchild"
      @selectchild="selectchild"
      @selectchildMore="selectchildMore"
      :system="parameter"
    ></child-select>
  </div>
</template>

<script>
import {
  listPickingReturn,
  getPickingReturn,
  delPickingReturn,
  addPickingReturn,
  updatePickingReturn,
  exportPickingReturn,
  effectPickingReturn,
  cancelPickingReturn,
} from "@/api/system/pickingReturn";
import { djFlowList } from "@/api/system/flowInfo";
import childSelect from "./childSelect";
import goodsSelect from "./goodsSelect";
import supplierSelect from "./supplierSelect";
import { getToken } from "@/utils/auth";
import { systemFileList, delFileInfo } from "@/api/system/projectInfo";
import {
  listPickingReturnChild,
  delPickingReturnChild,
} from "@/api/system/pickingReturnChild";
export default {
  name: "PickingReturn",
  components: {
    goodsSelect,
    supplierSelect,
    childSelect,
  },
  data() {
    return {
      stepsActive: 0,
      stepsHistoryActive: 0,
      stepsData: [],
      stepsDataHistory: [],
      openSh: false,
      number: "",
      // 仓库
      personList: [],
      stepsActive: 0,
      stepsHistoryActive: 0,
      stepsData: [],
      stepsDataHistory: [],
      openSh: false,
      // 保存类型
      saveType: "",
      fileList: [],
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
      parameter: {
        khCode: undefined,
        projectCode: undefined,
        storeCode: "0",
      },
      tableData: [],
      selectProjectDialog: false,
      selectSupplierSelectDialog: false,
      selectGoodsDialogchild: false,
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
      // 借用归还单表格数据
      pickingReturnList: [],
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
        packType: undefined,
        projectCode: undefined,
        projectName: undefined,
        khCode: undefined,
        khName: undefined,
        returnStoreCode: undefined,
        returnStoreName: undefined,
        flowNo: undefined,
        nodeNo: undefined,
        isSp: undefined,
        storeCode: undefined,
        storeName: "0",
      },
      // 表单参数
      form: {
        //  khCode:undefined,
        // projectCode:undefined,
        // storeCode:undefined,
      },
      // 表单校验
      rules: {
        returnStoreCode: [
          { required: true, message: "归还仓库编码不能为空", trigger: "blur" },
        ],
        khName: [{ required: true, message: "请选择客户", trigger: "blur" }],
        projectName: [
          { required: true, message: "请选择项目", trigger: "blur" },
        ],
        isSp: [
          { required: true, message: "请选择是否审批", trigger: "change" },
        ],
        storeName: [
          { required: true, message: "请选择仓库名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("system_Llck").then((response) => {
      this.personList = response.data;
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
          return effectPickingReturn(ids);
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
          return cancelPickingReturn(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("取消成功");
        })
        .catch(function () {});
    },
    /** 选择供货商 */
    supplierSelect() {
      this.selectSupplierSelectDialog = true;
      this.$nextTick(() => {
        console.log(this.$refs.selectSupplier);
        this.$refs.selectSupplier.visible1 = true;
      });
    },
    // 供货商产地数据
    selectDataSupplie(row) {
      console.log(row);
      this.$nextTick(() => {
        this.form.khCode = row.khCode;
        this.parameter.khCode = row.khCode;
        this.form.khName = row.khName;
        this.$refs.selectSupplier.visible1 = false;
      });
    },
    /** 选择项目 */
    projectSelect() {
      this.selectProjectDialog = true;
      this.$nextTick(() => {
        console.log(this.$refs.selectProject);
        this.$refs.selectProject.visible = true;
      });
    },
    /** 选择项目产地数据 */
    selectData(row) {
      this.$nextTick(() => {
        console.log(this.$refs.selectProject);
        this.form.projectName = row.projectName;
        this.parameter.projectCode = row.projectCode;
        this.form.projectCode = row.projectCode;
        this.$refs.selectProject.visible = false;
      });
    },
    /** 操作 */
    goodsSelectchild() {
      this.selectGoodsDialogchild = true;
      this.$nextTick(() => {
        console.log(this.$refs.selectchild);
        if (
          this.parameter.projectCode == undefined ||
          this.parameter.khCode == undefined ||
          this.parameter.storeCode == undefined
        ) {
          this.$refs.selectchild.visible2 = false;
          this.msgError("请先选择基本信息");
        } else {
          this.$refs.selectchild.getList();
          this.$refs.selectchild.visible2 = true;
        }
      });
    },
    //选择仓库
    selectPerson(data) {
      //根据编码找名称
      for (let i = 0; i < this.personList.length; i++) {
        console.log(this.personList);
        if (this.personList[i].dictValue == data) {
          this.form.storeName = this.personList[i].dictLabel;
          this.form.storeCode = this.personList[i].dictValue;
          this.parameter.storeCode = this.personList[i].dictValue;
          break;
        }
      }
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
        delPickingReturnChild(row.id);
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(index, 1);
      }
      console.log(index, row);
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
    /** 查询借用归还单列表 */
    getList() {
      this.loading = true;
      listPickingReturn(this.queryParams).then((response) => {
        this.pickingReturnList = response.rows;
        if (this.pickingReturnList) {
          for (var i = 0; i < this.pickingReturnList.length; i++) {
            if (this.pickingReturnList[i].packType == 0) {
              this.pickingReturnList[i].packType = "借用型";
            } else {
              this.pickingReturnList[i].packType = "耗用型";
            }
            if (this.pickingReturnList[i].storeName == 0) {
              this.pickingReturnList[i].storeName = "项目库";
            } else {
              this.pickingReturnList[i].storeName = "出场库";
            }
          }
        }
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
        djTime: this.getTime(),
        status: "0",
        packType: undefined,
        projectCode: undefined,
        projectName: undefined,
        khCode: undefined,
        khName: undefined,
        returnStoreCode: undefined,
        returnStoreName: undefined,
        flowNo: undefined,
        nodeNo: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        isSp: 0,
        storeCode: "0",
        storeName: "0",
        packType: 0,
      };
      this.tableData = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    selectchild(row) {
      this.$nextTick(() => {
        //检查是否存在重复数据
        for (let i = 0; i < this.tableData.length; i++) {
          if (row.id == this.tableData[i].ckOrderId) {
            this.msgError("信息重复选择!");
            return;
          }
        }
        let goodsInfo = new Object();
        goodsInfo.orderId = row.id;
        goodsInfo.orderDjNumber = row.djNumber;
        goodsInfo.goodsName = row.goodsName;
        goodsInfo.goodsCode = row.goodsCode;
        goodsInfo.goodsDw = row.goodsDw;
        goodsInfo.goodsGg = row.goodsGg;
        goodsInfo.goodsPrice = row.goodsPrice;
        // 订单数量
        goodsInfo.goodsNum = row.surplusNum;
        goodsInfo.goodsMoney = (
          parseFloat(row.goodsNum) * parseFloat(row.goodsPrice)
        ).toFixed(2);
        goodsInfo.ckDjNumber = row.djNumber;
        goodsInfo.ckOrderId = row.id;
        this.tableData.push(goodsInfo);

        this.$refs.selectchild.visible2 = false;
      });
    },
    handleEdit(index, row) {
      console.log(row);

      if (
        row.goodsNum != "" &&
        row.goodsNum != null &&
        row.goodsNum != undefined
        // row.goodsPrice != "" &&
        // row.goodsPrice != null &&
        // row.goodsPrice != undefined
      ) {
        if (
          row.goodsPrice != "" &&
          row.goodsPrice != null &&
          row.goodsPrice != undefined
        ) {
          row.goodsMoney = (
            parseFloat(row.goodsNum) * parseFloat(row.goodsPrice)
          ).toFixed(2);
        }
      } else {
        this.msgError("!请输入数量");
      }
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
      this.title = "添加借用归还单";
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getPickingReturn(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改借用归还单";
        listPickingReturnChild(this.form.djNumber).then((response) => {
          this.tableData = response.rows;
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].oldGoodsNum = this.tableData[i].goodsNum;
          }
        });
        systemFileList(this.form.djNumber).then((response) => {
          this.fileList = response.rows;
        });
      });
    },
    //批量选择数据
    selectchildMore(rows) {
      this.$nextTick(() => {
        //检查是否存在重复数据

        for (let i = 0; i < rows.length; i++) {
          let row = rows[i];
          let info = new Object();
          for (let ii = 0; ii < this.tableData.length; ii++) {
            if (row.id == this.tableData[ii].ckOrderId) {
              this.msgError("信息重复选择!");
              return;
            }
          }
          info.orderId = row.id;
          info.orderDjNumber = row.djNumber;
          info.goodsName = row.goodsName;
          info.goodsCode = row.goodsCode;
          info.goodsDw = row.goodsDw;
          info.goodsGg = row.goodsGg;
          // 开始数量
          info.goodsNum = row.goodsNum;
          info.goodsPrice = row.goodsPrice;
          info.goodsNum = row.surplusNum;
          info.goodsMoney = (
            parseFloat(row.goodsNum) * parseFloat(row.goodsPrice)
          ).toFixed(2);
          info.ckDjNumber = row.djNumber;
          info.ckOrderId = row.id;
          this.tableData.push(info);
          console.log(this.tableData);
        }
        this.$refs.selectchild.visible2 = false;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.tableData.length == 0) {
            this.msgError("检查明细必填项!");
            return;
          } else {
            // for (let i = 0; i < this.tableData.length; i++) {
            //   if (
            //     this.tableData[i].goodsCode == "" ||
            //     this.tableData[i].goodsName == "" ||
            //     this.tableData[i].goodsNum == "" ||
            //     this.tableData[i].goodsPrice == ""
            //   ) {
            //     this.msgError("检查明细必填项!");
            //     return;
            //   }
            // }
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
            updatePickingReturn(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPickingReturn(this.form).then((response) => {
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
        '是否确认删除借用归还单编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delPickingReturn(ids);
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
      this.$confirm("是否确认导出所有借用归还单数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportPickingReturn(queryParams);
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
