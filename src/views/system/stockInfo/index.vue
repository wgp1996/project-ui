<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <!-- <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="仓库名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入仓库名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> --> 
         <el-form-item label="物料编码" prop="goodsCode">
        <el-input
          v-model="queryParams.goodsCode"
          placeholder="请输入物料编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
     <el-form-item label="物料名称" prop="goodsName">
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入物料名称"
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:stockInfo:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="stockInfoList" @selection-change="handleSelectionChange" show-summary :summary-method="getSummaries">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <!-- <el-table-column label="单号" align="center" prop="djNumber" /> -->
      <!-- <el-table-column label="仓库编码" align="center" prop="storeCode" /> -->
      <!-- <el-table-column label="仓库名称" align="center" prop="storeName" /> -->
      <!-- <el-table-column label="单据日期" align="center" prop="djTime" /> -->
      <el-table-column label="物料编码" align="center" prop="goodsCode" />
      <el-table-column label="物料名称" align="center" prop="goodsName" />
      <el-table-column label="单位" align="center" prop="goodsDw" />
      <el-table-column label="规格" align="center" prop="goodsGg" />
      <el-table-column label="库存数量" align="center" prop="goodsNum" />
      <!-- <el-table-column label="单价" align="center" prop="goodsPrice" /> -->
      <!-- <el-table-column label="金额" align="center" prop="goodsMoney" /> -->
       <!-- <el-table-column label="实际入库时间" align="center" prop="rkTime" /> -->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改库存管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listStockInfo, getStockInfo, delStockInfo, addStockInfo, updateStockInfo, exportStockInfo } from "@/api/system/stockInfo";

export default {
  name: "StockInfo",
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
      // 库存管理表格数据
      stockInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        djNumber: undefined,
        projectName: undefined,
        storeName: undefined,
        goodsName: undefined,
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
    /** 查询库存管理列表 */
    getList() {
      this.loading = true;
      listStockInfo(this.queryParams).then(response => {
        this.stockInfoList = response.rows;
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
        djNumber: undefined,
        projectCode: undefined,
        projectName: undefined,
        storeCode: undefined,
        storeName: undefined,
        djTime: undefined,
        rkTime: undefined,
        goodsCode: undefined,
        goodsName: undefined,
        goodsDw: undefined,
        goodsGg: undefined,
        goodsNum: undefined,
        goodsPrice: undefined,
        goodsMoney: undefined,
        rkOrderId: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
      };
      this.resetForm("form");
    },
    // 合计
    getSummaries(param) {
      // console.log(param)
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 7) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          // console.log(values)
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
             if(index==7){
                //sums[7] += '';
                sums[index] = '合计:';
             }
            } else {
            sums[index] = '';
          }
        });

        return sums;
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
      this.title = "添加库存管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStockInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改库存管理";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateStockInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addStockInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除库存管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delStockInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有库存管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportStockInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>