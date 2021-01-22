<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
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
          v-hasPermi="['system:budgetInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:budgetInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:budgetInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:budgetInfo:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="budgetInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="项目编码" align="center" prop="projectCode" /> -->
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="预算收入" align="center" prop="budgetSr" />
      <!-- <el-table-column label="来源" align="center" prop="budgetSrFrom" /> -->
      <el-table-column label="预算毛利率" align="center" prop="budgetRate" />
      <el-table-column label="预算毛利" align="center" prop="budgetProfit" />
      <el-table-column label="销项税率" align="center" prop="budgetXxRate" />
      <el-table-column label="税金" align="center" prop="budgetTaxes" />
      <el-table-column label="预算成本" align="center" prop="budgetCost" />
      <el-table-column label="纯利润" align="center" prop="budgetNetProfit" />
      <el-table-column label="成本预算" align="center" prop="costBudget" />
      <el-table-column label="劳务预算" align="center" prop="labourBudget" />
      <!-- <el-table-column label="劳务类预算来源" align="center" prop="labourBudgetFrom" /> -->
      <el-table-column label="材料预算" align="center" prop="materialBudget" />
      <!-- <el-table-column label="材料预算来源" align="center" prop="materialBudgetFrom" /> -->
      <el-table-column label="其他预算" align="center" prop="outherBudget" />
      <!-- <el-table-column label="其他类预算来源" align="center" prop="outherBudgetFrom" /> -->
      <el-table-column label="间接费用预算" align="center" prop="indirectBudget" />
      <!-- <el-table-column label="间接类预算来源" align="center" prop="indirectBudgetFrom" /> -->
      <!-- <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="状态" align="center" prop="status" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:budgetInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:budgetInfo:remove']"
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

    <!-- 添加或修改项目预算对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="项目名称" prop="budgetSr">
          <el-input v-model="form.projectName" :disabled="true" placeholder="请选择项目" />
        </el-form-item>
        <el-form-item label="项目预算收入" prop="budgetSr">
          <el-input v-model="form.budgetSr" placeholder="请输入项目预算收入" />
        </el-form-item>
        <el-form-item label="来源" prop="budgetSrFrom">
          <el-input v-model="form.budgetSrFrom" placeholder="请输入来源" />
        </el-form-item>
        <el-form-item label="设置预算毛利率" prop="budgetRate">
          <el-input v-model="form.budgetRate" placeholder="请输入设置预算毛利率" />
        </el-form-item>
        <el-form-item label="项目预算毛利" prop="budgetProfit">
          <el-input v-model="form.budgetProfit" placeholder="请输入项目预算毛利" />
        </el-form-item>
        <el-form-item label="销项税率" prop="budgetXxRate">
          <el-input v-model="form.budgetXxRate" placeholder="请输入销项税率" />
        </el-form-item>
        <el-form-item label="税金" prop="budgetTaxes">
          <el-input v-model="form.budgetTaxes" placeholder="请输入税金" />
        </el-form-item>
        <el-form-item label="预算成本" prop="budgetCost">
          <el-input v-model="form.budgetCost" placeholder="请输入预算成本" />
        </el-form-item>
        <el-form-item label="纯利润" prop="budgetNetProfit">
          <el-input v-model="form.budgetNetProfit" placeholder="请输入纯利润" />
        </el-form-item>
        <el-form-item label="成本预算" prop="costBudget">
          <el-input v-model="form.costBudget" placeholder="请输入成本预算" />
        </el-form-item>
        <el-form-item label="劳务预算" prop="labourBudget">
          <el-input v-model="form.labourBudget" placeholder="请输入劳务类预算" />
        </el-form-item>
        <el-form-item label="劳务预算来源" prop="labourBudgetFrom">
          <el-input v-model="form.labourBudgetFrom" placeholder="请输入劳务类预算来源" />
        </el-form-item>
        <el-form-item label="材料预算" prop="materialBudget">
          <el-input v-model="form.materialBudget" placeholder="请输入材料预算" />
        </el-form-item>
        <el-form-item label="材料预算来源" prop="materialBudgetFrom">
          <el-input v-model="form.materialBudgetFrom" placeholder="请输入材料预算来源" />
        </el-form-item>
        <el-form-item label="其他预算" prop="outherBudget">
          <el-input v-model="form.outherBudget" placeholder="请输入其他类预算" />
        </el-form-item>
        <el-form-item label="其他预算来源" prop="outherBudgetFrom">
          <el-input v-model="form.outherBudgetFrom" placeholder="请输入其他类预算来源" />
        </el-form-item>
        <el-form-item label="间接费用预算" prop="indirectBudget">
          <el-input v-model="form.indirectBudget" placeholder="请输入间接类预算" />
        </el-form-item>
        <el-form-item label="间接费用预算来源" prop="indirectBudgetFrom">
          <el-input v-model="form.indirectBudgetFrom" placeholder="请输入间接类预算来源" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <project-select
      v-if="selectProjectDialog"
      ref="selectProject"
      @selectData="selectData"
      @selectDataMore="selectDataMore"
    ></project-select>
  </div>
</template>

<script>
import { listBudgetInfo, getBudgetInfo, delBudgetInfo, addBudgetInfo, updateBudgetInfo, exportBudgetInfo } from "@/api/system/budgetInfo";
export default {
  name: "BudgetInfo",
  data() {
    return {
      selectProjectDialog:false,
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
      // 项目预算表格数据
      budgetInfoList: [],
      //项目列表
      projectList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        budgetSr: undefined,
        budgetSrFrom: undefined,
        budgetRate: undefined,
        budgetProfit: undefined,
        budgetXxRate: undefined,
        budgetTaxes: undefined,
        budgetCost: undefined,
        budgetNetProfit: undefined,
        costBudget: undefined,
        labourBudget: undefined,
        labourBudgetFrom: undefined,
        materialBudget: undefined,
        materialBudgetFrom: undefined,
        outherBudget: undefined,
        outherBudgetFrom: undefined,
        indirectBudget: undefined,
        indirectBudgetFrom: undefined,
        status: undefined,
        projectCode: undefined,
        projectName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
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
        this.$refs.selectProject.visible = true;
      });
    },
     selectData(row) {
      this.$nextTick(() => {
        this.form.projectCode=row.projectCode;
        this.form.projectName=row.projectName;
        this.$refs.selectProject.visible = false;
      });
    },
    /** 查询项目预算列表 */
    getList() {
      this.loading = true;
      listBudgetInfo(this.queryParams).then(response => {
        this.budgetInfoList = response.rows;
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
        budgetSr: undefined,
        budgetSrFrom: undefined,
        budgetRate: undefined,
        budgetProfit: undefined,
        budgetXxRate: undefined,
        budgetTaxes: undefined,
        budgetCost: undefined,
        budgetNetProfit: undefined,
        costBudget: undefined,
        labourBudget: undefined,
        labourBudgetFrom: undefined,
        materialBudget: undefined,
        materialBudgetFrom: undefined,
        outherBudget: undefined,
        outherBudgetFrom: undefined,
        indirectBudget: undefined,
        indirectBudgetFrom: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        status: "0",
        projectCode: undefined,
        projectName: undefined
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
      this.title = "添加项目预算";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBudgetInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目预算";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateBudgetInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addBudgetInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除项目预算编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBudgetInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有项目预算数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBudgetInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>