<template>
  <div style="width: 100vw; height: 100vh">
    <el-row :getter="10" style="width: 100%; height: 100%">
      <el-col :span="10">
        <div class="login-wrapper" v-if="islogin">
          <h1 style="text-align: center">登录</h1>
          <el-form ref="loginForm" :model="loginForm" label-width="100px">
            <el-form-item label="用户名" prop="userName">
              <el-input
                v-model="loginForm.userName"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                placeholder="请输入密码"
                type="password"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitFrom('loginForm')"
                >提交</el-button
              >
              <el-button type="danger" @click="resetFrom('loginForm')"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <div style="text-align: right">
            没有账号，点击 <el-button @click="switchstatus">注册</el-button>
          </div>
        </div>

        <div class="register-wrapper" v-else>
          <h1 style="text-align: center">注册</h1>
          <el-form
            ref="registerForm"
            :model="registerForm"
            label-width="100px"
            :rules="rules"
          >
            <el-form-item label="头像" prop="avatar">
              <el-upload
                class="avatar-uploader"
                name="uploadAvatar"
                :action="`${defaultConfig.baseApiUrl}/uploadImg`"
                :show-file-list="false"
                :on-success="handleAvaterSuccess"
              >
                <img
                  v-if="registerForm.avatar"
                  :src="registerForm.avatar"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
              <el-input
                v-model="registerForm.userName"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="registerForm.password"
                placeholder="请输入密码"
                type="password"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                placeholder="请再次输入密码"
                type="password"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitFrom('registerForm')"
                >提交</el-button
              >
              <el-button type="danger" @click="resetFrom('registerForm')"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <div style="text-align: right">
            有账号，点击 <el-button @click="switchstatus">登录</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="14" class="bg-img"></el-col>
    </el-row>
  </div>
</template>

<script>
import defaultConfig from "../../service/config/config.default";
import authorService from "../../service/authorService";
export default {
  name: "loginPage",

  data() {
    let vm = this; //生命周期
    function validatePass(rule, value, cb) {
      //校验密码
      if (value === "") {
        cb(new Error("请输入密码"));
      } else {
        if (vm.registerForm.confirmPassword) {
          vm.$refs.registerForm.validateField("confirmPassword");
        }
        cb();
      }
    }
    function validatePass2(rule, value, cb) {
      //校验确认密码
      if (value === "") {
        cb(new Error("请输入密码"));
      } else if (value !== vm.registerForm.password) {
        cb(new Error("两次输入的密码不一样"));
      } else {
        cb();
      }
    }
    return {
      defaultConfig, //上面只引用在data里面的数据
      islogin: true,
      loginForm: {
        userName: "",
        password: "",
      },
      registerForm: {
        userName: "",
        password: "",
        confirmPassword: "",
        avatar: "",
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 6,
            max: 10,
            message: "用户名长度在6-10字符之间",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur",
          },
          {
            min: 6,
            max: 10,
            message: "密码在6-10字符之间",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {
            required: true,
            validator: validatePass2,
            trigger: "blur",
          },
          {
            min: 6,
            max: 10,
            message: "密码长度在6-10字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    switchstatus() {
      this.islogin = !this.islogin;
    },
    submitFrom(formName) {
      this.$refs[formName].validate((valid)=>{
        if(valid){
          this.$message.success('验证成功')
          if(formName=='loginForm'){
              authorService.loginUser(this.loginForm).then(rs=>{
                if(rs.data.status===200){
                this.$message.success('登录成功')
                sessionStorage.setItem('Authorization',rs.headers.authorization)
                window.location.replace('http://localhost:8080/index.html')//跳转界面
              }else{
                this.$message.error('用户名或密码错误')
              }
              })
          }else{
            authorService.registerUser(this.registerForm).then(rs=>{
              if(rs.data.status===200){
                this.$message.success('注册成功')
                sessionStorage.setItem('Authorization',rs.headers.authorization)
                window.location.replace('http://localhost:8080/index.html')//跳转界面
              }else{
                this.$message.error('注册失败')
              }
            })
          }
        }else{
          this.$message.error('验证失败')
        }
      })
    },
    resetFrom(formName) {
      this.$refs[formName].resetFields(); //重置表单
    },
    handleAvaterSuccess(rs) {
      console.log("上传成功", rs.data.imgList[0]);
      this.registerForm.avatar = rs.data.imgList[0];//将相片放入相应的位置
    },
  },
};
</script>

<style>
body {
  /*style去掉scoped才能起作用*/
  margin: 0;
}
.login-wrapper,
.register-wrapper {
  width: 80%;
  margin: auto;
}
.bg-img {
  height: 100%;
  background-image: url("./assets/bgimg.png");
  background-size: cover;
  background-position: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>