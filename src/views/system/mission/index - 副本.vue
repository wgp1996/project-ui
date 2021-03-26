<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="110px"
    >
      <el-form-item label="任务名称" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          placeholder="请输入任务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="status" v-if="isMe">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择任务状态"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级状态" prop="urgentStatus" v-if="isSend">
        <el-select
          v-model="queryParams.urgentStatus"
          placeholder="请选择优先级状态"
          clearable
          size="small"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
       <el-form-item label="" prop="isRead">
          <el-radio-group v-model="queryParams.isRead" v-if="isMe">
            <el-radio :label="0">未阅读</el-radio>
            <el-radio :label="1">已阅读</el-radio>
          </el-radio-group>
       </el-form-item>
        <el-form-item label="优先级状态" prop="sendIsRead" v-if="isSend">
          <el-radio-group v-model="queryParams.sendIsRead">
            <el-radio :label="0">未阅读</el-radio>
            <el-radio :label="1">已阅读</el-radio>
          </el-radio-group>
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
          v-hasPermi="['system:taskInfo:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>
   <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
       <el-tab-pane label="我安排的" name="first">
    <el-table
      v-loading="loading"
      :data="taskInfoList"
    >
      <el-table-column label="任务名称" align="center" prop="taskName" />
      <el-table-column label="项目编码" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="执行人" align="center" prop="implementUserName" />
      <el-table-column label="任务进度(%)" align="center" prop="taskNum" />
      <el-table-column label="任务状态" align="center" prop="statusName" />
      <el-table-column label="截止日期" align="center" prop="taskEndTime" />
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
            @click="handleDetail(scope.row)"
            v-hasPermi="['system:taskInfo:edit']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:taskInfo:remove']"
            >取消</el-button
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
</el-tab-pane>
 <el-tab-pane label="派给我的" name="second">
    <el-table
      v-loading="loading"
      :data="taskInfoList"
    >
      <el-table-column label="任务名称" align="center" prop="taskName" />
      <el-table-column label="项目编码" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="执行人" align="center" prop="implementUserName" />
      <el-table-column label="任务进度(%)" align="center" prop="taskNum" />
      <el-table-column label="任务状态" align="center" prop="statusName" />
      <el-table-column label="截止日期" align="center" prop="taskEndTime" />
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
            @click="handleDetail(scope.row)"
            v-hasPermi="['system:taskInfo:edit']"
            >详情</el-button
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
 </el-tab-pane>
 </el-tabs>
    <!-- 添加或修改任务管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item
          label="选择项目"
          prop="projectCode"
          style="width: 90%; position: relative"
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
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="任务描述" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="截止日期" prop="taskEndTime">
          <el-date-picker
            style="width: 100%"
            v-model="form.taskEndTime"
            type="date"
            placeholder="单据日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="执行人" prop="implementUserCode">
          <el-select
            v-model="form.implementUserCode"
            placeholder="请选择执行人"
            filterable
            style="width: 100%"
            @change="selectPerson"
          >
            <el-option
              v-for="item in people"
              :key="item.userName"
              :label="item.nickName"
              :value="item.userName"
            >
              <span style="width: 100%">{{ item.nickName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

 <!-- 任务详情 -->
    <el-dialog :title="title" :visible.sync="openDetail" width="800px">    
       <el-row style="position: absolute;top: 18px;right: 45px;">
            <el-col :span="1.5" style="padding:0px 5px 0px 5px">
              <el-button
                type="text"
                icon="el-icon-edit"
                size="mini"
                @click="handleUpdate"
                v-hasPermi="['system:post:edit']"
              >修改</el-button>
            </el-col>
            <el-col :span="1.5" style="padding:0px 5px 0px 5px">
              <el-button
                type="text"
                icon="el-icon-delete"
                size="mini"
                @click="handleDelete"
                v-hasPermi="['system:post:remove']"
              >删除</el-button>
            </el-col>
            <el-col :span="1.5" style="padding:0px 5px 0px 5px">
              <el-button
                type="text"
                icon="el-icon-bell"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['system:post:add']"
              >催办</el-button>
            </el-col>
            <el-col :span="1.5" style="padding:0px 5px 0px 5px">
              <el-button
                type="text"
                icon="el-icon-s-custom"
                size="mini"
                @click="handleExport"
                v-hasPermi="['system:post:export']"
              >任务参与人</el-button>
       </el-col>
      </el-row>
      <div class="clearfix">
      <div style="width:400px;float:left;height:500px" class="left">
        <el-form ref="detailForm" :model="detailForm"  label-width="100px">
        <el-form-item label="项目编码：">
          <el-input v-model="detailForm.projectCode" :readonly="true"  />
        </el-form-item>
         <el-form-item label="项目名称：">
          <el-input v-model="detailForm.projectName" :readonly="true" />
        </el-form-item>
        <el-form-item label="任务名称：" >
          <el-input v-model="detailForm.taskName" :readonly="true" />
        </el-form-item>
        <el-form-item label="任务描述：">
          <el-input
          :readonly="true" 
            v-model="detailForm.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="截止日期：">
          <el-date-picker
          :readonly="true" 
            style="width: 100%;border:none"
            v-model="detailForm.taskEndTime"
            type="date"
            placeholder="单据日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="执行人：">
            <el-input v-model="detailForm.implementUserName" :readonly="true"  placeholder="请输入执行人"/>
          </el-form-item>
      </el-form>
      </div>
      <div style="width:345px;height:360px;background: #fafafa;float:right;padding:5px 10px 0px 10px;">
             <div class="talkleft">
                <span class="left">03.09 10:25</span>
                <span class="right"><span class="name">name</span><span>创建了任务</span></span>
            </div>
             <div class="talkright">
                <span class="left">03.09 10:25</span>
                <span ><span class="name">name</span><span class="right">创建了任务</span></span>
            </div>
        </div>
        <!-- 上传文件 -->
        <div style="float:left;padding-left:20px;width:345px">
          <p style="color:#0090ff">
            <span>
              <i class="el-icon-folder-opened"></i>文件</span> 
              <span style="margin-left:10px">
                <i class="el-icon-folder"></i>
                本地上传
               </span>
          </p>
        </div>
        <!-- 输入框 -->
        <div style="float:left">
            <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="textarea"
                style="width:360px;padding-left:12px;"
                class="talktextarea"
                >
           </el-input>
        </div>
        <!-- 按钮 -->
        <div style="float:right;margin-top:10px">
              <el-button
              type="primary"
              size="medium"
              >发送</el-button>
        </div>
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
  listTaskInfo,
  sendListTaskInfo,
  getTaskInfo,
  delTaskInfo,
  addTaskInfo,
  updateTaskInfo,
  exportTaskInfo,
} from "@/api/system/taskInfo";
import projectSelect from "./projectSelect";
import { getAllUser } from "@/api/system/user";
export default {
  name: "TaskInfo",
  components: {
    projectSelect,
  },
  data() {
    return {
      textarea:'',
      isMe:true,
      isSend:false,
      activeName: 'first',
      people: [],
      selectProjectDialog: false,
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
      // 任务管理表格数据
      taskInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openDetail:false,
      detailForm:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskName: undefined,
        taskCode: undefined,
        taskEndTime: undefined,
        projectCode: undefined,
        projectName: undefined,
        fileName: undefined,
        implementUserCode: undefined,
        implementUserName: undefined,
        status: undefined,
        urgentStatus: undefined,
        isUrge: undefined,
        isRead: undefined,
        taskNum: undefined,
        message: undefined,
        resultNum: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        projectCode: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
        ],
        taskEndTime: [
          { required: true, message: "请选择截止日期", trigger: "change" },
        ],

        implementUserCode: [
          { required: true, message: "请选择执行人", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
    let queryParams = {};
    getAllUser(queryParams).then((response) => {
      console.log(response);
      this.people = response.rows;
    });
  },
  methods: {
     handleClick(tab, event){
       if(tab.index==0){
         this.getList()
       }
       if(tab.index==1){
         this.getSendList();
       }
    },
    selectPerson(data) {
      //根据人员编码查找人员名称
      console.log(data); //admin
      for (let i = 0; i < this.people.length; i++) {
        if (this.people[i].userName == data) {
          this.form.implementUserName = this.people[i].nickName;
          break;
        }
      }
    },
    selectData(row) {
      this.$nextTick(() => {
        this.form.projectCode = row.projectCode;
        this.form.projectName = row.projectName;
        this.$refs.selectProject.visible = false;
      });
    },
    /** 选择项目列表 */
    projectSelect() {
      this.selectProjectDialog = true;
      this.$nextTick(() => {
        this.$refs.selectProject.visible = true;
      });
    },
    /** 我安排的任务管理列表 */
    getList() {
      this.loading = true;
      listTaskInfo(this.queryParams).then((response) => {
        this.taskInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 派给我任务管理列表 */
    getSendList() {
      this.loading = true;
      sendListTaskInfo(this.queryParams).then((response) => {
        this.taskInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openDetail=false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        taskName: undefined,
        taskCode: undefined,
        taskEndTime: undefined,
        projectCode: undefined,
        projectName: undefined,
        fileName: undefined,
        implementUserCode: undefined,
        implementUserName: undefined,
        status: "0",
        urgentStatus: "0",
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        isUrge: undefined,
        isRead: undefined,
        taskNum: undefined,
        message: undefined,
        resultNum: undefined,
      };
      this.resetForm("detailForm");
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
      this.title = "新建任务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTaskInfo(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑任务";
      });
    },
    handleDetail(row) {
      this.reset();
      const id = row.id || this.ids;
      getTaskInfo(id).then((response) => {
        this.detailForm = response.data;
        this.openDetail = true;
        this.title = response.data.taskName;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateTaskInfo(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addTaskInfo(this.form).then((response) => {
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
        '是否确认删除任务管理编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTaskInfo(ids);
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
      this.$confirm("是否确认导出所有任务管理数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportTaskInfo(queryParams);
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
  .left>>>.el-input__inner {
    border: 0;
  }
  .clearfix{
    display: block;
    overflow: hidden;
    content: '';
    clear: both;
  }
  .talkleft{
    float: left;
    width: 100%;
    margin-bottom: 10px;
  }
  .talkright{
    float: right;
    width: 100%;
     margin-bottom: 10px;
  }
  .talkleft .left{
    float: left;
    width: 80px;
    text-align: center;
    background-color: #ccc;
    color: #fff;
    padding: 3px 0;
    border-radius: 4px;
    margin-right: 5px;
  }
    .talkright .left{
    float: left;
    width: 80px;
    text-align: center;
    background-color: #ccc;
    color: #fff;
    padding: 3px 0;
    border-radius: 4px;
    margin-right: 5px;
  }
   .talkleft .right{
    display: inline-block;
    background-color: #f2f2f2;
    border-radius: 4px;
    padding: 3px 10px;
    }
     .talkleft .right .name{
       color:#1890ff ;
    }
    .talkright .right{
     float: right;
     background-color: #fff;
    border-radius: 4px;
    padding: 12px 10px;
    margin-right: 5px;
    border:1px solid #f2f2f2
    }
    .talkright .name{
      width: 40px;
      height: 40px;
     line-height: 40px;
     color: #fff;
      border-radius: 50%;
      background-color: rgb(0, 144, 255);
      float: right;
      text-align: center;
    }
    .talktextarea textarea{
      resize: none;
    }
</style>