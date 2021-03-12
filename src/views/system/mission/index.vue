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
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优先级状态" prop="urgentStatus" v-if="isSend">
        <el-select
          v-model="queryParams.urgentStatus"
          placeholder="请选择优先级状态"
          clearable
          size="small"
        >
          <el-option
            v-for="item in levelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="isRead">
        <el-radio-group v-model="queryParams.isRead" v-if="isMe">
          <el-radio :label="0">未阅读</el-radio>
          <el-radio :label="1">已阅读</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" prop="sendIsRead" v-if="isSend">
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
        <el-table v-loading="loading" :data="taskInfoList">
          <el-table-column label="任务名称" align="center" prop="taskName">
            <template slot-scope="scope">
              <i
                v-if="scope.row.isRead == 0"
                style="
                  background-color: red;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  display: inline-block;
                "
              ></i>
              <span>{{ scope.row.taskName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目编码" align="center" prop="projectCode" />
          <el-table-column label="项目名称" align="center" prop="projectName" />
          <el-table-column
            label="执行人"
            align="center"
            prop="implementUserName"
          />
          <el-table-column label="任务进度(%)" align="center" prop="taskNum" />
          <el-table-column
            label="任务状态"
            align="center"
            prop="statusName"
            :filters="[
              { text: '未开始', value: 0 },
              { text: '进行中', value: 1 },
              { text: '已超期', value: -1 },
              { text: '待验收', value: 3 },
              { text: '已完成', value: 4 },
            ]"
            :filter-method="filterTag"
          >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.status == 0"
                :type="scope.row.status == 0 ? 'info' : ''"
                disable-transitions
                >{{ scope.row.statusName }}
              </el-tag>
              <el-tag
                v-if="scope.row.status == 1"
                :type="scope.row.status == 1 ? 'primary' : ''"
                disable-transitions
                >{{ scope.row.statusName }}
              </el-tag>
              <el-tag
                v-if="scope.row.status == -1"
                :type="scope.row.status == -1 ? 'danger' : ''"
                disable-transitions
                >{{ scope.row.statusName }}
              </el-tag>
              <el-tag
                v-if="scope.row.status == 3"
                :type="scope.row.status == 3 ? 'warning' : ''"
                disable-transitions
                >{{ scope.row.statusName }}
              </el-tag>
              <el-tag
                v-if="scope.row.status == 4"
                :type="scope.row.status == 4 ? 'success' : ''"
                disable-transitions
                >{{ scope.row.statusName }}
              </el-tag>
            </template>
          </el-table-column>
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
                >详情</el-button
              >
              <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:taskInfo:remove']"
                >取消</el-button
              > -->
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
          :row-class-name="tableRowClassName"
        >
          <!-- <el-table-column v-if="row.urgentStatus>0"
            prop="tag"
            label="优先级"
            width="100"
            :filters="[{ text: '普通', value: 0 }, { text: '重要', value: 1 },{ text: '紧急', value: 2 }]"
            :filter-method="filterTag"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.urgentStatus === 1 ? 'warning' : 'danger'"
                disable-transitions>{{scope.row.urgentStatusName}}</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column label="任务名称" align="center" prop="taskName">
            <template slot-scope="scope">
              <i
                v-if="scope.row.sendIsRead == 0"
                style="
                  background-color: red;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  display: inline-block;
                "
              ></i>
              <span>{{ scope.row.taskName }}</span>
              <i
                v-if="scope.row.isUrge == 1"
                class="el-icon-warning"
                style="color: red"
                >催</i
              >
            </template>
          </el-table-column>
          <el-table-column label="项目编码" align="center" prop="projectCode" />
          <el-table-column label="项目名称" align="center" prop="projectName" />
          <el-table-column
            label="执行人"
            align="center"
            prop="implementUserName"
          />
          <el-table-column label="任务进度(%)" align="center" prop="taskNum" />
          <el-table-column
            label="任务状态"
            align="center"
            prop="statusName"
            :filters="[
              { text: '未开始', value: 0 },
              { text: '进行中', value: 1 },
              { text: '已超期', value: -1 },
              { text: '待验收', value: 3 },
              { text: '已完成', value: 4 },
            ]"
            :filter-method="filterTag"
          >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.status == 0"
                :type="scope.row.status == 0 ? 'info' : ''"
                disable-transitions
                >{{ scope.row.statusName }}
              </el-tag>
              <el-tag
                v-if="scope.row.status == 1"
                :type="scope.row.status == 1 ? 'primary' : ''"
                disable-transitions
                >{{ scope.row.statusName }}
              </el-tag>
              <el-tag
                v-if="scope.row.status == -1"
                :type="scope.row.status == -1 ? 'danger' : ''"
                disable-transitions
                >{{ scope.row.statusName }}
              </el-tag>
              <el-tag
                v-if="scope.row.status == 3"
                :type="scope.row.status == 3 ? 'warning' : ''"
                disable-transitions
                >{{ scope.row.statusName }}
              </el-tag>
              <el-tag
                v-if="scope.row.status == 4"
                :type="scope.row.status == 4 ? 'success' : ''"
                disable-transitions
                >{{ scope.row.statusName }}
              </el-tag>
            </template>
          </el-table-column>
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
                @click="handleSendDetail(scope.row)"
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

    <el-dialog title="验收通过" :visible.sync="openSuccessStatus" width="400px">
      <el-rate v-model="num" show-text> </el-rate>

      <el-input
        style="margin-top: 15px"
        v-model="message"
        type="textarea"
        placeholder="请输入意见"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSuccessStatus">确 定</el-button>
        <el-button @click="cancelTwo">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="验收不通过" :visible.sync="openErrorStatus" width="400px">
      <el-input v-model="message" type="textarea" placeholder="请输入意见" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitErrorStatus">确 定</el-button>
        <el-button @click="cancelTwo">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="设置优先级"
      :visible.sync="openUrgentStatus"
      width="400px"
    >
      <el-radio-group v-model="urgentStatus">
        <el-radio :label="0">普通</el-radio>
        <el-radio :label="1">重要</el-radio>
        <el-radio :label="2">紧急</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUrgentStatus">确 定</el-button>
        <el-button @click="cancelTwo">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="反馈进度" :visible.sync="openTaskNum" width="400px">
      <el-slider v-model="taskNum" @change="changeNum" show-input> </el-slider>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTaskNum">确 定</el-button>
        <el-button @click="cancelTwo">取 消</el-button>
      </div>
    </el-dialog>
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
            :picker-options="pickerBeginDateBefore"
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
    <el-dialog :title="detailTitle" :visible.sync="openDetail" width="800px">
      <el-row
        style="position: absolute; top: 18px; right: 45px"
        v-if="isMeMenu"
      >
        <el-col :span="1.5" style="padding: 0px 5px 0px 5px">
          <el-button
            type="text"
            icon="el-icon-edit"
            size="mini"
            @click="handleUpdate"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5" style="padding: 0px 5px 0px 5px">
          <el-button
            type="text"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete"
            >取消</el-button
          >
        </el-col>
        <el-col :span="1.5" style="padding: 0px 5px 0px 5px">
          <el-button
            type="text"
            icon="el-icon-bell"
            size="mini"
            @click="handleIsUrge"
            >催办</el-button
          >
        </el-col>
      </el-row>
      <el-row
        style="position: absolute; top: 18px; right: 45px"
        v-if="isSendMenu"
      >
        <el-col :span="1.5" style="padding: 0px 5px 0px 5px">
          <el-button
            type="text"
            icon="el-icon-edit"
            size="mini"
            @click="changeUrgentStatus"
            >设置优先级</el-button
          >
        </el-col>
        <el-col :span="1.5" style="padding: 0px 5px 0px 5px">
          <el-button
            type="text"
            icon="el-icon-bell"
            size="mini"
            @click="changeTaskNum"
            >反馈</el-button
          >
        </el-col>
      </el-row>
      <el-row
        style="position: absolute; top: 18px; right: 45px"
        v-if="isEndMenu"
      >
        <el-col :span="1.5" style="padding: 0px 5px 0px 5px">
          <el-button
            type="text"
            icon="el-icon-check"
            size="mini"
            @click="taskSuccess"
            >验收通过</el-button
          >
        </el-col>
        <el-col :span="1.5" style="padding: 0px 5px 0px 5px">
          <el-button
            type="text"
            icon="el-icon-close"
            size="mini"
            @click="taskError"
            >验收不通过</el-button
          >
        </el-col>
      </el-row>
      <div class="clearfix">
        <div style="width: 350px; float: left; height: 500px" class="left">
          <el-form ref="detailForm" :model="detailForm" label-width="100px">
            <el-form-item label="项目编码：">
              <el-input v-model="detailForm.projectCode" :readonly="true" />
            </el-form-item>
            <el-form-item label="项目名称：">
              <el-input v-model="detailForm.projectName" :readonly="true" />
            </el-form-item>
            <el-form-item label="任务名称：">
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
                style="width: 100%; border: none"
                v-model="detailForm.taskEndTime"
                type="date"
                placeholder="单据日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="执行人：">
              <el-input
                v-model="detailForm.implementUserName"
                :readonly="true"
                placeholder="请输入执行人"
              />
            </el-form-item>
          </el-form>
        </div>
        <div
          class="innerbox"
          ref="chatContent"
          v-loading="loadingMessage"
          style="
            width: 395px;
            height: 360px;
            background: #fafafa;
            float: right;
            padding: 5px 10px 0px 10px;
            overflow: auto;
          "
        >
          <div
            :class="item.type == 1 ? 'talkleft' : 'talkright'"
            v-for="item in messageList"
            :key="item.id"
          >
            <span class="left">{{ item.createTime.slice(10) }}</span>
            <span :class="item.type == 1 ? 'right' : ''"
              ><span class="name">{{ item.createBy }}</span
              ><span :class="item.type == 1 ? '' : 'right'">{{
                item.message
              }}</span></span
            >
          </div>
        </div>
        <!-- 上传文件 -->
        <div style="float: left; padding-left: 20px; width: 345px">
          <p style="color: #0090ff">
            <span> <i class="el-icon-folder-opened"></i>文件</span>
            <span style="margin-left: 10px">
              <i class="el-icon-folder"></i>
              本地上传
            </span>
          </p>
        </div>
        <!-- 输入框 -->
        <div style="float: left">
          <el-form
            @submit.native.prevent
            ref="sendForm"
            :model="sendForm"
            :rules="sendRules"
            label-width="120px"
          >
            <el-input
              @keydown.enter.native="sendMessage"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="sendForm.message"
              style="width: 410px; padding-left: 20px"
              class="talktextarea"
            >
            </el-input>
          </el-form>
        </div>
        <!-- 按钮 -->
        <div style="float: right; margin-top: 10px">
          <el-button type="primary" size="medium" @click="sendMessage"
            >发送</el-button
          >
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
  changeUrgentStatus,
  checkAccept,
  changeIsUrge,
  getSendTaskInfo,
  changeTaskNum,
} from "@/api/system/taskInfo";
import { listTaskMessage, addTaskMessage } from "@/api/system/taskMessage";
import projectSelect from "./projectSelect";
import { getAllUser } from "@/api/system/user";
export default {
  name: "TaskInfo",
  components: {
    projectSelect,
  },
  data() {
    return {
      options: [
        {
          value: 0,
          label: "未进行",
        },
        {
          value: 1,
          label: "进行中",
        },
        {
          value: -1,
          label: "已超期",
        },
        {
          value: 3,
          label: "待验收",
        },
        {
          value: 4,
          label: "已完成",
        },
      ],
      levelOptions: [
        {
          value: 0,
          label: "普通",
        },
        {
          value: 1,
          label: "重要",
        },
        {
          value: 2,
          label: "紧急",
        },
      ],
      message: "",
      num: 0,
      loadingMessage: false,
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //如果当天可选，就不用减8.64e7
        },
      },
      messageList: [],
      textarea: "",
      openUrgentStatus: false,
      openTaskNum: false,
      urgentStatus: 0, //设置优先级
      isUrge: 0, //是否催办
      taskNum: 0, //任务进度
      isMe: true,
      isSend: false,
      isMeMenu: true,
      isEndMenu: false,
      isSendMenu: false,
      activeName: "first",
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
      detailTitle: "",
      // 是否显示弹出层
      open: false,
      openDetail: false,
      openSuccessStatus: false,
      openErrorStatus: false,
      detailForm: [],
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
      sendForm: {},
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
      sendRules: {
        message: [{ required: true, message: "内容不能为空", trigger: "blur" }],
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
    tableRowClassName({ row, rowIndex }) {
      if (row.urgentStatus === 1) {
        return "warning-row";
      } else if (row.urgentStatus === 2) {
        return "danger-row";
      }
      return "";
    },
    //验证通过
    taskSuccess() {
      this.num = 0;
      this.message = "";
      this.openSuccessStatus = true;
    },
    submitSuccessStatus() {
      checkAccept(
        this.detailForm.id,
        this.message, //意见
        this.num, //星星数量
        0, //0 通过 1 不通过
        this.detailForm.taskCode
      ).then((response) => {
        this.getList();
        this.cancelTwo();
        this.getMessageList();
        this.isEndMenu = false;
      });
    },
    //验证不通过
    taskError() {
      this.message = "";
      this.openErrorStatus = true;
    },
    submitErrorStatus() {
      checkAccept(
        this.detailForm.id,
        this.message, //意见
        0, //星星数量
        1, //0 通过 1 不通过
        this.detailForm.taskCode
      ).then((response) => {
        this.getList();
        this.cancelTwo();
        this.getMessageList();
      });
    },
    //设置优先级
    changeUrgentStatus() {
      this.openUrgentStatus = true;
      this.urgentStatus = this.detailForm.urgentStatus;
    },
    submitUrgentStatus() {
      changeUrgentStatus(
        this.detailForm.id,
        this.urgentStatus,
        this.detailForm.taskCode
      ).then((response) => {
        this.getSendList();
        this.cancelTwo();
        this.getMessageList();
      });
    },
    //反馈任务进度
    changeTaskNum() {
      this.openTaskNum = true;
      this.taskNum = parseInt(this.detailForm.taskNum);
    },
    submitTaskNum() {
      changeTaskNum(
        this.detailForm.id,
        this.taskNum,
        this.detailForm.taskCode
      ).then((response) => {
        if (this.taskNum == 100) {
          this.isSendMenu = false;
        }
        this.getSendList();
        this.cancelTwo();
        this.getMessageList();
      });
    },
    changeNum(data) {
      if (data >= this.detailForm.taskNum) {
        this.taskNum = data;
      } else {
        this.taskNum = parseInt(this.detailForm.taskNum);
      }
    },
    handleClick(tab, event) {
      if (tab.index == 0) {
        this.getList();
        this.isMe = true;
        this.isSend = false;
        this.isMeMenu = true;
        this.isEndMenu = false;
        this.isSendMenu = false;
      }
      if (tab.index == 1) {
        this.getSendList();
        this.isMe = false;
        this.isSend = true;
        this.isMeMenu = false;
        this.isEndMenu = false;
        this.isSendMenu = true;
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
      this.openDetail = false;
      this.reset();
    },
    cancelTwo() {
      this.openUrgentStatus = false;
      this.openSuccessStatus = false;
      this.openErrorStatus = false;
      this.openTaskNum = false;
      // this.message="";
      // this.num=0;
      //this.urgentStatus = 0;
      //this.taskNum = 0;
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
      this.resetForm("sendForm");
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      if (this.activeName == "first") {
        this.getList();
      } else {
        this.getSendList();
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
      this.title = "新建任务";
    },
    /** 修改按钮操作 */
    handleUpdate() {
      //const id =  this.detailForm.id;
      this.open = true;
      this.reset();
      this.form = this.detailForm;
      // getTaskInfo(id).then((response) => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "编辑任务";
      // });
    },
    handleDetail(row) {
      this.reset();
      const id = row.id || this.ids;
      getTaskInfo(id).then((response) => {
        this.detailForm = response.data;
        this.openDetail = true;
        if (response.data.status >= 3) {
          this.isMeMenu = false;
          this.isEndMenu = true;
        }
        if (response.data.status == 4) {
          this.isEndMenu = false;
        }
        this.detailTitle = response.data.taskName;
        this.getMessageList();
        //this.getList();
      });
    },
    getMessageList() {
      //this.messageList = [];
      if (
        this.detailForm.taskCode != undefined &&
        this.detailForm.taskCode != null &&
        this.detailForm.taskCode != ""
      ) {
        let queryParams = {
          taskCode: this.detailForm.taskCode,
        };
        listTaskMessage(queryParams).then((response) => {
          this.messageList = response.rows;
          this.$nextTick(() => {
            this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
          });
        });
      }
    },
    handleSendDetail(row) {
      this.reset();
      const id = row.id || this.ids;
      getSendTaskInfo(id).then((response) => {
        this.detailForm = response.data;
        this.openDetail = true;
        if (response.data.status >= 3) {
          this.isSendMenu = false;
        }
        this.detailTitle = response.data.taskName;
        this.getMessageList();
        //this.getSendList();
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
                getTaskInfo(this.form.id).then((response) => {
                  this.detailForm = response.data;
                  this.openDetail = true;
                  this.title = response.data.taskName;
                  this.getMessageList();
                });
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
    /** 提交按钮 */
    sendMessage: function (event) {
      event.preventDefault();
      if (this.detailForm.status == 4) {
        this.msgError("任务已结束");
        return;
      }
      this.loadingMessage = true;
      this.$refs["sendForm"].validate((valid) => {
        if (valid) {
          this.sendForm.taskCode = this.detailForm.taskCode;
          this.sendForm.type = 0; //普通消息
          addTaskMessage(this.sendForm).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("发送成功");
              this.sendForm = {};
              this.getMessageList();
              this.loadingMessage = false;
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete() {
      const ids = this.detailForm.id;
      this.$confirm("是否确认取消?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delTaskInfo(ids);
        })
        .then(() => {
          this.getList();
          this.openDetail = false;
          this.msgSuccess("取消成功");
        })
        .catch(function () {});
    },
    handleIsUrge() {
      const taskCode = this.detailForm.taskCode;
      const ids = this.detailForm.id;
      this.$confirm("是否确认催办?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return changeIsUrge(ids, taskCode);
        })
        .then(() => {
          //this.getList();
          this.msgSuccess("催办成功");
          this.getMessageList();
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
.left >>> .el-input__inner {
  border: 0;
}
.clearfix {
  display: block;
  overflow: hidden;
  content: "";
  clear: both;
}
.talkleft {
  float: left;
  width: 100%;
  margin-bottom: 10px;
}
.talkright {
  float: right;
  width: 100%;
  margin-bottom: 10px;
}
.talkleft .left {
  float: left;
  width: 80px;
  text-align: center;
  background-color: #ccc;
  color: #fff;
  padding: 3px 0;
  border-radius: 4px;
  margin-right: 5px;
}
.talkright .left {
  float: left;
  width: 80px;
  text-align: center;
  background-color: #ccc;
  color: #fff;
  padding: 3px 0;
  border-radius: 4px;
  margin-right: 5px;
}
.talkleft .right {
  display: inline-block;
  background-color: #f2f2f2;
  border-radius: 4px;
  padding: 3px 10px;
}
.talkleft .right .name {
  color: #1890ff;
  padding-right: 5px;
}
.talkright .right {
  float: right;
  background-color: #fff;
  border-radius: 4px;
  padding: 12px 10px;
  margin-right: 5px;
  border: 1px solid #f2f2f2;
}
.talkright .name {
  width: 40px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  border-radius: 50%;
  background-color: rgb(0, 144, 255);
  float: right;
  text-align: center;
  padding-right: 5px;
}
.talktextarea textarea {
  resize: none;
}
.innerbox::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.innerbox::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}
.innerbox::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
.el-table .warning-row {
  background: #eedec5;
}

.el-table .danger-row {
  background: #fad8d8;
}
</style>