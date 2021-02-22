<template>
  <div class="login">
    <canvas class="cavs" @mousemove="mousemove" @mouseleave="mouseleave">
    </canvas>
    <el-form
      v-show="loginStatus"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <!-- <h3 class="title">项目管理平台</h3> -->
     <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="快速登录" name="first"></el-tab-pane>
        <el-tab-pane label="快速注册" name="second"></el-tab-pane>
      </el-tabs>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon
            slot="prefix"
            icon-class="validCode"
            class="el-input__icon input-icon"
          />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" />
        </div>
      </el-form-item>
      <el-checkbox
        v-model="loginForm.rememberMe"
        style="margin: 0px 0px 25px 0px"
        >记住密码</el-checkbox
      >
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
         <el-form-item style="text-align:center;position:relative;top:5px">
           <img src="../assets/image/weixin.png" style="width:30px;height:30px">
          </el-form-item>
    </el-form>

    <el-form
      v-show="registerStatus"
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="快速登录" name="first"></el-tab-pane>
        <el-tab-pane label="快速注册" name="second"></el-tab-pane>
      </el-tabs>
      <!-- <el-form-item prop="nickName">
        <el-input
          v-model="registerForm.nickName"
          type="text"
          auto-complete="off"
          placeholder="公司名称"
        >
          <svg-icon
            slot="prefix"
            icon-class="form"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item> -->
        <el-form-item prop="userName">
        <el-input
          v-model="registerForm.userName"
          type="text"
          auto-complete="off"
          placeholder="手机号"
        >
          <svg-icon
            slot="prefix"
            icon-class="phone"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
        <el-form-item prop="smsCode" >
        <el-input
          v-model="registerForm.smsCode"
          type="text"
          auto-complete="off"
          placeholder="验证码"
          style="width:350px;float:left"
        >
          <svg-icon
            slot="prefix"
            icon-class="phone"
            class="el-input__icon input-icon"
          />
        </el-input>
        <el-button type="primary" style="float:left;width:130px;height:38px;margin-left:10px" @click="getphoneonecode" :disabled="phonedisabled">{{phonetext}}</el-button>
      </el-form-item>
      <!-- <el-form-item prop="userName">
        <el-input
          v-model="registerForm.userName"
          type="text"
          auto-complete="off"
          placeholder="登录账号"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item> -->
       <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
        >
          <svg-icon
            slot="prefix"
            icon-class="password"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="certificatesType">
            <el-select v-model="registerForm.certificatesType" placeholder="请选择机构类型" style="width:100%" class="specials" @change="selectType">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
         </el-select>  
      </el-form-item>
      <el-form-item prop="nickName">
             <el-input
          v-model="registerForm.nickName"
          type="text"
          auto-complete="off"
          :placeholder="nickName"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input> 
      </el-form-item>
      <el-form-item prop="certificatesCode">
             <el-input
          v-model="registerForm.certificatesCode"
          type="text"
          auto-complete="off"
          :placeholder="certificatesCode"
        >
          <svg-icon
            slot="prefix"
            icon-class="user"
            class="el-input__icon input-icon"
          />
        </el-input> 
      </el-form-item>
       
       <el-form-item prop="email">
        <el-input
          v-model="registerForm.email"
          type="text"
          auto-complete="off"
          placeholder="邮箱"
        >
          <svg-icon
            slot="prefix"
            icon-class="email"
            class="el-input__icon input-icon"
          />
        </el-input>
      </el-form-item>
      <el-form-item>
          <label  style="width:80px;height:10px;display:inline-block;float:left;color:#fff">{{picture}}</label>
          <label for="file" style="width:100px;height:100px;display:inline-block;position:absolute"></label>
          <img id="imghead" width=100px height=100px border=0 :src='imageUrl'>
					<input type="file" @change="changepic" id="file" style="display: none;" />
      </el-form-item>
    
      <el-form-item style="width: 100%">
        <el-button
          :loading="zhuceloading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click="handleRegister"
        >
          <span v-if="!zhuceloading">注册</span>
          <span v-else>注册中...</span>
        </el-button>
      </el-form-item>
        <el-form-item style="text-align:center;position:relative;top:5px">
           <img src="../assets/image/weixin.png" style="width:30px;height:30px">
          </el-form-item>
    </el-form>
  
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2019 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { sendSms } from "@/api/system/user";
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { registerUser} from "@/api/system/user";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import $ from "jquery";
     var wait=60;
     // 手机号验证
const validatePhone = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入手机号"));
  } else {
    if (!/^1[3456789]\d{9}$/.test(value)) {
      callback(new Error("请输入正确的手机号"));
    } else {
      callback();
    }
  }
}; 
export default {
  name: "Login",
  data() {
    return {
      activeName:"first",
      registerStatus:false,
      loginStatus:true,
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      nickName:"姓名",
      certificatesCode:"身份证号",
      picture:"身份证照片:",
      imageUrl: 'https://www.lczhuisu.cn:443/zspt/zspt/css/imgs/add.png',
      phonetext:'获取验证码',
 
      // 验证码禁用
      phonedisabled:false,
      registerForm:{
        userName: "", 
        password:"",
         // 验证码
        phonencode:'',
        // 机构类型
        certificatesType:"0",
        certificatesImg:'',
        // 密码
        email:''
      },
      // 机构类型选项
        options: [{
          value: '0',
          label: '经营性自然人'
        }, {
          value: '1',
          label: '机构或企业'
        }],
      registerRules: {
        userName: [
          // { required: true, trigger: "blur", message: "手机号不能为空" },
             { validator: validatePhone, trigger: "change" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        nickName: [
          { required: true, trigger: "blur", message: "姓名或公司名称不能为空" },
        ],
        smsCode: [
          { required: true, trigger: "blur", message: "验证码不能为空" },
        ],
        certificatesCode: [
          { required: true, trigger: "blur", message: "信用代码或身份证号不能为空" },
        ],
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        code: [
          { required: true, trigger: "change", message: "验证码不能为空" },
        ],
      },
      loading: false,
      zhuceloading:false,
      redirect: undefined,
      // 新加的
      canvas: { width: undefined, height: undefined },
      context: null,
      ctx: null,
      x: undefined,
      y: undefined,
      vx: undefined,
      vy: undefined,
      radius: undefined,
      color: undefined,
      r: undefined,
      g: undefined,
      b: undefined,
      style: undefined,

      dots: { nb: 250, distance: 100, d_radius: 150, array: [] },
      mousePosition: {
        x: (30 * window.innerWidth) / 100,
        y: (30 * window.innerHeight) / 100,
      },
    };
  },
  beforeCreate() {
    localStorage.setItem("user", "");
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    // 选择机构或自然人
    selectType(data){
       //alert(data)
       if(data==0){
         this.nickName="姓名"; 
          this.certificatesCode="身份证号"
          this.picture="身份证照片:"
       }else{
          this.nickName="公司名称"; 
          this.certificatesCode="信用代码"
          this.picture="营业执照:"
       }
    },
 changepic(e) {
        let _this = this;
		    var reads = new FileReader();
          console.log(reads)
        
					var f =e.target.files[0];
					console.log(f)
					
					reads.readAsDataURL(f);
					reads.onload = function(e) {
					    console.log(e)
					    if(f.size/1024<=1024){
                _this.imageUrl = this.result;
                _this.registerForm.certificatesImg=this.result;
					   }else{
               alert("2")
					      let image = new Image()  
					      image.src = e.target.result
					      image.onload = function() {  
					       let canvas = document.createElement('canvas'),
					        context = canvas.getContext('2d'),
					        imageWidth = image.width / 4,  
					        imageHeight = image.height / 4, 
					        data = ''  
					        canvas.width = imageWidth  
					        canvas.height = imageHeight  
					        context.drawImage(image, 0, 0, imageWidth, imageHeight)
                   data = canvas.toDataURL('image/jpeg')
                  console.log(data)
                   _this.imageUrl = data;
                  _this.registerForm.certificatesImg=data;
				
					      };
					   }
					   
        	   }
            // 另一种方案
            // let _this = this;
            // // console.log(e.target.files[0])
            // //if (!e || !window.FileReader) return  // 看支持不支持FileReader
           
            // let reader = new FileReader()
            // reader.readAsDataURL(e.target.files[0]) // 这里是最关键的一步，转换就在这里 （参数必须是blob对象）
            // reader.onloadend = function () {
            //     _this.imageUrl = this.result
            // }

				
      },
      // 获取验证码
      getphoneonecode(){
        sendSms(this.registerForm.userName);
        this.getphonecode()
      },
    getphonecode(){
      var that=this;
        if(wait == 0){
              this.phonedisabled=false;
              this.phonetext= "获取验证码";
              wait = 60;
            }else{
              // alert("1")
            
               wait--;
                this.phonedisabled=true;
                this.phonetext= wait + "s";
                // $(".clock").css({ color: "#000", background: "#f2f2f2" });
                setTimeout(function(){
                   that.getphonecode()
                }, 1000);
            }
         
    },
    handleClick(tab, event) {
        console.log(tab.index);
        if(tab.index==0){
          this.loginStatus=true;
          this.registerStatus=false;
        }else{
          this.loginStatus=false;
          this.registerStatus=true;
         //this.resetForm("registerForm");
        }
    },
    getCode() {
      getCodeImg().then((res) => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              localStorage.setItem("user", this.loginForm.username);
              this.$router.push({ path: "/index" });
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    },
    /** 提交按钮 */
    handleRegister: function() {
  
      this.$refs["registerForm"].validate(valid => {
        if (valid) {
              this.zhuceloading = true;
            registerUser(this.registerForm).then(response => {
              if (response.code === 200) {
                this.zhuceloading = false;
                this.msgSuccess("注册成功");
                this.activeName="first";
                this.loginStatus=true;
                this.registerStatus=false;
                this.resetForm("registerForm");
              } else {
                this.msgError(response.msg);
              }
            });
        }
      });
    },
    colorValue(min) {
      return Math.floor(Math.random() * 255 + min);
    },

    Color(min, _this) {
      min = min || 0;
      // console.log(this)

      this.r = _this.colorValue(min);
      this.g = _this.colorValue(min);
      this.b = _this.colorValue(min);
      this.style = _this.createColorStyle(this.r, this.g, this.b);
    },
    createColorStyle(r, g, b) {
      return "rgba(" + r + "," + g + "," + b + ", 0.8)";
    },
    createDots() {
      // console.log(this)
      var that = this;
      for (var i = 0; i < this.dots.nb; i++) {
        this.dots.array.push(new this.Dot(that));
      }
    },
    Dot(that) {
      //  console.log(this)
      //  console.log(that)
      this.x = Math.random() * that.canvas.width;
      this.y = Math.random() * that.canvas.height;

      this.vx = -0.5 + Math.random();
      this.vy = -0.5 + Math.random();

      this.radius = Math.random() * 2;

      this.color = new that.Color("", that);
      var _this_ = this;
      // console.log(this.color)
      this.prototype = {
        draw: function () {
          // console.log(this)
          that.ctx.beginPath();
          that.ctx.fillStyle = _this_.color.style;
          that.ctx.arc(_this_.x, _this_.y, _this_.radius, 0, Math.PI, false);
          that.ctx.fill();
        },
      };
    },
    moveDots() {
      for (var i = 0; i < this.dots.nb; i++) {
        var dot = this.dots.array[i];

        if (dot.y < 0 || dot.y > this.canvas.height) {
          dot.vx = dot.vx;
          dot.vy = -dot.vy;
        } else if (dot.x < 0 || dot.x > this.canvas.width) {
          dot.vx = -dot.vx;
          dot.vy = dot.vy;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
    },
    connectDots() {
      for (var i = 0; i < this.dots.nb; i++) {
        for (var j = 0; j < this.dots.nb; j++) {
          var i_dot = this.dots.array[i];
          var j_dot = this.dots.array[j];

          if (
            i_dot.x - j_dot.x < this.dots.distance &&
            i_dot.y - j_dot.y < this.dots.distance &&
            i_dot.x - j_dot.x > -this.dots.distance &&
            i_dot.y - j_dot.y > -this.dots.distance
          ) {
            if (
              i_dot.x - this.mousePosition.x < this.dots.d_radius &&
              i_dot.y - this.mousePosition.y < this.dots.d_radius &&
              i_dot.x - this.mousePosition.x > -this.dots.d_radius &&
              i_dot.y - this.mousePosition.y > -this.dots.d_radius
            ) {
              this.ctx.beginPath();
              this.ctx.strokeStyle = this.averageColorStyles(i_dot, j_dot);
              this.ctx.moveTo(i_dot.x, i_dot.y);
              this.ctx.lineTo(j_dot.x, j_dot.y);
              this.ctx.stroke();
              this.ctx.closePath();
            }
          }
        }
      }
    },
    mixComponents(comp1, weight1, comp2, weight2) {
      return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
    },
    averageColorStyles(dot1, dot2) {
      var color1 = dot1.color,
        color2 = dot2.color;

      var r = this.mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
        g = this.mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
        b = this.mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
      return this.createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
    },
    animateDots() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.moveDots();
      this.connectDots();
      this.drawDots();

      requestAnimationFrame(this.animateDots);
    },
    drawDots() {
      for (var i = 0; i < this.dots.nb; i++) {
        var dot = this.dots.array[i];
        // console.log(dot)
        dot.prototype.draw();
      }
    },
    mousemove(e) {
      this.mousePosition.x = e.pageX;
      this.mousePosition.y = e.pageY;
    },
    mouseleave(e) {
      this.mousePosition.x = e.pageX;
      this.mousePosition.y = e.pageY;
    },
  },
  mounted() {
    this.canvas = document.querySelector("canvas");
    var _this = this;
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = $(window).width();
    this.canvas.height = $(window).height();
    this.ctx.lineWidth = 0.3;
    this.ctx.strokeStyle = new this.Color(150, _this).style;

    this.createDots();
    requestAnimationFrame(this.animateDots);
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/bg1.jpg");
  background-size: cover;
  background-size: 100% 100%;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  .el-tabs__content{
    padding: 0px !important;
  }
  .el-tabs--border-card {
    background: transparent !important;
    border: none !important;
  }
  .el-tabs--border-card>.el-tabs__header{
    background-color: transparent !important;
    margin: 0 0 15px !important;
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
    background-color: transparent  !important;
    border: none  !important;
  }
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.5);
  width: 400px;
  padding: 25px 25px 5px 25px;
  width: 540px;
  height: 400px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  .el-tabs__nav-wrap
.el-tabs__nav-scroll
.el-tabs__nav {
    width: 100%;
    display: flex;
    justify-content: space-around;
}
  box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
  z-index: 2001;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .el-tabs__item{
    color: white;
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.register-form {
  .el-tabs__content{
    padding: 0px !important;
  }
  .el-tabs--border-card {
    background: transparent !important;
    border: none !important;
  }
  .el-tabs--border-card>.el-tabs__header{
    background-color: transparent !important;
    margin: 0 0 15px !important;
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
    background-color: transparent  !important;
    border: none  !important;
  }
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.5);
  width: 400px;
  padding: 25px 25px 5px 25px;
  width: 540px;
  height: 650px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  .el-tabs__nav-wrap
.el-tabs__nav-scroll
.el-tabs__nav {
    width: 100%;
    display: flex;
    justify-content: space-around;
}
  box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
  z-index: 2001;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
   .el-tabs__item{
    color: white;
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.cavs {
  z-index: 2000;
  position: fixed;
  width: 95%;
  margin-left: 20px;
  margin-right: 20px;
}
.login-title {
  color: #d3d7f7;
  height: 60px;
  font-size: 20px;
  text-align: center;
  margin-top: -20px;
}
.login-con {
  height: 208px;
  position: absolute;
  left: 0;
  width: 80%;
  margin: 0 10%;
}
.login-user {
  position: relative;
}
.icon {
  position: absolute;
  z-index: 1;
  left: 36px;
  top: 8px;
  opacity: 1;
}
.login-con input {
  width: calc(100% - 130px);
  margin-top: -2px;
  background: transparent;
  left: 0;
  padding: 10px 65px;
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
  border-right: none;
  border-left: none;
  outline: none;
  font-family: gudea, sans-serif;
  box-shadow: none;
  color: #61bfff !important;
}
.login-pwd,
.login-yan {
  position: relative;
}
.login-btn {
  width: 80%;
  margin: 0 auto;
  position: relative;
}
.login-btn input {
  border-radius: 3px;
  background: 0 0;
  border: 2px solid #4fa1d9;
  color: #4fa1d9;
  text-transform: uppercase;
  font-size: 11px;
  cursor: pointer;
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  margin: auto;
  width: 80%;
  transition-property: background, color;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
}
.login-btn input:hover {
  color: #fff !important;
  background: #4fa1d9;
  cursor: pointer;
  -webkit-transition-property: background, color;
  transition-property: background, color;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
}
// 图片
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
