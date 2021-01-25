<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
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
          placeholder="请输入岗位编码"
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
        >搜索</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:projectTypePost:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="projectTypeList"
      row-key="projectTypeId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="项目岗位名称" align="center" prop="projectTypeName" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="创建日期" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:projectTypePost:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:projectTypePost:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改项目分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <!-- <el-form-item label="项目岗位编号" prop="projectTypeId">
           <el-input v-model="form.projectTypeId" placeholder="请输入项目岗位编号" />
        </el-form-item> -->
       <el-form-item label="项目名称" prop="projectName" style="width:80%;position:relative">
          <el-input v-model="form.projectName" :disabled="true" placeholder="请选择项目" />
            <el-button icon="el-icon-plus" type="primary" style="position:absolute;right:-50px;top:0px" @click="projectSelect"></el-button>
        </el-form-item>
        <el-form-item label="项目岗位名称" prop="projectTypeName">
          <el-input v-model="form.projectTypeName" placeholder="请输入项目岗位名称" />
        </el-form-item>
        <el-form-item label="项目岗位父级" prop="projectTypePid">
          <treeselect v-model="form.projectTypePid" :options="projectTypeOptions" :normalizer="normalizer" placeholder="请选择项目岗位父级" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
      <project-select-all
      v-if="selectProjectDialog"
      ref="selectProjectAll"
      @selectData="selectData"
    ></project-select-all>
  </div>
</template>

<script>
import { listProjectType, getProjectType, delProjectType, addProjectType, updateProjectType, exportProjectType } from "@/api/system/projectTypePost";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import projectSelectAll from "./projectSelectAll";
export default {
  name: "ProjectType",
  components: { Treeselect,projectSelectAll },
  data() {
    return {
      selectProjectDialog:false,
      // 遮罩层
      loading: true,
      // 项目分类表格数据
      projectTypeList: [],
      // 项目分类树选项
      projectTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        projectTypePid: undefined,
        projectTypeName: undefined,
        projectName: undefined,
        projectCode: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         projectName: [
          { required: true, message: "项目不能为空", trigger: "blur" }
          ],
          projectTypePid: [
          { required: true, message: "父级分类不能为空", trigger: "blur" }
          ],
          projectTypeName: [
            { required: true, message: "名称不能为空", trigger: "blur" }
          ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
     /** 选择项目列表 */
    projectSelect() {
      this.selectProjectDialog = true;
      this.$nextTick(() => {
        //this.$refs.selectGoods.getList(this.form.personCode);
        this.$refs.selectProjectAll.visible = true;
      });
    },
    selectData(row) {
      this.$nextTick(() => {
        this.form.projectCode=row.projectCode;
        this.form.projectName=row.projectName;
        this.$refs.selectProjectAll.visible = false;
      });
    },
    /** 查询项目分类列表 */
    getList() {
      this.loading = true;
      listProjectType(this.queryParams).then(response => {
        this.projectTypeList = this.handleTree(response.data, "projectTypeId", "projectTypePid");
        this.loading = false;
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
        children: node.children
      };
    },
	/** 查询部门下拉树结构 */
    getTreeselect() {
      listProjectType().then(response => {
        this.projectTypeOptions = [];
        const data = { projectTypeId: 0, projectTypeName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "projectTypeId", "projectTypePid");
        this.projectTypeOptions.push(data);
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
        projectCode:undefined,
        projectName:undefined,
        projectTypeId: undefined,
        projectTypePid: undefined,
        projectTypeName: undefined,
        orderNum: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        type: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
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
	  this.getTreeselect();
      this.open = true;
      this.title = "添加项目分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
	  this.getTreeselect();
      if (row != undefined) {
        this.form.projectTypePid = row.projectTypeId;
      }
      getProjectType(row.projectTypeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目分类";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.projectTypeId != undefined) {
            updateProjectType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addProjectType(this.form).then(response => {
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
      this.$confirm('是否确认删除项目分类编号为"' + row.projectTypeId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProjectType(row.projectTypeId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>