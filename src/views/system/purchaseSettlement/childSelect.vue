<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="visible2"
    width="1000px"
  >
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="100px"
        >
          <el-form-item label="物资名称" prop="goodsName">
            <el-input
              style="width: 200px"
              v-model="queryParams.goodsName"
              placeholder="请输入物资名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="物资编码" prop="goodsCode">
            <el-input
              style="width: 200px"
              v-model="queryParams.goodsCode"
              placeholder="请输入物资编码"
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
          :data="goodsList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="物资名称" align="center" prop="goodsName" />
          <el-table-column label="物资编码" align="center" prop="goodsCode" />
          <el-table-column label="规格" align="center" prop="goodsGg" />
          <el-table-column label="单位" align="center" prop="goodsDw" />
          <el-table-column label="订单数量" align="center" prop="goodsNum" />
          <el-table-column label="剩余数量" align="center" prop="surplusNum" />
           <!-- <el-table-column label="单价" align="center" prop="goodsPrice" /> -->
          <!-- <el-table-column label="金额" align="center" prop="goodsMoney" /> -->
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
// import { leaseStallList } from "@/api/system/stall";
import { listGoodsType } from "@/api/system/goodsType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
// import { listGoods } from "@/api/system/goods";
// import { wareSelectList } from "@/api/system/purchaseOrder";
import {settlementSelectList} from "@/api/system/purchaseWare";
export default {
  name: "Stall",
  components: { Treeselect },
  props: ["system"],
  data() {
    return {
      goodsSelectList: [],
      goodsList: [],
      goodsTypeOptions: [],
      visible2: false,

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
      title: "选择入库信息",
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
        khCode: this.system,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stallName: [
          { required: true, message: "摊位名称不能为空", trigger: "blur" },
        ],
        stallCode: [
          { required: true, message: "摊位编码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  // watch:{
  //     pshow(newValue,oldValue){
  //        this.visible=newValue;
  //     }
  // },
  created() {
    this.getList();
  },
  watch:{
	  system(newValue, oldValue) {
		   var _this = this;
        _this.queryParams.khCode = newValue;
     
	}
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
    /** 查询市场摊位信息列表 */
    getList() {
      this.loading = true;
      if (
        this.queryParams.khCode != undefined &&
        this.queryParams.khCode != ""
      ) {
        settlementSelectList(this.queryParams).then((response) => {
          this.goodsList = response.rows;
          console.log(response);
          // this.total = response.total;
          this.loading = false;
        });
      } else {
        this.loading = false;
        this.msgError("请选择供货商!");
        return;
      }
    },
    /** 转换商品分类数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.goodsTypeId,
        label: node.goodsTypeName,
        children: node.children,
      };
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      listGoodsType().then((response) => {
        this.goodsTypeOptions = [];
        const data = {
          goodsTypeId: 0,
          goodsTypeName: "顶级节点",
          children: [],
        };
        data.children = this.handleTree(
          response.data,
          "goodsTypeId",
          "goodsTypePid"
        );
        this.goodsTypeOptions.push(data);
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