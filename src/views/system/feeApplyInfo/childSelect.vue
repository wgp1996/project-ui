<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="visible"
    width="750px"
  >
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="100px"
        >
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
            <el-button
              icon="el-icon-check"
              type="warning"
              size="mini"
              @click="selectDataMore"
              >批量选择</el-button
            >
          </el-form-item>
        </el-form>

        <el-table
          v-loading="loading"
          :data="feeList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="费用项目名称" align="center" prop="feeName" />
          <el-table-column label="费用项目编码" align="center" prop="feeCode" />
          <el-table-column label="分类编码" align="center" prop="feeTypeCode" />
          <el-table-column label="分类名称" align="center" prop="feeTypeName" />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-check"
                @click="selectGoodsData(scope.row)"
                >选择</el-button
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
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { listFeeInfo } from "@/api/system/feeInfo";
export default {
  name: "feeInfoChild",
  data() {
    return {
      goodsSelectList: [],
      feeList: [],
      goodsTypeOptions: [],
      visible: false,
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
      // 市场摊位信息表格数据
      stallList: [],
      // 弹出层标题
      title: "费用项目信息",
      // 是否显示弹出层
      open: false,
      // 所属非类市场
      markDatas: [],
      //摊位状态
      perationOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
       
      },
      // 表单参数
      form: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    selectGoodsData(row) {
      this.$emit("selectchild", row);
    },
      getList() {
      this.loading = true;
      listFeeInfo(this.queryParams).then(response => {
        this.feeList = response.rows;
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
        stallName: undefined,
        stallCode: undefined,
        markCode: undefined,
        regionArea: undefined,
        stallStatus: undefined,
        stallStartTime: undefined,
        stallEndTime: undefined,
        stallMoney: undefined,
        stallLeaseholder: undefined,
        stallNote: undefined,
        createUser: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
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
      this.goodsSelectList = selection;
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    selectDataMore() {
      this.$emit("selectchildMore", this.goodsSelectList);
    },
  },
};
</script>