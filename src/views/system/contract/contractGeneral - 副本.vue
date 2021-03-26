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
      <el-form-item label="合同乙方" prop="projectYpersonName" >
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:contractGenera:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:contractGenera:edit']"
          >修改</el-button
        >
      </el-col>
       <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:contractGenera:remove']"
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
          v-hasPermi="['system:contractGenera:effect']"
          >提交</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleCancel"
          v-hasPermi="['system:contractGenera:cancel']"
          >取消提交</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:contractGenera:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>

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
      <!-- <el-table-column
        label="合同丙方"
        align="center"
        prop="projectBpersonName"
      /> -->
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
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:contractGenera:remove']"
            >删除</el-button
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

    <!-- 添加或修改总包合同对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
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
            <el-form-item label="合同甲方" prop="projectJpersonCode">
              <!-- <el-input v-model="form.projectJpersonCode" placeholder="请输入甲方编码" /> -->
              <el-select
                v-model="form.projectJpersonCode"
                placeholder="请选择合同甲方"
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
           <div class="clearfix">
            <el-form-item label="合同乙方" prop="projectYpersonCode" style="width:80%;float:left">
              <el-select
                v-model="form.projectYpersonCode"
                placeholder="请选择合同乙方"
                filterable
                style="width: 100%"
                @change="selectPersonY"
              
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
             <el-form-item style="width:20%;float:left">
               <el-checkbox v-model="radio"  @change="control" style="position: relative;left: -100px">多方合同</el-checkbox>
            </el-form-item>
            </div>
            <el-form-item label="合同丙方" prop="projectBpersonCode">
              <el-select
                v-model="form.projectBpersonCode"
                placeholder="请选择合同丙方"
                filterable
                style="width: 100%"
                @change="selectPersonB"
                :disabled="show"
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
            <el-form-item label="合同总额" prop="contractMoney">
              <el-input
                v-model="form.contractMoney"
                placeholder="请输入合同总额"
                @change="savetwo"
              />
            </el-form-item>
             <el-form-item label="启用审批" prop="isSp">
              <el-radio-group v-model="form.isSp">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">不启用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" />
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
        <!-- 第四个 -->
          <el-tab-pane label="预算执行比对" name="forth">
          <el-form ref="projectForm" :model="projectForm" label-width="140px">
            <el-form-item label="项目预算收入" prop="projectCode" style="width:47%;float:left">
              <el-input
            
                :readonly="true"
                placeholder="请输入项目预算收入"
              />
              <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
            <el-form-item label="项目动态收入" prop="projectName" style="width:47%;float:left">
              <el-input
                :readonly="true"
            
                placeholder="请输入项目动态收入"
              />
               <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
            <el-form-item label="设定预算毛利率" prop="projectNameJc" style="width:47%;float:left">
              <el-input
                :readonly="true"
      
                placeholder="设定预算毛利率"
              />
                    <span style="position:absolute;right:-20px;top:0px">%</span>
            </el-form-item>
            <el-form-item label="动态毛利率" prop="projectType" style="width:47%;float:left">
              <el-input
                :readonly="true"
          
                placeholder="动态毛利率"
              />
              <span style="position:absolute;right:-20px;top:0px">%</span>
            </el-form-item>
            <el-form-item label="项目预算毛利" prop="projectManagerName" style="width:47%;float:left">
              <el-input
                :readonly="true"
              
                placeholder="项目经理"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
            <el-form-item label="项目动态毛利" prop="projectStartTime" style="width:47%;float:left">
              <el-input
                :readonly="true"
             
                placeholder="项目经理"
              />
                   <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
            <el-form-item label="销项税率" prop="projectEndTime" style="width:47%;float:left">
              <el-input
                :readonly="true"
              
                placeholder="请输入销项税率"
              />
                   <span style="position:absolute;right:-20px;top:0px">%</span>
            </el-form-item>
            <el-form-item label="销项税率" style="width:47%;float:left">
               <el-input
                :readonly="true"
          
                placeholder="请输入销项税率"
              />
                    <span style="position:absolute;right:-20px;top:0px">%</span>
            </el-form-item>
             <el-form-item label="项目预算税金" style="width:47%;float:left">
               <el-input
                :readonly="true"
             
                placeholder="请输入项目预算税金"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
             <el-form-item label="项目动态税金" style="width:47%;float:left">
               <el-input
                :readonly="true"
           
                placeholder="请输入项目预算税金"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
            <el-form-item label="项目预算总成本" style="width:47%;float:left">
              <el-input
                :readonly="true"
              
                :rows="2"
          
                placeholder="请输入项目预算总成本"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
            <el-form-item label="项目动态总成本" style="width:47%;float:left">
              <el-input
                :readonly="true"
            
                :rows="2"
           
                placeholder="请输入项目动态总成本"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
             <el-form-item label="项目预算纯利" style="width:47%;float:left">
              <el-input
                :readonly="true"
            
                :rows="2"
       
                placeholder="请输入项目预算纯利"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
             <el-form-item label="项目动态纯利" style="width:47%;float:left">
              <el-input
                :readonly="true"
        
                :rows="2"
        
                placeholder="请输入项目动态纯利"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
             <el-form-item label="成本类预算" style="width:47%;float:left">
              <el-input
                :readonly="true"
              
                :rows="2"
          
                placeholder="请输入成本类预算"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
             <el-form-item label="成本类总计" style="width:47%;float:left">
              <el-input
                :readonly="true"
      
                :rows="2"
     
                placeholder="请输入成本类总计"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
             <el-form-item label="劳务预算" style="width:47%;float:left">
              <el-input
                :readonly="true"
      
                :rows="2"
           
                placeholder="请输入劳务预算"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
             <el-form-item label="劳务成本" style="width:47%;float:left">
              <el-input
                :readonly="true"
          
                :rows="2"
      
                placeholder="请输入劳务成本"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
             <el-form-item label="材料预算" style="width:47%;float:left">
              <el-input
                :readonly="true"
            
                :rows="2"
         
                placeholder="请输入材料预算"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
             <el-form-item label="材料成本" style="width:47%;float:left">
              <el-input
                :readonly="true"
           
                :rows="2"
          
                placeholder="请输入材料成本"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
            <el-form-item label="其他预算" style="width:47%;float:left">
              <el-input
                :readonly="true"
       
                :rows="2"
          
                placeholder="请输入其他预算"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
            <el-form-item label="其他成本" style="width:47%;float:left">
              <el-input
                :readonly="true"
          
                :rows="2"
           
                placeholder="请输入其他成本"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
            <el-form-item label="间接费用类预算" style="width:47%;float:left">
              <el-input
                :readonly="true"
       
                :rows="2"
           
                placeholder="请输入间接费用类预算"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
            <el-form-item label="间接费用动态合计" style="width:47%;float:left;margin-left:1%">
              <el-input
                :readonly="true"
       
                :rows="2"
               
                placeholder="请输入间接费用动态合计"
              />
                    <span style="position:absolute;right:-20px;top:0px">元</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <project-select
      v-if="selectProjectDialog"
      ref="selectProject"
      @selectData="selectData"
    ></project-select>
  </div>
</template>

<script>
import {
  listContractGenera,
  getContractGenera,
  delContractGenera,
  addContractGenera,
  updateContractGenera,
  exportContractGenera,
  effectContractGenera,
  cancelContractGenera
} from "@/api/system/contractGenera";
import { systemFileList, delFileInfo,getProjectInfoByCode } from "@/api/system/projectInfo";
import { getKhList } from "@/api/system/kh";
import projectSelect from "./projectSelect";
import { getToken } from "@/utils/auth";
export default {
  name: "ContractGenera",
  components: {
    projectSelect,
  },
  data() {
    return {
      activeName: "first",
      fileList: [],
      show:false,
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
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      radio:false,
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
      // 查询参数
      queryParams: {
        pageNum: 1,
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
      projectForm: {},
      // 表单校验
      rules: {
        projectCode: [
          { required: true, message: "请选择合同", trigger: "change" },
        ],
        projectJpersonCode: [
          { required: true, message: "请选择甲方", trigger: "change" },
        ],
        projectYpersonCode: [
          { required: true, message: "请选择乙方", trigger: "change" },
        ],
        contractMoney: [
          { required: true, message: "合同总额不能为空", trigger: "blur" },
        ],
        isSp: [
          { required: true, message: "请选择是否审批", trigger: "blur" },
        ]
      },
    };
  },
  created() {
    this.getList();
    let queryParams = { khType: 2 };
    getKhList(queryParams).then((response) => {
      this.personList = response.rows;
    });
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
    savetwo(val){
        this.form.contractMoney=Number(val).toFixed(2)
    },
    // 单选按钮
    control(val){
       if(val==true){
         this.show=true
         this.form.projectBpersonCode=''
       }else{
          this.show=false
       }
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
    /** 选择项目列表 */
    projectSelect() {
      this.selectProjectDialog = true;
      this.$nextTick(() => {
        this.$refs.selectProject.visible = true;
      });
    },
    selectData(row) {
      this.$nextTick(() => {
        this.form.projectCode = row.projectCode;
        this.form.projectName = row.projectName;
        this.$refs.selectProject.visible = false;
        getProjectInfoByCode(row.projectCode).then((response) => {
          this.projectForm = response.data;
        });
      });
    },
    //选择甲方
    selectPerson(data) {
      //根据编码找名称
      for (let i = 0; i < this.personList.length; i++) {
        if (this.personList[i].khCode == data) {
          this.form.projectJpersonName = this.personList[i].khName;
          break;
        }
      }
    },
    selectPersonY(data) {
      //根据编码找名称
      for (let i = 0; i < this.personList.length; i++) {
        if (this.personList[i].khCode == data) {
          this.form.projectYpersonName = this.personList[i].khName;
          break;
        }
      }
    },
    selectPersonB(data) {
      //根据编码找名称
      for (let i = 0; i < this.personList.length; i++) {
        if (this.personList[i].khCode == data) {
          this.form.projectBpersonName = this.personList[i].khName;
          break;
        }
      }
    },
    /** 查询总包合同列表 */
    getList() {
      this.loading = true;
      listContractGenera(this.queryParams).then((response) => {
        this.contractGeneraList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加总包合同";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getContractGenera(id).then((response) => {
        this.form = response.data;
        systemFileList(this.form.djNumber).then((response) => {
          this.fileList = response.rows;
        });
       getProjectInfoByCode(response.data.projectCode).then((response) => {
          this.projectForm = response.data;
        });
        this.open = true;
        this.title = "修改总包合同";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
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
          if (this.form.id != undefined) {
            updateContractGenera(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addContractGenera(this.form).then((response) => {
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
        '是否确认删除选择的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delContractGenera(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 提交按钮操作 */
    handleEffect(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认提交选中的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return effectContractGenera(ids);
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
      this.$confirm(
        '是否确认取消选中的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return cancelContractGenera(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("取消成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有总包合同数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportContractGenera(queryParams);
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
   .clearfix{
     clear: both;
     overflow: hidden;
     display:block;
   }
</style>