<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="费用项目名称" prop="feeName">
        <el-input
          v-model="queryParams.feeName"
          placeholder="请输入费用项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="费用项目编码" prop="feeCode">
        <el-input
          v-model="queryParams.feeCode"
          placeholder="请输入费用项目编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="分类编码" prop="feeTypeCode">
        <el-input
          v-model="queryParams.feeTypeCode"
          placeholder="请输入分类编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类名称" prop="feeTypeName">
        <el-input
          v-model="queryParams.feeTypeName"
          placeholder="请输入分类名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:feeInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:feeInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:feeInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:feeInfo:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="feeInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <el-table-column label="费用项目名称" align="center" prop="feeName" />
      <el-table-column label="费用项目编码" align="center" prop="feeCode" />
      <!-- <el-table-column label="分类编码" align="center" prop="feeTypeCode" /> -->
      <el-table-column label="分类名称" align="center" prop="feeTypeName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:feeInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:feeInfo:remove']"
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

    <!-- 添加或修改费用项目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="费用项目名称" prop="feeName">
          <el-input v-model="form.feeName" placeholder="请输入费用项目名称" />
        </el-form-item>
        <el-form-item label="费用项目编码" prop="feeCode">
          <el-input v-model="form.feeCode" placeholder="费用项目编码自动生成"  />
        </el-form-item>
        <!-- <el-form-item label="分类" prop="feeTypeCode"> -->
          <!-- <el-input v-model="form.feeTypeCode" placeholder="请输入分类编码" /> -->
       <!-- </el-form-item> -->
          <el-form-item label="所属分类" prop="feeTypeCode">
          <treeselect v-model="form.feeTypeCode" :options="feeTypeOptions" :normalizer="normalizer" placeholder="请选择所属分类" />
        </el-form-item>
        <!-- <el-form-item label="分类名称" prop="feeTypeName">
          <el-input v-model="form.feeTypeName" placeholder="请输入分类名称" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listFeeInfo, getFeeInfo, delFeeInfo, addFeeInfo, updateFeeInfo, exportFeeInfo } from "@/api/system/feeInfo";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listFeeType} from "@/api/system/feeType";
export default {
  name: "FeeInfo",
  components: { Treeselect },
  data() {
    return {
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
      // 费用项目表格数据
      feeInfoList: [],
      // 费用项目分类树选项
      feeTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        feeName: undefined,
        feeCode: undefined,
        feeTypeCode: undefined,
        feeTypeName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
         feeName:[{required: true,message: "费用项目名称不能为空",trigger: "blur",}],
         feeCode:[{required: true,message: "费用项目编码不能为空",trigger: "blur",}],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询费用项目列表 */
    getList() {
      this.loading = true;
      listFeeInfo(this.queryParams).then(response => {
        this.feeInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
       /** 转换费用项目分类数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.feeTypeId,
        label: node.feeTypeName,
        children: node.children
      };
    },
	/** 查询部门下拉树结构 */
    getTreeselect() {
      listFeeType().then(response => {
        this.feeTypeOptions = [];
        const data = { feeTypeId: 0, feeTypeName: '顶级节点', children: [] };
        console.log(response.data)
        data.children = this.handleTree(response.data, "feeTypeId", "feeTypeCode");
        this.feeTypeOptions.push(data);
        console.log( this.feeTypeOptions)
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
        feeName: undefined,
        feeCode: undefined,
        feeTypeCode: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        feeTypeName: undefined
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
      this.getTreeselect();
      this.title = "添加费用项目";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.feeTypeCode = row.feeTypeId;
      }
      const id = row.id || this.ids
      getFeeInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改费用项目";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateFeeInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addFeeInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除费用项目编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFeeInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有费用项目数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFeeInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>