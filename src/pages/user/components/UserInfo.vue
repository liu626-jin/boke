<template>
  <el-card class="box-card">
    <el-image
      :src="userData.avatar"
      style="width: 100%; margin: auto"
      fit="cover"
    ></el-image>
    <el-row :gutter="10">
      <el-col :span="24" style="text-align: center">
        <span>{{ userData.userName }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" style="text-align: center">
        <span>{{ userData.introduction }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="text-align: center;margin-top:10px">
      <el-col :span="8">
        <el-badge :value="12" class="mark">
          <el-button type="primary" size="mini">我的文章</el-button>
        </el-badge>
      </el-col>
      <el-col :span="8">
        <el-badge :value="12" class="mark">
          <el-button type="primary" size="mini">浏览数</el-button>
        </el-badge>
      </el-col>
      <el-col :span="8">
        <el-badge :value="12" class="mark">
          <el-button type="primary" size="mini">点赞数</el-button>
        </el-badge>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "UserInfo",
  props: {
    //通过这个拿到userData里面的信息
    userData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style>
</style>