<template>
  <div class="login">
    <canvas class="cavs" @mousemove="mousemove" @mouseleave="mouseleave">
    </canvas>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">项目管理平台</h3>
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
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2019 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";

import { encrypt, decrypt } from "@/utils/jsencrypt";
import $ from "jquery";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
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

  box-shadow: -15px 15px 15px rgba(6, 17, 47, 0.7);
  z-index: 99999;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
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
  z-index: 9999;
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
</style>
