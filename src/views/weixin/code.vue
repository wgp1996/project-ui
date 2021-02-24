<template>
  <div class="container">
    <wxlogin :theme="'white'"
                   :appid="wxInfo.appid"
                   :scope="'snsapi_login'"
                   :redirect_uri="wxInfo.redirect_uri"></wxlogin>
  </div>
</template>

<script>
import wxlogin from 'vue-wxlogin'
export default {
  name: 'Weixin',
  components: {
     wxlogin
  },
  data() {
      return {
        wxInfo:{
            appid:"wxa91eb61e5069fce3",//appID
            secret:"050885678b8162d5fb60252bb2ddd260",//密钥
            scope:"'snsapi_login'",//
            redirect_uri:"https://keboo.cn/project/login"//回调地址
        },
      }
  }
}
</script>
<style scoped>
  .container{
    height: 100%;
    width: 100%;
    margin: 0px auto;
    text-align: center;
        background-color: rgb(51, 51, 51);
    padding: 50px;
  }

</style>
