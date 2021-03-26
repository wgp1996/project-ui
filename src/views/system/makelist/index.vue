<template>
  <div class="app-container">
       <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="5" :xs="24">
        <!-- <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div> -->
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="19" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <!-- <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item> -->
          <!-- <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item> -->
        </el-form>

        <!-- <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:user:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:user:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
            >导出</el-button>
          </el-col>
        </el-row> -->
           <el-tabs v-model="activeName" @tab-click="handleClick">
            
            <el-tab-pane label="分享清单" name="first">
                <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                    <el-row :gutter="0">
                        <el-col :span="8">
                           <el-form-item label="流水号" prop="djNumber">
                        
                              <el-input
                                v-model="form.djNumber"
                                placeholder="自动生成"
                                :disabled="true"
                              />
                          </el-form-item>
                          </el-col>
                           <el-col :span="8">
                           <el-form-item label="单据状态" prop="status">
                              <el-input
                                v-model="form.statusName"
                                placeholder="自动生成"
                                :disabled="true"
                              />
                                 </el-form-item>
                          </el-col>
                          <el-col :span="8">
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
                        <el-form-item label="标题" prop="djTitle" class="changeBlue">
                          <el-input
                            v-model="form.djTitle "
                         
                          />
                        </el-form-item>
                      
                        <div class="clearfix">
                        <el-form-item label="申请人"  style="width:32%;float:left" class="changeBlue">
                            <el-input
                               v-model="user.ownerNameJc" :disabled="true"
                               placeholder=""
                          />
                        </el-form-item>
                      </div>
                        <el-form-item label="备注" prop="remark">
                          <el-input
                            v-model="form.remark"
                            placeholder=""
                          />
                        </el-form-item>
                        <el-row :gutter="10" class="mb8">
                            <el-col :span="24"  style="text-align:center">
                              <el-button
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="fensubmitForm"
                                 v-hasPermi="['system:user:add']"
                              >提交</el-button>
                            </el-col>
                         </el-row>
                 </el-form>
          
            </el-tab-pane>
            <el-tab-pane label="清单明细" name="third">
                <el-row :gutter="10" class="mb8" v-if="shower">
                  <el-col :span="1.5">
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      @click="handleAdd"
                      v-hasPermi="['system:user:add']"
                    >新增</el-button>
                  </el-col>
                   <el-col :span="1.5">
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      size="mini"
                      @click="newhandleAdd"
                      :disabled="newsingle"
                      v-hasPermi="['system:user:add']"
                    >新增下级</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button
                      type="success"
                      icon="el-icon-edit"
                      size="mini"
                      :disabled="single"
                      @click="handleUpdate"
                      v-hasPermi="['system:user:edit']"
                    >修改</el-button>
                  </el-col>
                  <el-col :span="1.5">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      :disabled="multiple"
                      @click="handleDelete"
                      v-hasPermi="['system:user:remove']"
                    >删除</el-button>
                  </el-col>
                  <!-- <el-col :span="1.5">
                    <el-button
                      type="info"
                      icon="el-icon-upload2"
                      size="mini"
                      @click="handleImport"
                      v-hasPermi="['system:user:import']"
                    >导入</el-button>
                  </el-col> -->
                  <!-- <el-col :span="1.5">
                    <el-button
                      type="warning"
                      icon="el-icon-download"
                      size="mini"
                      @click="handleExport"
                      v-hasPermi="['system:user:export']"
                    >导出</el-button>
                  </el-col> -->
                </el-row>
                <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange" 
                 :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                   row-key="id"
                  default-expand-all
                 >
                    <el-table-column type="selection" align="center" />
                    <el-table-column label="流水号" align="center" prop="djNumber" />
                    <el-table-column label="分部分项名称" align="center" prop="inventoryName" :show-overflow-tooltip="true" />
                    <el-table-column label="是否生成下级" align="center" prop="isLast" :show-overflow-tooltip="true" />
                    <el-table-column label="父级项目" align="center" prop="projectName" :show-overflow-tooltip="true" />
                    <el-table-column label="制单人" align="center" prop="createBy"  />
                     <el-table-column label="制单时间" align="center" prop="createTime"  />
              
                  </el-table>
            </el-tab-pane>
            <el-tab-pane label="附件" name="fourth">
                 <el-row :gutter="15" class="mb8" v-if="shower">
                    <el-col :span="1.5">
                      <el-upload
                        class="upload-demo"
                        ref="upload"
                        :file-list="fileList"
                        :action="upload.url"
                        :headers="upload.headers"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove"
                        :on-progress="handleprogress"
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
 

    
      </el-col>
    </el-row>


    <!-- 添加或修改岗位对话框 	
parentId-->
    <el-dialog :title="title" :visible.sync="open" width="800px">
        <el-form ref="form1" :model="form1" :rules="rules" label-width="80px">
             <el-form-item label="项目名称" prop="projectName" label-width="110px">
                <el-input v-model="form1.projectName" placeholder=""  :disabled="true"/>
                
               </el-form-item>
           
                    <el-form-item label="分部分项内容" prop="inventoryName" style=";width:100%;color:red"  label-width="110px">
                        <el-input v-model="form1.inventoryName" placeholder="" />
                      </el-form-item>
                     
                      <el-form-item label="父项名称" prop="projectName" style=";width:100%" label-width="110px" v-if="show">
                          <el-input v-model="form1.projectName" placeholder="" />
                      </el-form-item>
                       <el-form-item label="父项名称" prop="projectName" style=";width:100%" label-width="110px" v-if="show1">
                          <el-input  :placeholder="Name" :disabled="true" style="color:#000"/>
                      </el-form-item>
            
              <el-form-item label="是否有下级分项" prop="isLast"  label-width="110px">
                    <el-radio-group v-model="form1.isLast">
                            <el-radio :label="0">无下级</el-radio>
                            <el-radio :label="1">有下级</el-radio>
                     </el-radio-group>
              </el-form-item>
            
              <el-form-item label="单位" prop="inventoryUnit" label-width="110px">
                <el-input v-model="form1.inventoryUnit"  placeholder="请输入内容" />
              </el-form-item>
                <el-form-item label="预算量" prop="inventoryNum" label-width="110px">
                <el-input v-model="form1.inventoryNum" placeholder="请输入预算量" @change="changemoney"/>
              </el-form-item>
                <el-form-item label="预算单价" prop="inventoryPrice" label-width="110px">
                <el-input v-model="form1.inventoryPrice"  placeholder="请输入预算单价" @change="changemoney"/>
              </el-form-item>
               <el-form-item label="预算金额" prop="inventoryMoney" label-width="110px">
                <el-input v-model="form1.inventoryMoney" :disabled="true" placeholder="请输入内容" />
              </el-form-item>
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
import { listUser, getUser, delUser, addUser, updateUser, exportUser, resetUserPwd, changeUserStatus, importTemplate } from "@/api/system/user";
import goodsSelect from "./goodsSelect";
import { getToken } from "@/utils/auth";
import { projectTree} from "@/api/system/projectType";
import { getInfo } from "@/api/login";
import {

  delFileInfo,

} from "@/api/system/projectInfo";
import { listProjectInvent, listProjectInvents, getProjectInvent, addProjectInvent, updateProjectInvent, delProjectInvent, exportProjectInvent} from "@/api/system/projectInvent";
import { listProjectInventory, getProjectInventory, addProjectInventory, updateProjectInventory, delProjectInventory, exportProjectInventory,getProjectInventoryList} from "@/api/system/projectInventory";
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
      shower:false,
      show:false,
      show1:false,
      Name:'',
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
      // 部门树选项
      deptOptions: [],
          // 项目分类树选项
      projectTypeOptions: [],
      defaultProps: {
        children: "children",
        label: "projectTypeName"
      },
       // 部门名称
      deptName: undefined,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 流水号
      djNumber:'',
      // 父级ID
      parentCode:'',
      // 分部分项名称
      inventoryName:'',
      projectName:'',
      // 非单个禁用
      single: true,
      newsingle:true,
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
     // 用户表格数据
      userList: [],
         // 日期范围
      dateRange: [],
      replace:'',
      isLast:'',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        postCode: undefined,
        postName: undefined,
        status: undefined,
        engineerCode: undefined,  
        engineerName: undefined,
        deptId: undefined
      },
      projectCode:'',
      // 表单参数
      form: {
       
         projectCode:'',
         djNumber: '',  status: '', djTime: this.getTime(),  djTitle: '',  remark: '',
      },
         form1 : {
         projectName:'', inventoryName:'',  isLast:0,  inventoryNum:'',  inventoryPrice:'',  inventoryMoney:'',
           projectCode:'',djNumber:'',id:undefined,inventoryUnit:''
         
      },
       //用户信息
      user:{
        ownerCode:"",
        ownerName:"",
        ownerNameJc:"",
      },
      // 表单校验
      rules: {
        djTitle: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
      
        inventoryName: [
          { required: true, message: "分部分项内容不能为空", trigger: "blur" }
        ],
      
        inventoryNum:[
          { required: true, message: "预算量不能为空", trigger: "blur" }
        ],
          inventoryPrice:[
          { required: true, message: "预算单价不能为空", trigger: "blur" }
        ],
          inventoryMoney:[
          { required: true, message: "预算金额不能为空", trigger: "blur" }
        ]
         
      }
      
   
    }
  },
  created() {
    // this.getList();
     this.getTreeselect();
     getInfo().then(response => {
       this.user.ownerNameJc=response.user.nickName;
       
    });

  },
  methods: {
    changemoney(){
      if(this.form1.inventoryNum!=""&&this.form1.inventoryPrice!=""){
          this.form1.inventoryMoney=Number(this.form1.inventoryNum)*Number( this.form1.inventoryPrice )
      }
         
    },
       /** 查询部门下拉树结构 */
    getTreeselect() {
      projectTree(this.queryParams).then(response => {
        console.log(response)
        // this.deptOptions = this.handleTree(response.data, "id", "projectTypePid");;
         this.projectTypeOptions = [];
        const data = { projectTypeId: 0, projectTypeName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "projectTypeId", "projectTypePid");
        this.deptOptions.push(data);
        console.log(this.deptOptions)
      });
    },
     // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
     handleSuccess(res, file, fileList) {
      //  alert("11")
      this.fileList = fileList;
      // 上传成功
      console.log(res);
      console.log(fileList);
              let fileLists = [];
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
            fileLists.push(info);
          }
          this.form.fileRows = JSON.stringify(fileLists);
         addProjectInvent(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("保存成功");
                this.open = false;
                this.shower=true
                this.getList();
                systemFileList(this.form.djNumber).then((response) => {
                  this.fileList = response.rows;
                });
              } else {
                this.msgError(response.msg);
                this.shower=false
              }
            });

    },
   handleprogress(event,file,fileList){
    //  alert("55")
   },
  
    handleRemove(file, fileList) {
      console.log("删除:" + file.id);
        //  console.log("删除:" + fileList);
      
      if (file.id != null && file.id != "" && file.id != undefined) {
        delFileInfo(file.id);
      }
      this.fileList = fileList;
      console.log(fileList);
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
      // alert(this.form.djNumber)
      // alert("100")
        // alert(this.replace)
      if(this.replace==''||undefined){
          this.loading = false;
           return
      }else{
        // alert("3")
         getProjectInventoryList(this.replace).then(response => {
                      // this.userList = response.data;
                      for(var i=0;i<response.data.length;i++){
                         response.data[i].parentCode=Number(response.data[i].parentCode)
                         if(response.data[i].isLast==0){
                           response.data[i].isLast="无下级"
                         }else{
                           response.data[i].isLast="有下级"
                         }
                        
                        }
                     this.userList = this.handleTree(response.data, "id", "parentCode");
                      this.loading = false;
         });
          systemFileList(this.replace).then((response) => {
                  this.fileList = response.rows;
              });

      }
    
    },
      handleNodeClick(data) {
        console.log(data)
         this.projectName= data.projectTypeName
         this.projectCode= data.projectCode
         console.log(this.form.projectCode)
      if(data.projectCode!=""&&data.projectCode!=null){
          if(data.type==1){
              //  alert(data.projectCode)
               this.form1.projectCode= data.projectCode
               listProjectInvents(data.projectCode).then(response => {
                    console.log("999")
                    console.log(response)
                    if(this.form==undefined){
                                this.shower=false
                       }else{
                             this.shower=true
                     }
                     console.log(response.rows)
                if(response.rows.length>0){
                  this.form=response.rows[0];
                  // alert(this.form.djNumber)
                  this.form1.djNumber= this.form.djNumber
                  // alert(this.form1.djNumber)
                  this.replace=this.form.djNumber
                  getProjectInventoryList(this.form.djNumber).then(response => {
                      // this.userList = response.data;
                 
                      for(var i=0;i<response.data.length;i++){
                         response.data[i].parentCode=Number(response.data[i].parentCode)
                          if(response.data[i].isLast==0){
                           response.data[i].isLast="无下级"
                         }else{
                           response.data[i].isLast="有下级"
                         }
                       }
                      this.userList = this.handleTree(response.data, "id", "parentCode");
                      this.loading = false;
                    });
                    // alert("999")
                    // alert(this.form.djNumber)
                      systemFileList(this.form.djNumber).then((response) => {
                            this.fileList = response.rows;
                      });
                }else{
                     this.userList = [];
                     this.reset()
                      this.fileList=[]
                      // alert("2")
                    this.loading = false;
                     this.shower=false
                }
              });
          }else{
            // alert("s")
            this.reset();
            this.userList = [];
             this.fileList=[];
              this.loading = false;
              this.shower=false
          }
     
      }else{
        if(data.type==0){
             this.form.projectCode = '';
        }else if(data.type==1){
             this.form.projectCode = data.projectCode;
        }
      }
      // this.queryParams.deptId = data.id;
   
  
      
      // this.getList();
    },
       //追加子表必填样式
    starAdd(obj) {
      if (obj.columnIndex === 3 || obj.columnIndex === 4) {
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
      this.userList = [];
    },
    editTime(i){
      if(i<10){
      i="0"+i;
      }
      return i;
      },
     getTime(){
        var date=new Date();
        var year=date.getFullYear();//得到当前年份
        var month=this.editTime(date.getMonth()+1);//得到当前月份
        var day=this.editTime(date.getDate());//得到当前几号
        var hour=this.editTime(date.getHours());//得到当前小时
        var min=this.editTime(date.getMinutes());//得到当前分钟
        var seconds=this.editTime(date.getSeconds());//得到当前秒
        var weeks=date.getDay();
        var week;
        switch(weeks){
        case 0:
        week="星期日";
        break;
        case 1:
        week="星期一";
        break;
        case 2:
        week="星期二";
        break;
        case 3:
        week="星期三";
        break;
        case 4:
        week="星期四";
        break;
        case 5:
        week="星期五";
        break;
        case 6:
        week="星期六";
        break;
        }
          return year+"-"+month+"-"+day;
        },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        postId: undefined,
        postCode: undefined,
        postName: undefined,
        postSort: '',
        djNumber: '',  status: '', djTime: this.getTime(),  djTitle: '',  remark: '',
        projectCode:'',
         rows:'',
         status:'0',
        //  是否生成总包合同
         isZb:'0',
     
        //  申请人
         ownerNameJc:''
      };
     this.form1 = {
         projectName:'', inventoryName:'',  isLast:0,  inventoryNum:'',  inventoryPrice:'',  inventoryMoney:'',
         projectCode:'',djNumber:'',id:undefined,inventoryUnit:'',

      };
      this.resetForm("form");
      this.tableData = [];
      // this.userList = [];
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
       this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
      /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection)
      this.ids = selection.map(item => item.id)
       this.djNumber = selection.map(item => item.djNumber)[0]
       this.inventoryName= selection.map(item => item.inventoryName)[0]
      this.projectName= selection.map(item => item.projectName)[0]
       this.isLast= selection.map(item => item.isLast)[0]
      this.single = selection.length!=1
      this.multiple = !selection.length
       if(this.ids==null||this.ids==""){
           this.newsingle=true 
      }else{
           this.newsingle=false
         
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
    //  this.reset();
    this.form1.projectCode=this.projectCode;
    this.form1.projectName=this.projectName;
    this.form1.djNumber= this.form.djNumber
      this.form1.inventoryName='', 
      this.form1.inventoryUnit='', 
      this.form1.inventoryPrice='', 
      this.form1.inventoryMoney='', 
      this.form1.inventoryNum='',         
      this.open = true;
      this.show=true
      this.show1=false
      this.title = "子项目维护";
    },
      /** 新增按钮操作 */
    newhandleAdd(row) {
        // this.reset();
        if(this.isLast=="无下级"){
             this.open = false;
             this.msgError("不能添加下级!");
        }else{
          this.Name=this.inventoryName
          this.form1.parentCode=this.ids[0]
           this.form1.inventoryName='', 
            this.form1.inventoryUnit='', 
            this.form1.inventoryPrice='', 
            this.form1.inventoryMoney='', 
            this.form1.inventoryNum='', 
         this.form1.projectName=this.projectName
        this.show=false
        this.show1=true
        this.open = true;
         this.title = "子项目维护";
        }
      //  alert(this.form.djNumber)
     
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      const postId = row.id || this.ids
      // alert(postId)
      getProjectInventory(parseInt(postId)).then(response => {
        this.form1 = response.data;
        //  this.form.isFormal= this.form.isFormal+"";
          // this.form.isZb= this.form.isZb+"";
      //   listEnginnerByEnginner(this.form.engineerCode).then(response => {
        
      //     console.log(response)
      //      this.tableData = response.rows;
      // });
         this.open = true;
          // this.loading = false;
          //  this.getList()
         this.title = "修改单据";
      });
   
    
    },
    /** 分项清单提交按钮 */
    fensubmitForm: function() {
      this.form.projectCode=this.projectCode
      this.$refs["form"].validate(valid => {
        console.log(this.form )
        if (valid) {
             //检查子表信息
        //  for (let i = 0; i < this.tableData.length; i++) {
          if (
            this.form.projectCode == ""
          ) {
            // alert(this.form.projectCode)
            this.msgError("请选择项目");
            
            return;
          }
        // }
        //  let fileList = [];
        //   console.log(this.fileList);
        //   for (let i = 0; i < this.fileList.length; i++) {
        //     if (
        //       this.fileList[i].id != "" &&
        //       this.fileList[i].id != null &&
        //       this.fileList[i].id != undefined
        //     ) {
        //       continue;
        //     }
        //     let info = new Object();
        //     info.name = this.fileList[i].response.name;
        //     info.url = this.fileList[i].response.url;
        //     fileList.push(info);
        //   }
        //   console.log(fileList)
        //   this.form.fileRows = JSON.stringify(fileList);
        //  this.form.rows = JSON.stringify(this.tableData);
          // if (this.form.id != undefined) {
          //   updateEnginnerApply(this.form).then(response => {
          //     if (response.code === 200) {
          //       this.msgSuccess("修改成功");
          //       this.open = false;
          //       this.getList();
          //     } else {
          //       this.msgError(response.msg);
          //     }
          //   });
          // } else {
            addProjectInvent(this.form).then(response => {
              if (response.code === 200) {
                this.form=response.data;
                this.msgSuccess("保存成功");
                this.open = false;
                this.shower=true
                this.getList();
              } else {
                this.msgError(response.msg);
                this.shower=false
              }
            });
          // }
        }
      });
      
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form1"].validate(valid => {
        if (valid) {
             //检查子表信息
        // for (let i = 0; i < this.tableData.length; i++) {
        //   if (
        //     this.tableData[i].engineerCode  == "" ||
        //     this.tableData[i].engineerName == "" 
        //   ) {
        //     this.msgError("检查明细信息必填项!");
        //     return;
        //   }
        // }
        //  let fileList = [];
        //   console.log(this.fileList);
        //   for (let i = 0; i < this.fileList.length; i++) {
        //     if (
        //       this.fileList[i].id != "" &&
        //       this.fileList[i].id != null &&
        //       this.fileList[i].id != undefined
        //     ) {
        //       continue;
        //     }
        //     let info = new Object();
        //     info.name = this.fileList[i].response.name;
        //     info.url = this.fileList[i].response.url;
        //     fileList.push(info);
        //   }
          // console.log(fileList)
        //   this.form.fileRows = JSON.stringify(fileList);
        //  this.form1.rows = JSON.stringify(this.tableData);
        // alert(this.form1.id)
        // return
        // alert("33")
        //  console.log(this.form1)
        //  return false
          if (this.form1.id != undefined) {
            updateProjectInventory(this.form1).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addProjectInventory(this.form1).then(response => {
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
          return delProjectInventory(postIds);
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
          return exportProjectInventory(queryParams);
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
.changeBlue .el-form-item__label{
  color: #1890ff;
}
table th.star div::after {
  content: "*";
  color: red;
}
</style>