<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <!-- <el-form-item label="费用分类父id" prop="feeTypePid">
        <el-input
          v-model="queryParams.feeTypePid"
          placeholder="请输入费用分类父id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="费用分类名称" prop="feeTypeName">
        <el-input
          v-model="queryParams.feeTypeName"
          placeholder="请输入费用分类名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="显示顺序" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入显示顺序"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="档案类型 0类 1款 2项" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择档案类型 0类 1款 2项" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
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
          v-hasPermi="['system:feeType:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="feeTypeList"
      row-key="feeTypeId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="费用分类父id" align="center" prop="feeTypePid" />
      <el-table-column label="费用分类名称" align="center" prop="feeTypeName" />
      <!-- <el-table-column label="显示顺序" align="center" prop="orderNum" /> -->
      <el-table-column label="档案类型 0类 1款 2项" align="center" prop="type" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:feeType:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:feeType:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改费用项目分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="父级编号" prop="feeTypePid">
          <treeselect v-model="form.feeTypePid" :options="feeTypeOptions" :normalizer="normalizer" placeholder="请选择费用分类父id" />
        </el-form-item>
        <el-form-item label="费用分类名称" prop="feeTypeName">
          <el-input v-model="form.feeTypeName" placeholder="请输入费用分类名称" />
        </el-form-item>
        <!-- <el-form-item label="显示顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
        </el-form-item> -->
        <el-form-item label="档案类型">
          <el-select v-model="form.type" placeholder="请选择档案类型">
            <!-- <el-option label="请选择字典生成" value="" /> -->
              <el-option
                      v-for="item in personList"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listFeeType, getFeeType, delFeeType, addFeeType, updateFeeType, exportFeeType } from "@/api/system/feeType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "FeeType",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      personList:[],
      loading: true,
      // 费用项目分类表格数据
      feeTypeList: [],
      // 费用项目分类树选项
      feeTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        feeTypePid: undefined,
        feeTypeName: undefined,
        orderNum: undefined,
        type: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        feeTypeName:[{required: true,message: "费用分类名称不能为空",trigger: "blur",}],
      }
    };
  },
  created() {
    this.getList();
     this.getDicts("sys_DA_type").then((response) => {
      this.personList = response.data;
    });
  },
  methods: {
    /** 查询费用项目分类列表 */
    getList() {
      this.loading = true;
      listFeeType(this.queryParams).then(response => {
        var realdata=response.data;
       if(realdata){
         for(var i=0;i<realdata.length;i++){
            if(realdata[i].type==0){
                realdata[i].type="类"
             }else if(realdata[i].type==1){
                realdata[i].type="款"
             }else{
                realdata[i].type="款"
             }
          }
        }
         this.feeTypeList = this.handleTree(response.data, "feeTypeId", "feeTypePid");
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
        data.children = this.handleTree(response.data, "feeTypeId", "feeTypePid");
        this.feeTypeOptions.push(data);
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
        feeTypeId: undefined,
        feeTypePid: undefined,
        feeTypeName: undefined,
        orderNum: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        type: "0"
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
      this.title = "添加费用项目分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
	  this.getTreeselect();
      if (row != undefined) {
        this.form.feeTypePid = row.feeTypeId;
      }
      getFeeType(row.feeTypeId).then(response => {
        this.form = response.data;
         if( this.form.type==0){
                 this.form.type="类"
             }else if( this.form.type==1){
                  this.form.type="款"
             }else{
                  this.form.type="项"
             }
           
        
        this.open = true;
        this.title = "修改费用项目分类";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.feeTypeId != undefined) {
            updateFeeType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addFeeType(this.form).then(response => {
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
      this.$confirm('是否确认删除费用项目分类编号为"' + row.feeTypeId + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delFeeType(row.feeTypeId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>