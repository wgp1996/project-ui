<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
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
        >搜索</el-button>
        <!-- <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:projectType:add']"
        >新增</el-button> -->
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
          v-hasPermi="['system:goods:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:goods:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:goods:remove']"
        >删除</el-button>
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
      row-key="projectTypeId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column label="项目分类名称" align="center" prop="projectTypeName" /> -->
       <el-table-column label="项目编码" align="center" prop="projectCode" />
       <el-table-column label="项目名称" align="center" prop="projectName" />
       <el-table-column label="项目简称" align="center" prop="projectNameJc" />
        <el-table-column label="项目类型" align="center" prop="projectType" />
        <el-table-column label="项目经理" align="center" prop="projectManagerName" />
        <el-table-column label="开工日期" align="center" prop="projectStartTime" />
        <el-table-column label="完工日期" align="center" prop="projectEndTime" />
        <el-table-column label="启用预算" align="center" prop="ysStatus" />
        <el-table-column label="创建人" align="center" prop="createBy" />
      <!-- <el-table-column label="显示顺序" align="center" prop="orderNum" /> -->
      <el-table-column label="创建日期" align="center" prop="createTime" />
  
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:projectType:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:projectType:remove']"
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
    <!-- 添加或修改项目分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="项目编码" prop="projectCode">
          <!-- <treeselect v-model="form.projectTypePid" :options="projectTypeOptions" :normalizer="normalizer" placeholder="请选择项目分类父级" /> -->
          <el-input v-model="form.projectCode" placeholder="请输入项目编码" />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目简称" prop="projectNameJc">
          <el-input v-model="form.projectNameJc" placeholder="请输入项目简称" />
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
            <treeselect v-model="form.projectType" :options="projectTypeOptions" :normalizer="normalizer" placeholder="请选择项目类型" /> 
        </el-form-item>
        <el-form-item label="项目经理" prop="projectManagerName">
          <el-select
                    v-model="form.projectManagerName"
                    placeholder="请选择经理"
                    filterable
                    style="width:100%"
                    @change="selectStore"
                  >
                    <el-option
                      v-for="item in people"
                      :key="item.userName "
                      :label="item.nickName"
                      :value="item.userName "
                    >
                      <span style="width:100%">{{item.nickName}}</span>
                    </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="开工日期" prop="projectStartTime">
               <el-date-picker
                clearable
                style="width:100%"
                v-model="form.projectStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="开工日期"
              ></el-date-picker>
               
          </el-form-item>
           <el-form-item label="完工日期" prop="projectEndTime">
               <el-date-picker
                clearable
                style="width:100%"
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
          <el-form-item label="项目说明" >
              <el-input type="textarea" :rows="2" v-model="form.remark" placeholder="请输入项目说明,200字以内" />
          </el-form-item>
        <!-- <el-form-item label="显示顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
        </el-form-item>-->
      </el-form> 
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProjectInfo, getProjectInfo, delProjectInfo, addProjectInfo, updateProjectInfo, exportProjectInfo } from "@/api/system/projectInfo";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listProjectType } from "@/api/system/projectType";
import { listUser } from "@/api/system/user";
export default {
  name: "ProjectType",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 主单数据
      projectTypeList: [],
      // 项目分类树选项
      projectTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
       // 非单个禁用
      single: true,
       // 非多个禁用
      multiple: true,
      //经理
      people:[],
       // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        
        projectName:undefined,
        projectCode:undefined,
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
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
         projectCode: [
          { required: true, message: "项目编码不能为空", trigger: "blur" }
        ],
         projectNameJc: [
          { required: true, message: "项目简称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询项目分类列表 */
    getList() {
      this.loading = true;
      listProjectInfo(this.queryParams).then(response => {
        console.log(response)
        //this.projectTypeList = this.handleTree(response.data, "projectTypeId", "projectTypePid");
        this.projectTypeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listUser(this.queryParams).then(response => {
        console.log(response)
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
        children: node.children
      };
    },
	/** 查询部门下拉树结构 */
    getTreeselect() {
      listProjectType().then(response => {
        console.log(response)
        this.projectTypeOptions = [];
        const data = { projectTypeId: 0, projectTypeName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "projectTypeId", "projectTypePid");
        this.projectTypeOptions.push(data);
      });
    },
   selectStore(data){
      //根据仓库编码查找仓库名称
      for(let i=0;i<this.people.length;i++){
        if(this.people[i].nickName==data){
          this.form.projectManagerCode=this.people[i].userName;
          break;
        }
      }
    },
   
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
        projectCode: undefined, projectName : undefined,
        projectNameJc: undefined,  projectType: undefined,
        projectManagerName: undefined,  projectStartTime: undefined,
        projectEndTime: undefined,  ysStatus: undefined,  
        remark: undefined,
        projectManagerCode:undefined

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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
     this.getTreeselect();
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
      // if (row != undefined) {
      //   this.form.projectTypePid = row.projectTypeId;
      // }
       const id = row.id || this.ids;
      getProjectInfo(id).then(response => {
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
            updateProjectInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addProjectInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除项目分类编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProjectInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>