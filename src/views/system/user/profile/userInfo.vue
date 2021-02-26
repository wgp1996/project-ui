<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <div v-if="user.show">
    <el-form-item label="手机号" prop="userName">
      <el-input v-model="user.userName" />
    </el-form-item> 
      <el-form-item prop="certificatesType" label="机构类型">
        <el-select
          v-model="user.certificatesType"
          placeholder="请选择机构类型"
          style="width: 100%"
          class="specials"
          @change="selectType"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    <el-form-item :label="certificatesCode" prop="certificatesCode">
      <el-input v-model="user.certificatesCode" maxlength="11" />
    </el-form-item>
     <el-form-item :label="nickName" prop="nickName">
      <el-input v-model="user.nickName" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    </div>
    <!-- <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <div v-else>
  <el-form-item label="业户名称" prop="nickName">
      <el-input v-model="user.nickName" />
    </el-form-item> 
    <el-form-item label="手机号码" prop="phonenumber">
      <el-input v-model="user.phonenumber" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    </div>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";

export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: "姓名或公司名称不能为空", trigger: "blur" }
        ],
           certificatesCode: [
          { required: true, message: "身份证号或信用代码不能为空", trigger: "blur" }
        ],
        certificatesType:[
          { required: true, message: "机构类型不能为空", trigger: "blur" }
        ],
        userName:[
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        // email: [
        //   { required: true, message: "邮箱地址不能为空", trigger: "blur" },
        //   {
        //     type: "email",
        //     message: "'请输入正确的邮箱地址",
        //     trigger: ["blur", "change"]
        //   }
        // ],
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      mounted() {
      
     },
     // 机构类型选项
      options: [
        {
          value: "0",
          label: "经营性自然人",
        },
        {
          value: "1",
          label: "机构或企业",
        }
      ],
      nickName: "姓名",
      certificatesCode: "身份证号",
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    // 选择自然人或机构
       selectType(data) {
      //alert(data)
      if (data == 0) {
        this.nickName = "姓名";
        this.certificatesCode = "身份证号";
        // this.user.picture = "身份证照片:";
      } else {
        this.nickName = "公司名称";
        this.certificatesCode = "信用代码";
        // this.user.picture = "营业执照:";
      }
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    }
  }
};
</script>
