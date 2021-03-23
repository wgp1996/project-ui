<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="120px"
    >
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
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <!-- <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:projectType:add']"
        >新增</el-button> -->
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
          v-hasPermi="['system:goods:add']"
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
          v-hasPermi="['system:goods:edit']"
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
          v-hasPermi="['system:goods:remove']"
          >删除</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:goods:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>
    <el-table
      v-loading="loading"
      :data="projectTypeList"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            style="padding: 0; margin: 0"
            :data="props.row.childrenList"
            id="special"
          >
            <el-table-column label="人员编码" align="center" prop="userCode" />
            <el-table-column label="人员名称" align="center" prop="userName" />
            <el-table-column
              label="岗位名称"
              align="center"
              prop="projectPostName"
            />
            <el-table-column label="备注" align="center" prop="remark" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="项目编码" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="项目简称" align="center" prop="projectNameJc" />
      <el-table-column label="项目类型" align="center" prop="projectType" />
      <el-table-column
        label="项目经理"
        align="center"
        prop="projectManagerName"
      />
      <el-table-column
        label="开工日期"
        align="center"
        prop="projectStartTime"
      />
      <!-- <el-table-column label="完工日期" align="center" prop="projectEndTime" /> -->
      <el-table-column label="启用预算" align="center" prop="ysStatus" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建日期" align="center" prop="createTime" />

      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
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
            v-hasPermi="['system:projectType:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:projectType:remove']"
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
    <!-- 添加或修改项目分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="基础信息" name="first">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="项目编码" prop="projectCode">
              <!-- <treeselect v-model="form.projectTypePid" :options="projectTypeOptions" :normalizer="normalizer" placeholder="请选择项目分类父级" /> -->
              <el-input
                v-model="form.projectCode"
                placeholder="请输入项目编码"
              />
            </el-form-item>
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model="form.projectName"
                placeholder="请输入项目名称"
              />
            </el-form-item>
            <el-form-item label="项目简称" prop="projectNameJc">
              <el-input
                v-model="form.projectNameJc"
                placeholder="请输入项目简称"
              />
            </el-form-item>
            <el-form-item label="项目类型" prop="projectType">
              <treeselect
                v-model="form.projectType"
                :options="projectTypeOptions"
                :normalizer="normalizer"
                placeholder="请选择项目类型"
              />
            </el-form-item>
            <el-form-item label="项目经理" prop="projectManagerName">
              <el-select
                v-model="form.projectManagerName"
                placeholder="请选择经理"
                filterable
                style="width: 100%"
                @change="selectStore"
              >
                <el-option
                  v-for="item in people"
                  :key="item.nickName"
                  :label="item.userName"
                  :value="item.nickName"
                >
                  <span style="width: 100%">{{ item.nickName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开工日期" prop="projectStartTime">
              <el-date-picker
                clearable
                style="width: 100%"
                v-model="form.projectStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="开工日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="完工日期" prop="projectEndTime">
              <el-date-picker
                clearable
                style="width: 100%"
                v-model="form.projectEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="完工日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="启用预算">
              <el-radio-group v-model="form.ysStatus">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">不启用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="项目说明">
              <el-input
                type="textarea"
                :rows="2"
                v-model="form.remark"
                placeholder="请输入项目说明,200字以内"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="人员信息" name="second">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="goodsSelect"
                >新增人员</el-button
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
            <el-table-column prop="userName" label="人员名称" width="150">
              <template scope="scope">
                <el-input
                  size="small"
                  :disabled="true"
                  v-model="scope.row.userName"
                  placeholder="请输入人员名称"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="人员编码" width="150">
              <template scope="scope">
                <el-input
                  size="small"
                  :disabled="true"
                  v-model="scope.row.userCode"
                  placeholder="请输入人员编码"
                  @change="handleEdit(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="岗位名称" width="150">
              <template scope="scope">
                <el-input
                  size="small"
                  :disabled="true"
                  v-model="scope.row.projectPostName"
                  @click="openGw(scope.$index, scope.row)"
                  placeholder="请输入岗位名称"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="岗位编码" width="150">
              <template scope="scope">
                <el-input
                  size="small"
                  :disabled="true"
                  v-model="scope.row.projectPost"
                  @click="openGw(scope.$index, scope.row)"
                  placeholder="请输入岗位编码"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column label="备注" width="150">
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
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="openGw(scope.$index, scope.row)"
                  >选择岗位</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleChildDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
              <!-- 
              <template scope="scope">
                  <el-button
                  size="small"
                  type="danger"
                  @click="openGw(scope.$index, scope.row)"
                >选择岗位</el-button>
              </template>
              <template scope="scope">
                 <el-button
                  size="small"
                  type="danger"
                  @click="handleChildDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template> -->
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
    <el-dialog title="选择岗位" :visible.sync="openPost" width="400px">
      <treeselect
        v-model="projectPost"
        :defaultExpandLevel="3"
        :options="projectTypePostOptions"
        :normalizer="normalizer"
        placeholder="请选择岗位"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectPost">确 定</el-button>
        <el-button @click="cancelPost">取 消</el-button>
      </div>
    </el-dialog>
    <goods-select
      v-if="selectGoodsDialog"
      ref="selectGoods"
      @selectData="selectData"
    ></goods-select>
    <!-- @selectDataMore="selectDataMore" -->
  </div>
</template>

<script>
let _that;
import {
  listProjectInfo,
  getProjectInfo,
  delProjectInfo,
  addProjectInfo,
  updateProjectInfo,
  systemFileList,
  delFileInfo,
  delProjectUserInfo,
  listProjectChild,
  exportProjectInfo,
} from "@/api/system/projectInfo";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listProjectType } from "@/api/system/projectType";
import { listProjectTypePost } from "@/api/system/projectTypePost";
import { getAllUser } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import goodsSelect from "./goodsSelect";

export default {
  name: "ProjectType",
  components: { Treeselect, goodsSelect },
  data() {
    return {
      postIndex: -1,
      projectPost: 0,
      openPost: false,
      activeName: "first",
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
      // 遮罩层
      loading: true,
      // 数据
      tableData: [],
      // 弹出框遮罩层
      selectGoodsDialog: false,
      // 主单数据
      projectTypeList: [],
      // 项目分类树选项
      projectTypeOptions: [],
      // 项目岗位树选项
      projectTypePostOptions: [],
      projectTypePostList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      //经理
      people: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        projectName: undefined,
        projectCode: undefined,
        orderNum: undefined,
        type: undefined,
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        projectCode: [
          { required: true, message: "项目编码不能为空", trigger: "blur" },
        ],
        projectNameJc: [
          { required: true, message: "项目简称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    _that = this;
    this.getList();
    this.getTreeselect();
    this.getPostTreeselect();
  },
  methods: {
    //追加子表必填样式
    starAdd(obj) {
      if (obj.columnIndex === 0 ) {
        return "star";
      }
    },
    openGw(index, row) {
      this.getPostTreeselect();
      this.postIndex = index;
      this.openPost = true;
    },
    selectPost() {
      this.openPost = false;
      if (this.projectPost != 0) {
        //根据编码查找名称
        let projectPostName = "";
        for (let i = 0; i < this.projectTypePostList.length; i++) {
          if (this.projectTypePostList[i].projectTypeId == this.projectPost) {
            projectPostName = this.projectTypePostList[i].projectTypeName;
            break;
          }
        }
        this.tableData.forEach((info) => {
          // 修改list中的数据
          info.projectPost = _that.projectPost;
          info.projectPostName = projectPostName;
          this.$set(this.tableData, this.postIndex, info);
        });
      }
      this.projectPost = 0;
      //alert(this.projectPostCode)
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
    /** 操作 */
    goodsSelect() {
      this.selectGoodsDialog = true;
      this.$nextTick(() => {
        this.$refs.selectGoods.visible = true;
      });
    },
    // 批量选择
    selectData(row) {
      this.$nextTick(() => {
        let goodsInfo = new Object();
        goodsInfo.userName = row.nickName;
        goodsInfo.userCode = row.userName;
        this.tableData.push(goodsInfo);
        this.$refs.selectGoods.visible = false;
      });
    },
    /** 查询项目分类列表 */
    getList() {
      this.loading = true;
      listProjectInfo(this.queryParams).then((response) => {
        console.log(response);
        //this.projectTypeList = this.handleTree(response.data, "projectTypeId", "projectTypePid");
        this.projectTypeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      let queryParams = {};
      getAllUser(queryParams).then((response) => {
        console.log(response);
        this.people = response.rows;
      });
    },
    /** 转换项目分类数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.projectTypeId,
        label: node.projectTypeName,
        children: node.children,
      };
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      listProjectType().then((response) => {
        this.projectTypeOptions = [];
        const data = {
          projectTypeId: 0,
          projectTypeName: "顶级节点",
          children: [],
        };
        data.children = this.handleTree(
          response.data,
          "projectTypeId",
          "projectTypePid"
        );
        this.projectTypeOptions.push(data);
      });
    },
    /** 查询部门下拉树结构 */
    getPostTreeselect() {
      listProjectTypePost().then((response) => {
        this.projectTypePostOptions = [];
        this.projectTypePostList = response.data;
        const data = {
          projectTypeId: 0,
          projectTypeName: "顶级节点",
          children: [],
        };
        data.children = this.handleTree(
          response.data,
          "projectTypeId",
          "projectTypePid"
        );
        this.projectTypePostOptions.push(data);
      });
    },
    selectStore(data) {
      //根据仓库编码查找仓库名称
      console.log(data); //admin
      for (let i = 0; i < this.people.length; i++) {
        //  console.log(this.people[i])
        // console.log(this.people[i].nickName)
        if (this.people[i].nickName == data) {
          console.log(this.people[i].nickName);

          this.form.projectManagerCode = this.people[i].userName;
          break;
        }
      }
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelPost() {
      this.openPost = false;
    },
    // 表单重置
    reset() {
      this.form = {
        projectTypeId: undefined,
        projectTypePid: undefined,
        projectTypeName: undefined,
        orderNum: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        type: undefined,
        // 开始
        projectCode: undefined,
        projectName: undefined,
        projectNameJc: undefined,
        projectType: undefined,
        projectManagerName: undefined,
        projectStartTime: undefined,
        projectEndTime: undefined,
        ysStatus: undefined,
        remark: undefined,
        projectManagerCode: undefined,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      //this.getTreeselect();
      this.open = true;
      this.title = "项目建档";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      //this.getTreeselect();
      if (row != undefined) {
        this.form.projectTypePid = row.projectTypeId;
      }
      const id = row.id || this.ids;
      getProjectInfo(id).then((response) => {
        this.form = response.data;
        systemFileList(this.form.projectCode).then((response) => {
          this.fileList = response.rows;
        });
        listProjectChild(this.form.projectCode).then((response) => {
          this.tableData = response.rows;
        });
        this.open = true;
        this.title = "修改项目信息";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              this.tableData[i].userCode == "" 
              // this.tableData[i].projectPost == ""
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
          console.log(this.form);
          if (this.form.id != undefined) {
            updateProjectInfo(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addProjectInfo(this.form).then((response) => {
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
        delProjectUserInfo(row.id);
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(index, 1);
      }
      console.log(index, row);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确认删除选中的项目?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delProjectInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
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