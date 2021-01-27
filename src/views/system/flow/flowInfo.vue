<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="流程名称" prop="flowName">
        <el-input
          v-model="queryParams.flowName"
          placeholder="请输入流程名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程编号" prop="flowNo">
        <!-- <el-input
          v-model="queryParams.flowNo"
          placeholder="请输入流程号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        /> -->
        <el-select
          v-model="queryParams.flowNo"
          placeholder="请选择流程编号"
          style="width: 100%"
        >
          <el-option
            v-for="dict in flowNopptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
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
          v-hasPermi="['system:flowInfo:add']"
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
          v-hasPermi="['system:flowInfo:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleEffect"
          v-hasPermi="['system:flowInfo:effect']"
          >启用</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handelCanCel"
          v-hasPermi="['system:flowInfo:cancel']"
          >取消</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:flowInfo:remove']"
          >删除</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:flowInfo:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="flowInfoList"
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
            <el-table-column label="节点编码" align="center" prop="nodeNo" />
            <el-table-column label="顺序" align="center" prop="nodeNum" />
            <el-table-column
              label="是否角色"
              align="center"
              prop="isRoleName"
            />
            <el-table-column
              label="人员/角色名称"
              align="center"
              prop="prName"
            />
            <el-table-column
              label="是否允许结束"
              align="center"
              prop="isEndName"
            />
            <el-table-column label="备注" align="center" prop="remark" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="流程名称" align="center" prop="flowName" />
      <el-table-column label="流程号" align="center" prop="flowNo" />
      <el-table-column label="状态" align="center" prop="statusName" />
      <el-table-column label="备注" align="center" prop="remark" />
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
            v-hasPermi="['system:flowInfo:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:flowInfo:remove']"
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

    <!-- 添加或修改流程表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="流程名称" prop="flowName">
              <el-input v-model="form.flowName" placeholder="请输入流程名称" />
            </el-form-item>
            <el-form-item label="流程编号" prop="flowNo">
              <!-- <el-input v-model="form.flowNo" placeholder="请输入流程编号" /> -->
              <el-select
                v-model="form.flowNo"
                placeholder="请选择流程编号"
                style="width: 100%"
                @change="selectFlow"
              >
                <el-option
                  v-for="dict in flowNopptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注说明" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注说明" />
            </el-form-item>
            <!-- <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item> -->
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="节点明细" name="second">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="goodsSelect"
                >新增</el-button
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
            <el-table-column label="是否角色" width="150">
              <template scope="scope">
                <el-select
                  v-model="scope.row.isRole"
                  placeholder="请选择是否角色"
                  style="width: 100%"
                  @change="choose(scope.$index, scope.row)"
                >
                  <el-option
                    v-for="dict in dwOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
                <!-- <span>{{scope.row.isRoleName}}</span> -->
              </template>
            </el-table-column>
            <el-table-column label="选择角色" width="200">
              <template scope="scope">
                <el-select
                  v-model="scope.row.prId"
                  placeholder="请选择角色"
                  style="width: 100%"
                  @change="selecter(scope.$index, scope.row)"
                  :disabled="scope.row.one"
                >
                  <el-option
                    v-for="dict in roleList"
                    :key="dict.roleKey"
                    :label="dict.roleName"
                    :value="dict.roleKey"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="选择人员" width="120">
              <template scope="scope">
                <!-- <el-input
                  :disabled="true"
                  size="small"
                  v-model="scope.row.prId"
                  placeholder=""
                ></el-input> -->
                <el-select
                  v-model="scope.row.prId"
                  placeholder="请选择人员"
                  style="width: 100%"
                  @change="selectStore(scope.$index, scope.row)"
                  :disabled="scope.row.two"
                >
                  <el-option
                    v-for="dict in people"
                    :key="dict.nickName"
                    :label="dict.userName"
                    :value="dict.nickName"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="备注说明" width="120">
              <template scope="scope">
                <el-input
                  size="small"
                  v-model="scope.row.remark"
                  placeholder="请输入备注"
                ></el-input>
              </template>
            </el-table-column>
            <!-- :onkeyup="scope.row.isEnd=scope.row.isEnd.replace(/[^\d.]/g,'')" -->
            <el-table-column label="是否允许结束" width="120">
              <template scope="scope">
                <el-select
                  v-model="scope.row.isEnd"
                  placeholder="请选择是否允许结束"
                  style="width: 100%"
                >
                  <el-option
                    v-for="dict in end"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="handleChildDelete(scope.$index, scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listFlowInfo,
  getFlowInfo,
  delFlowInfo,
  addFlowInfo,
  updateFlowInfo,
  exportFlowInfo,
  effectFlowInfo,
  listNode,
  delFlowNode,
  cancelFlowInfo,
} from "@/api/system/flowInfo";
import {
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  exportRole,
  dataScope,
  changeRoleStatus,
} from "@/api/system/role";
import { listUser } from "@/api/system/user";
export default {
  name: "FlowInfo",
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
      // 流程表表格数据
      flowInfoList: [],
      // 数据
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      activeName: "first",
      // 流程编号
      flowNopptions: [],
      one: false,
      two: false,
      //  是否明细
      dwOptions: [
        {
          value: "0",
          label: "否",
        },
        {
          value: "1",
          label: "是",
        },
      ],
      // 是否结束
      end: [
        {
          value: "0",
          label: "否",
        },
        {
          value: "1",
          label: "是",
        },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        flowName: undefined,
        flowNo: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        flowName: [
          { required: true, message: "流程名称不能为空", trigger: "blur" },
        ],
        flowNo: [
          { required: true, message: "流程编号不能为空", trigger: "blur" },
        ],
        //   isEnd: [
        //   { required: true, message: "是否允许结束不能为空", trigger: "blur" },
        // ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("flowType").then((response) => {
      // console.log(response)
      //  console.log("1")
      this.flowNopptions = response.data;
    });
  },
  methods: {
    selectFlow(data) {
      for (let i = 0; i < this.flowNopptions.length; i++) {
        if (this.flowNopptions[i].dictValue == data) {
          this.form.flowName = this.flowNopptions[i].dictLabel + "流程审批";
          break;
        }
      }
    },

    //追加子表必填样式
    starAdd(obj) {
      if (
        obj.columnIndex === 0 ||
        obj.columnIndex === 1 ||
        obj.columnIndex === 2 ||
        obj.columnIndex === 4
      ) {
        return "star";
      }
    },
    /** 查询流程表列表 */
    getList() {
      this.loading = true;
      listFlowInfo(this.queryParams).then((response) => {
        console.log(response);
        this.flowInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listRole(this.queryParams).then((response) => {
        console.log(response);
        this.roleList = response.rows;
      });
      listUser(this.queryParams).then((response) => {
        console.log(response);
        this.people = response.rows;
      });
    },
    choose(index, row) {
      for (let i = 0; i < this.dwOptions.length; i++) {
        console.log(row);
        console.log(this.dwOptions[i]);
        if ((this.dwOptions[i].value == row.isRole) == "1") {
          row.one = false;
          row.two = true;
        } else if ((this.dwOptions[i].value == row.isRole) == "0") {
          row.one = true;
          row.two = false;
        }
      }
    },
    // 角色
    selecter(index, row) {
      for (let i = 0; i < this.roleList.length; i++) {
        //  console.log(row.prId)
        //   console.log(this.tableData)
        //  console.log(this.roleList[i])
        if (this.roleList[i].roleId == row.prId) {
          for (var j = 0; j < this.tableData.length; j++) {
            if (this.tableData[j].prId == row.prId && index != j) {
              this.msgError("角色或选择人员名称不能重复!");
              row.prId = "";
              return;
            } else {
            }
          }
          row.prName = this.roleList[i].roleName;
          break;
        }
      }
    },
    // 选择人员
    selectStore(index, row) {
      for (let i = 0; i < this.people.length; i++) {
        //console.log(this.tableData)
        if (this.people[i].nickName == row.prId) {
          for (var j = 0; j < this.tableData.length; j++) {
            // console.log(this.tableData[j].prId)
            // console.log(row)
            //   console.log(index)
            //  console.log(j)
            if (this.tableData[j].prId == row.prId && index != j) {
              console.log(j);
              this.msgError("角色或选择人员名称不能重复!");
              row.prId = "";
              return;
            } else {
              // row.prName = this.roleList[i].roleName;
            }
          }
          // console.log(this.people[i].nickName)

          row.prName = this.people[i].userName;
          break;
        }
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 子表删除
    handleChildDelete(index, row) {
      if (row.id != "" && row.id != undefined && row.id != null) {
        delFlowNode(row.id);
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(index, 1);
      }
      console.log(index, row);
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        flowName: undefined,
        flowNo: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        status: "0",
        prName: undefined,
        prId: undefined,
        isRole: undefined,
        isEnd: undefined,
        rows: "",
        flowNo: undefined,
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
    // 新增节点明细
    goodsSelect() {
      this.$nextTick(() => {
        let goodsInfo = new Object();
        goodsInfo.isRole = "";
        goodsInfo.prId = "";
        goodsInfo.isEnd = "";
        goodsInfo.prName = "";
        goodsInfo.remark = "";
        goodsInfo.one = false;
        goodsInfo.two = false;
        this.tableData.push(goodsInfo);
      });
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
      this.title = "添加流程表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getFlowInfo(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程表";
        listNode(this.form.flowNo).then((response) => {
          this.tableData = response.rows;
          console.log(this.tableData);
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].isRole = this.tableData[i].isRole + "";
            this.tableData[i].isEnd = this.tableData[i].isEnd + "";
            if (this.tableData[i].isRole == 1) {
              this.tableData[i].one = false;
              this.tableData[i].two = true;
            } else {
              this.tableData[i].one = true;
              this.tableData[i].two = false;
              console.log(this.tableData);
            }
          }
        });
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.tableData.length > 0) {
        for (var i = 0; i < this.tableData.length; i++) {
          if (
            this.tableData[i].isRole == "" ||
            this.tableData[i].isEnd == "" ||
            this.tableData[i].prId == ""
          ) {
            this.msgError("检查明细信息必填项!");
            return;
          }
        }

        this.form.rows = JSON.stringify(this.tableData);
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.id != undefined) {
              updateFlowInfo(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addFlowInfo(this.form).then((response) => {
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
      } else {
        this.msgError("请填写子表信息!");
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除流程表编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delFlowInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 生效按钮操作 */
    handleEffect(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认启用流程表编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return effectFlowInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("启用成功");
        })
        .catch(function () {});
    },
    /** 取消生效按钮操作 */
    handelCanCel(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认取消流程表编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return cancelFlowInfo(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("取消成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有流程表数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportFlowInfo(queryParams);
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