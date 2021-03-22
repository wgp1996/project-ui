<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
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
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="岗位状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['system:enginnerApply:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:enginnerApply:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:enginnerApply:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:enginnerApply:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工程编号" align="center" prop="engineerCode" />
      <el-table-column label="工程名称" align="center" prop="engineerName" />
      <el-table-column label="施工面积" align="center" prop="enginnerArea" />
      <el-table-column label="联系人" align="center" prop="enginnerLxr" />
      <!-- <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" /> -->
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:enginnerApply:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:enginnerApply:remove']"
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

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
         <el-tabs v-model="activeName" @tab-click="handleClick">
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
                    <el-form-item label="工程编号" prop="engineerCode" style="float:left;width:50%;color:red" class="redItem">
                        <el-input v-model="form.engineerCode" placeholder="手工录入工程编号" />
                      </el-form-item>
                        <el-form-item label="" prop="isFormal" style="float:left;width:25%" label-width="50px">
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

                       <el-form-item label="" prop="isZb" style="float:left;width:25%" label-width="50px">
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
                <el-input v-model="form.engineerName" placeholder="请输入工程名称" />
              </el-form-item>
            
              <el-form-item label="建设内容" prop="createContent">
                <el-input v-model="form.createContent" type="textarea" placeholder="请输入内容" />
              </el-form-item>
          
       </el-tab-pane>
   <!-- 第二个 -->
    <el-tab-pane label="制定项目部" name="second">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="goodsSelect">选项目部</el-button>
            </el-col>
          
           </el-row>
             <el-table
                  :data="tableData"
                  class="tb-edit"
                  style="width: 100%"
                  highlight-current-row
                  @row-click="handleCurrentChange"
                  :header-cell-class-name="starAdd"
          >
              <el-table-column prop="deptCode" label="项目部编码" width="200">
                    <template scope="scope">
                 <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.deptCode"
                  placeholder="请输入项目编码"
                ></el-input>
                <!-- <span>{{scope.row.goodsCode}}</span> -->
                 </template >
            </el-table-column>
         
            <el-table-column prop="deptName" label="项目部名称" width="150">
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
             <el-table-column prop="enginnerNum" label="工程分项编号" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.enginnerNum"
                  placeholder="请输入单位信息"
                ></el-input>
                <!-- <span>{{scope.row.enginnerNum}}</span> -->
              </template>
            </el-table-column>
            <el-table-column label="备注" width="150" prop="remark">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.remark"
                  placeholder="请输入备注"
                ></el-input>
                <!-- <span>{{scope.row.remark}}</span> -->
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
                <el-button
                  size="small"
                  type="danger"
                  @click="handleChildDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table> 
     </el-tab-pane>
     <!-- 第三个 -->
      <el-tab-pane label="工程信息" name="third">
           <el-form-item label="工程地址" prop="engineerAddress">
                <el-input v-model="form.engineerAddress" placeholder="请输入工程地址" />
               </el-form-item>
                <el-form-item label="建设单位" prop="engineerUnit">
                   <el-select
                            v-model="form.engineerUnit"
                            placeholder="请选择建设单位"
                            filterable
                            style="width: 100%"
                            @change="selectengineerUnit"
                          >
                              <el-option
                                    v-for="dict in khList"
                                    :key="dict.khCode"
                                    :label="dict.khName"
                                    :value="dict.khCode"
                                  >
                                  <span style="width: 100%">{{ dict.khName }}</span>
                                </el-option>
                            </el-select>
               </el-form-item>
               <div class="clearfix">
                    <el-form-item label="联系人" prop="enginnerLxr" style="float:left;width:50%;" >
                        <el-input v-model="form.enginnerLxr" placeholder="联系人" />
                      </el-form-item>
                       <el-form-item label="联系电话" prop="enginnerLxrPhone" style="float:left;width:50%;" >
                        <el-input v-model="form.enginnerLxrPhone" placeholder="联系电话" />
                      </el-form-item>
                  
             </div>
               <div class="clearfix">
                        <el-form-item label="计划工期" prop="enginnerTime" style="float:left;width:50%;" >
                            <el-input v-model="form.enginnerTime" placeholder="请输入计划工期" />
                      </el-form-item>
                    
                       <el-form-item label="施工面积" prop="enginnerArea" style="float:left;width:50%;">
                        <el-input v-model="form.enginnerArea" placeholder="施工面积" />
                      </el-form-item>
                    
             </div>
              <div class="clearfix">
                  
                   <el-form-item label="开始时间" prop="enginnerStartTime" style="float:left;width:50%;">
                        <el-date-picker
                            style="width: 100%"
                            v-model="form.enginnerStartTime"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                       ></el-date-picker>
                   </el-form-item>
                   <el-form-item label="结束时间" prop="enginnerEndTime" style="float:left;width:50%;">
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
                 <el-form-item label="泵房设备" prop="enginnerDevice" >
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
              <el-form-item label="备注" prop="remark" >
                <el-input type="textarea" rows=2 v-model="form.remark" placeholder="" />
              </el-form-item>
        </el-tab-pane> 
        <!-- 第四个 -->
        <el-tab-pane label="总包合同" name="fourth">
              <el-form-item label="有无总包" prop="isZb" style="float:left;width:50%" >
                          <el-select
                            v-model="form.contractUserCode"
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
              <el-form-item label="总包单位" prop="isZb" style="float:left;width:100%" >
                          <el-select
                            v-model="form.contractUserCode"
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
             <el-col :span="12">
              <el-form-item label="合同金额" prop="postCode" >
                        <el-input v-model="form.postCode" placeholder="合同金额" />
               </el-form-item>
             </el-col>
              <el-col :span="12">
               <el-form-item label="合同状态" prop="status" >
                        <el-select
                            v-model="form.status"
                            placeholder="请选择"
                            filterable
                            style="width: 100%"
                          >
                                  <el-option
                                    v-for="dict in htOptions"
                                    :key="dict.dictValue"
                                    :label="dict.dictLabel"
                                    :value="dict.dictValue"
                                  >
                                  <span style="width: 100%">{{ dict.dictLabel }}</span>
                                </el-option>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
  </el-dialog>
     <goods-select v-if="selectGoodsDialog" ref="selectGoods" @selectData="selectData"  @selectDataMore="selectDataMore"></goods-select>
  </div>
</template>

<script>
// import { listPost, getPost, delPost, addPost, updatePost, exportPost } from "@/api/system/post";
import { listEnginnerApply, getEnginnerApply, delEnginnerApply, addEnginnerApply, updateEnginnerApply, exportEnginnerApply } from "@/api/system/enginnerApply";
import {
  listKh,
} from "@/api/system/kh";
import { listEnginnerByEnginner,delEnginnerApplyChild } from "@/api/system/enginnerApplyChild";
import { systemFileList } from "@/api/system/projectInfo";

import goodsSelect from "./goodsSelect";
import { getToken } from "@/utils/auth";
 var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入数字'));
        } else if (!/^[1-9][0-9]*$/.test(value)) {
             callback(new Error('输入数字必须大于0且不能为小数'));
         }else{
             callback();
         }
      };
export default {
  name: "Post",
  components: {
    goodsSelect,
  },
  
  data() {
    return {
      activeName:'first',
      selectGoodsDialog: false,
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
      // 数据
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
      // 岗位表格数据
      postList: [],
      // 签订状态
      statusOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
       // 合同状态
       htOptions: [],
      // 总包合同
      contractOptions:[],
      // 项目来源
      projectfromOptions:[],
      // 是否正式编号
      formOptions:[],
      // 建设单位
      khList:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        postCode: undefined,
        postName: undefined,
        status: undefined,
        engineerCode: undefined,  
        engineerName: undefined
      },
      // 表单参数
      form: {},
      
      // 表单校验
      rules: {
        engineerName: [
          { required: true, message: "工程名称不能为空", trigger: "blur" }
        ],
        engineerCode: [
          { required: true, message: "工程编码不能为空", trigger: "blur" }
        ],
        postSort: [
          { required: true, message: "岗位顺序不能为空", trigger: "blur" }
        ],
        enginnerTime:[{validator: validatePass, trigger: 'blur'}]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_apply_code").then(response => {
      console.log(response)
      this.statusOptions = response.data;
    });
     this.getDicts("sys_apply_contract").then(response => {
 
      this.contractOptions = response.data;
    });
      this.getDicts("sys_tatus").then(response => {
 
      this.statusOptions = response.data;
    });
      this.getDicts("sys_project_from").then(response => {
        this.projectfromOptions = response.data;
        console.log(response)
    });
     this.getDicts("sys_projectcode_from").then(response => {
        this.formOptions = response.data;
        console.log(response)
    });
       this.getDicts("sys_ht_status").then(response => {
        this.htOptions = response.data;
    
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
    handleRemove(file, fileList) {
      // console.log("删除:" + file.id);
      if (file.id != null && file.id != "" && file.id != undefined) {
        delFileInfo(file.id);
      }
      this.fileList = fileList;
    
    },
      submitUpload() {
      this.$refs.upload.submit();
    },
    goodsSelect() {
      this.selectGoodsDialog = true;
      this.$nextTick(() => {
        this.$refs.selectGoods.visible = true;
      });
    },
    // 选择建设单位
    selectengineerUnit(data){
     console.log(data)
     for(var i=0;i<this.khList.length;i++){
       if(this.khList[i].khCode==data){
          this.form.engineerUnit = this.khList[i].khName;
       }
     }
    },
   //选择数据
    selectData(row) {
        this.$nextTick(() => {
        //检查是否存在重复数据
        // for (let i = 0; i < this.tableData.length; i++) {
        //   if (row.goodsCode == this.tableData[i].goodsCode) {
        //     this.msgError("信息重复!");
        //     return;
        //   }
        // }
        console.log(row)
        let goodsInfo = new Object();
        goodsInfo.deptCode = row.deptId;
        goodsInfo.deptName = row.deptName;
        goodsInfo.enginnerNum='';
        goodsInfo.remark='';
        this.tableData.push(goodsInfo);
        this.$refs.selectGoods.visible = false;
      });
    },
         //批量选择数据
    selectDataMore(rows) {
 
       this.$nextTick(() => {
        //检查是否存在重复数据
        // for (let i = 0; i < this.tableData.length; i++) {
        //   if (row.goodsCode == this.tableData[i].goodsCode) {
        //     this.msgError("信息重复!");
        //     return;
        //   }
        // }
        for(let i=0;i<rows.length;i++){
            let row=rows[i];
             let goodsInfo = new Object();
              goodsInfo.deptCode = row.deptId;
              goodsInfo.deptName = row.deptName;
              goodsInfo.enginnerNum='';
              goodsInfo.remark='';
              this.tableData.push(goodsInfo);
        }
        this.$refs.selectGoods.visible = false;
      });
    },
     handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        delEnginnerApplyChild(row.id);
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(index, 1);
      }
      console.log(index, row);
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      listEnginnerApply(this.queryParams).then(response => {
        console.log(response)
        this.postList = response.rows;
    
        this.total = response.total;
        this.loading = false;
      });
       listKh(this.queryParams).then((response) => {
         console.log(response)
        this.khList = response.rows;
        
      });
    },
       //追加子表必填样式
    starAdd(obj) {
      if (obj.columnIndex === 7 || obj.columnIndex === 8) {
        return "star";
      }
    },
    // 岗位状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
        postId: undefined,
        postCode: undefined,
        postName: undefined,
        postSort: '',
        status: "0",
        remark: undefined,
        implementUserCode:"0",
        contractUserCode:"0",
        isFormal:'0',
        engineerFrom:'0',
        engineerCode:'', engineerName:'', 
        createContent:'',  engineerAddress:'',  
         engineerUnit:'',  enginnerLxr:'', 
         enginnerDevice:'',  enginnerArea:'', 
         enginnerStartTime:'',  enginnerEndTime:'',
         enginnerLxrPhone:'',
         rows:'',
         status:'0',
        //  是否生成总包合同
         isZb:'0'
      };
      this.resetForm("form");
      this.tableData = [];
    },
    handleClick(tab, event) {
        console.log(tab, event);
      },
     handleCurrentChange(row, event, column) {
      // console.log(row, event, column, event.currentTarget);
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
      this.title = "立项申请单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const postId = row.id || this.ids
      getEnginnerApply(postId).then(response => {
        this.form = response.data;
         this.form.isFormal= this.form.isFormal+"";
          this.form.isZb= this.form.isZb+"";
        listEnginnerByEnginner(this.form.engineerCode).then(response => {
        
          console.log(response)
           this.tableData = response.rows;
      });
         this.open = true;
         this.title = "修改单据";
      });
    
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
             //检查子表信息
        for (let i = 0; i < this.tableData.length; i++) {
          if (
            this.tableData[i].engineerCode  == "" ||
            this.tableData[i].engineerName == "" 
          ) {
            this.msgError("检查明细信息必填项!");
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
          console.log(fileList)
          this.form.fileRows = JSON.stringify(fileList);
         this.form.rows = JSON.stringify(this.tableData);
          if (this.form.id != undefined) {
            updateEnginnerApply(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addEnginnerApply(this.form).then(response => {
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
      const postIds = row.id || this.ids;
      this.$confirm('是否确认删除岗位编号为"' + postIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delEnginnerApply(postIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有岗位数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportEnginnerApply(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style>
  .clearfix{
      clear: both;
      display: block;
      overflow: hidden;
      content:'';
  }
    .redItem .el-form-item__label{
        color: red;
    }
</style>