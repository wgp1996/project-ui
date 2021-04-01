<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="单号" prop="djNumber">
        <el-input
          v-model="queryParams.djNumber"
          placeholder="请输入单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="单据日期" prop="djTime">
        <el-input
          v-model="queryParams.djTime"
          placeholder="请输入单据日期"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="供货商编码" prop="khCode">
        <el-input
          v-model="queryParams.khCode"
          placeholder="请输入供货商编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="供货商名称" prop="khName">
        <el-input
          v-model="queryParams.khName"
          placeholder="请输入供货商名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="项目编码" prop="projectCode">
        <el-input
          v-model="queryParams.projectCode"
          placeholder="请输入项目编码"
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
      <!-- <el-form-item label="流程号" prop="flowNo">
        <el-input
          v-model="queryParams.flowNo"
          placeholder="请输入流程号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="节点编号" prop="nodeNo">
        <el-input
          v-model="queryParams.nodeNo"
          placeholder="请输入节点编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="是否审批" prop="isSp">
        <el-input
          v-model="queryParams.isSp"
          placeholder="请输入是否审批"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
        <!-- <el-form-item label="启用审批" prop="isSp">
              <el-radio-group v-model="form.isSp">
                <el-radio :label="0">不启用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:purchaseWare:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:purchaseWare:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:purchaseWare:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:purchaseWare:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="purchaseWareList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <el-table-column label="单号" align="center" prop="djNumber" />
      <el-table-column label="单据日期" align="center" prop="djTime" />
      <el-table-column label="状态" align="center" prop="statusName" />
      <el-table-column label="供货商编码" align="center" prop="khCode" />
      <el-table-column label="供货商名称" align="center" prop="khName" />
      <el-table-column label="项目编码" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <!-- <el-table-column label="流程号" align="center" prop="flowNo" /> -->
      <!-- <el-table-column label="节点编号" align="center" prop="nodeNo" /> -->
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="制单人" align="center" prop="createBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:purchaseWare:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:purchaseWare:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改采购入库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单号" prop="djNumber">
          <el-input v-model="form.djNumber" placeholder="自动生成" :disabled="true"/>
        </el-form-item>
           <el-form-item label="供货商" prop="khName">
              <el-input v-model="form.khName" placeholder="请选择供货商" :disabled="true"/>
               <el-button
                icon="el-icon-plus"
                type="primary"
                style="position: absolute; right: 0px; top: 0px"
                @click="supplierSelect"
              ></el-button>
            </el-form-item>
            <el-form-item label="隶属项目" prop="projectName">
               <el-input v-model="form.projectName" placeholder="请选择隶属项目" :disabled="true"/>
                 <el-button
                icon="el-icon-plus"
                type="primary"
                style="position: absolute; right: 0px; top: 0px"
                @click="projectSelect"
              ></el-button>
            </el-form-item>
        <el-form-item label="单据日期" prop="djTime">
          <el-input v-model="form.djTime" placeholder="请输入单据日期" />
        </el-form-item>
         <el-form-item label="启用审批" prop="isSp">
              <el-radio-group v-model="form.isSp">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">不启用</el-radio>
              </el-radio-group>
            </el-form-item>
        <!-- <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <!-- <el-form-item label="供货商编码" prop="khCode">
          <el-input v-model="form.khCode" placeholder="请输入供货商编码" />
        </el-form-item> -->
        <!-- <el-form-item label="供货商名称" prop="khName">
          <el-input v-model="form.khName" placeholder="请输入供货商名称" />
        </el-form-item> -->
        <!-- <el-form-item label="项目编码" prop="projectCode">
          <el-input v-model="form.projectCode" placeholder="请输入项目编码" />
        </el-form-item> -->
        <!-- <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称" />
        </el-form-item> -->
        <!-- <el-form-item label="流程号" prop="flowNo">
          <el-input v-model="form.flowNo" placeholder="请输入流程号" />
        </el-form-item> -->
        <!-- <el-form-item label="节点编号" prop="nodeNo">
          <el-input v-model="form.nodeNo" placeholder="请输入节点编号" />
        </el-form-item> -->
        <!-- <el-form-item label="是否审批" prop="isSp">
          <el-input v-model="form.isSp" placeholder="请输入是否审批" />
        </el-form-item> -->
      </el-form>
      </el-tab-pane>
       <el-tab-pane label="入库明细" name="second">
           <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="goodsSelectchild"
                >引入采购订单</el-button
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
              label="物资编码"
              width="120"
            >
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.goodsCode"
                  placeholder="物资编码"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="orderDjType"
              label="订单类型"
              width="120"
            >
              <template scope="scope">
                <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.orderDjType"
                  :placeholder="saveType"
                  ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="物资名称" width="120">
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
            
            <el-table-column prop="goodsNum" label="订单数量" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.goodsNum"
                  :readonly="DingDan"
                  placeholder="请输入数量"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <!-- <span>{{ scope.row.goodsNum }}</span> -->
              </template>
            </el-table-column>
            <el-table-column prop="goodsDhNum" label="到货数量" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.goodsDhNum"
                  :readonly="DaoHuo"
                  placeholder="请输入数量"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
                <!-- <span>{{ scope.row.goodsNum }}</span> -->
              </template>
            </el-table-column>
             <!-- <el-table-column prop="goodsPrice" label="单价" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.goodsPrice"
                  
                  placeholder="单价"
                    @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
           <el-table-column prop="goodsMoney" label="金额" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.goodsMoney"
                  placeholder="金额信息"
                  :readonly="true"
                ></el-input>
              </template>
            </el-table-column> -->
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
          </el-tab-pane >
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
       </el-tabs >
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
       <goods-select
      v-if="selectProjectDialog"
      ref="selectProject"
      @selectData="selectData"
    ></goods-select>
    <!-- 供货商 -->
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
      :system="this.form.khCode"
    ></child-select>
  </div>
</template>

<script>
import { listPurchaseWare, getPurchaseWare, delPurchaseWare, addPurchaseWare, updatePurchaseWare, exportPurchaseWare } from "@/api/system/purchaseWare";
import { getToken } from "@/utils/auth";
import {
  systemFileList,  delFileInfo,
} from "@/api/system/projectInfo";
import childSelect from "./childSelect";
import goodsSelect from "./goodsSelect";
import supplierSelect from "./supplierSelect";
import { listPurchaseWareChild, getPurchaseWareChild, delPurchaseWareChild, addPurchaseWareChild, updatePurchaseWareChild, exportPurchaseWareChild } from "@/api/system/purchaseWareChild";
export default {
  name: "PurchaseWare",
    components: {
    goodsSelect, supplierSelect,childSelect
  },
  data() {
    return {
      // 保存类型
      saveType:'',
      fileList: [],
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
      tableData:[],
      selectProjectDialog: false,
      selectSupplierSelectDialog:false,
      selectGoodsDialogchild:false,
      activeName:'first',
      // 遮罩层
      loading: true,
      DingDan:false,
      DaoHuo:false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 采购入库表格数据
      purchaseWareList: [],
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
        khCode: undefined,
        khName: undefined,
        projectCode: undefined,
        projectName: undefined,
        flowNo: undefined,
        nodeNo: undefined,
        isSp: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         projectName:[{required:true,message:"项目名称不能为空", trigger: "blur"}],
        khName:[{required:true,message:"供货商不能为空", trigger: "blur"}],
        isSp:[{required:true,message:"请选择是否审批", trigger: "blur"}],
        djType:[{required:true,message:"请选择类型", trigger: "blur"}],
        djTime:[{required:true,message:"请选择时间", trigger: "blur"}]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
      console.log("删除:" + file.id);
      if (file.id != null && file.id != "" && file.id != undefined) {
        delFileInfo(file.id);
      }
      this.fileList = fileList;
      console.log(fileList);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    /** 查询采购入库列表 */
    getList() {
      this.loading = true;
      listPurchaseWare(this.queryParams).then(response => {
        this.purchaseWareList = response.rows;
        // console.log(this.purchaseWareList.length)
        if(this.purchaseOrderList){
            for(var i=0;i< this.purchaseOrderList.length;i++){
             if(this.purchaseOrderList[i].isSp==0){
                 this.purchaseOrderList[i].isSp="未启用"
             }else{
                this.purchaseOrderList[i].isSp="启用"
             }
           }
        }else{
          
        }
        this.total = response.total;
        this.loading = false;
      });
    },
          /** 选择供货商 */
    supplierSelect() {
      this.selectSupplierSelectDialog = true;
      this.$nextTick(() => {
        console.log(this.$refs.selectSupplier)
        this.$refs.selectSupplier.visible1 = true;
      });
    },
        // 供货商产地数据
     selectDataSupplie(row) {
       console.log(row);
      this.$nextTick(() => {
        this.form.khCode=row.khCode
        this.form.khName=row.khName
        this.$refs.selectSupplier.visible1 = false;
      });
    },
       /** 选择项目 */
    projectSelect() {
      this.selectProjectDialog = true;
      this.$nextTick(() => {
         console.log(this.$refs.selectProject)
        this.$refs.selectProject.visible = true;
      });
    },
            /** 选择项目产地数据 */
    selectData(row) {
      this.$nextTick(() => {
         console.log(this.$refs.selectProject)
        this.form.projectName=row.projectName
         this.form.projectCode=row.projectCode
        this.$refs.selectProject.visible = false;
      });
    },
    selectchild(row) {
      this.$nextTick(() => {
        let goodsInfo = new Object();
        goodsInfo.orderId = row.id;
        goodsInfo.orderDjNumber = row.djNumber;
        goodsInfo.goodsName = row.goodsName;
        goodsInfo.goodsCode = row.goodsCode;
        goodsInfo.goodsDw   = row.goodsDw;
        goodsInfo.goodsGg   = row.goodsGg;
        // 订单数量
        goodsInfo.goodsNum  = row.surplusNum;
        // 到货数量
        goodsInfo.goodsDhNum = row.goodsNum;
        goodsInfo.goodsMoney = row.goodsMoney;
        this.tableData.push(goodsInfo);
        if(row.djType=="0"){
           this.DingDan=true
           this.DaoHuo=false
           goodsInfo.orderDjType="直入直出型"
        
        }else if(row.djType=="1"){
               this.DingDan=false
               this.DaoHuo=false
               goodsInfo.orderDjType="库管型"
            
        }
        this.$refs.selectchild.visible2 = false;
      });
    },
     //批量选择数据
    selectchildMore(rows) {
      this.$nextTick(() => {
        for (let i = 0; i < rows.length; i++) {
          let row = rows[i];
          let info = new Object();
             info.orderId = row.id;
            info.orderDjNumber = row.djNumber;
            info.goodsName = row.goodsName;
            info.goodsCode = row.goodsCode;
            info.goodsDw   = row.goodsDw;
            info.goodsGg   = row.goodsGg;
            // 订单数量
            info.goodsNum  = row.surplusNum;
            // 到货数量
            info.goodsDhNum = row.goodsNum;
            info.goodsMoney = row.goodsMoney;
            if(row.djType=="0"){
              this.DingDan=true
              this.DaoHuo=false
               goodsInfo.orderDjType="直入直出型"
            }else if(row.djType=="1"){
                this.DingDan=false
                 this.DaoHuo=false
                  goodsInfo.orderDjType="库管型"
            }
          this.tableData.push(info);
        }
        this.$refs.selectchild.visible2 = false;
      });
    },
           /** 操作 */
    goodsSelectchild() {
      this.selectGoodsDialogchild = true;
      this.$nextTick(() => {
        this.$refs.selectchild.visible2 = true;
      });
    },
    // 删除字表信息
      handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        delPurchaseWareChild(row.id);
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(index, 1);
      }
      console.log(index, row);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        djNumber: undefined,
        djTime: this.getTime(),
        status: "0",
        khCode: undefined,
        khName: undefined,
        projectCode: undefined,
        projectName: undefined,
        flowNo: undefined,
        nodeNo: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        isSp: 0
      };
      this.resetForm("form");
        this.tableData = [];
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加采购入库";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPurchaseWare(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改采购入库";
        listPurchaseWareChild(this.form.djNumber).then((response) => {
          this.tableData = response.rows;
             for (let i = 0; i < this.tableData.length; i++) {
                 if( this.tableData[i].orderDjType=="0"){
                          this.tableData[i].orderDjType="直入直出型"
                     }else if( this.tableData[i].orderDjType=="1"){
                         this.tableData[i].orderDjType="库管型"
                     }
                  }
               
        });
         systemFileList(this.form.djNumber).then((response) => {
          this.fileList = response.rows;
        });
      });
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
      //追加子表必填样式
    starAdd(obj) {
      if (obj.columnIndex === 0||obj.columnIndex === 1||obj.columnIndex === 2||obj.columnIndex === 3) {
        return "star";
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            if(this.tableData.length==0){
                  this.msgError("检查明细必填项!");
                  return;
          }else{
                for (let i = 0; i < this.tableData.length; i++) {
                  if (
                    this.tableData[i].goodsCode == "" ||
                     this.tableData[i].goodsName == "" ||
                    this.tableData[i].goodsNum == ""||
                    this.tableData[i].goodsDhNum == ""
                  ) {
                    this.msgError("检查明细必填项!");
                    return;
                  }else{
                     if( this.tableData[i].orderDjType=="直入直出型"){
                          this.tableData[i].orderDjType="0"
                     }else if( this.tableData[i].orderDjType=="库管型"){
                         this.tableData[i].orderDjType="1"
                     }
                  }
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
            updatePurchaseWare(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPurchaseWare(this.form).then(response => {
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
      this.$confirm('是否确认删除采购入库编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPurchaseWare(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有采购入库数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPurchaseWare(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style >
table th.star div::after {
  content: "*";
  color: red;
}
</style>