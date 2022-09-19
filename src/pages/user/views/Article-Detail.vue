<template>
  <div>
    <el-page-header @back="goBack" :content="blogData.title"></el-page-header>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :span="2">
            <el-avatar :src="blogData.autor.avatar" size="large"></el-avatar>
          </el-col>
          <el-col :span="6">
            <span>{{ blogData.autor.userName }}</span>
            <br />
            <span>{{ blogData.lastModified | transformTime }}</span>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-button
              type="warning"
              icon="userData.userDetail.likes.includes(this.blogId)?el-icon-star-on:el-icon-star-off"
              circle
            ></el-button>
            <el-button type="primary" plain icon="el-icon-plus">关注</el-button>
            <el-button type="danger" plain icon="el-icon-s-custom">拉黑</el-button>
            <el-button type="warning" plain icon="el-icon-thumb">举报</el-button>
          </el-col>
        </el-row>
      </div>
      <div v-html="blogData.content"></div>
      <!--直接就出这个文章了 -->
      <div style="margin-bottom: 20px">
        <el-tag
          type="success"
          v-for="(tag, index) of blogData.tags"
          :key="index"
          style="margin-right: 20px"
          >{{ tag }}</el-tag>
      </div>
      <el-row>
        <el-col :span="1"><i class="el-icon-star-off"></i>{{ blogData.likes }}</el-col>
        <el-col :span="1"><i class="el-icon-view"></i>{{ blogData.views }}</el-col>
        <el-col :span="1"><i class="el-icon-chat-dot-round"></i>{{ blogData.comment.length }}</el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import BlogService from "../../../service/blogServiec";
export default {
  name: "Article-Detail",
  data() {
    return {
      blogId: "",
      blogData: {
        //数据里面写上会好点，虽然不会影响页面，但是会在控制台报错
        titile: "",
        autor: {
          userName: "",
          avatar: "",
        },
        description: "",
        comment: [],
        cover: "",
        views: 0,
        likes: 0,
        tags: [],
        lastModified: "",
      },
      userData:JSON.parse(sessionStorage.getItem('userData'))
    };
  },
  filters: {
    transformTime(time) {
      //以后都可以用
      let blogCreateTime = new Date(time); //获取博客发布时间
      let currentTime = new Date(); //获取当前时间
      let offsetTime = currentTime - blogCreateTime; //时间差 单位ms
      let offsetST = offsetTime / 1000; //转成秒
      let offsetMT = offsetST / 60; //分钟
      let offsetHT = offsetMT / 60; //转成小时
      let offsetDT = offsetHT / 24; //转成天
      if (offsetDT >= 365) {
        return `发表于${Math.floor(offsetDT / 365)}年之前`;
      } else if (offsetDT >= 30 && offsetDT < 365) {
        return `发表于${Math.floor(offsetDT / 30)}月之前`;
      } else if (offsetDT >= 7 && offsetDT < 30) {
        return `发表于${Math.floor(offsetDT / 7)}周之前`;
      } else if (offsetDT >= 1 && offsetDT < 7) {
        return `发表于${Math.floor(offsetDT)}天之前`;
      } else if (offsetHT >= 1) {
        return `发表于${Math.floor(offsetHT)}小时之前`;
      } else if (offsetMT >= 1) {
        return `发表于${Math.floor(offsetMT)}分钟之前`;
      } else if (offsetST >= 1) {
        return `发表于${Math.floor(offsetST)}秒之前`;
      }
    },
  },
  methods: {
    goBack() {
      //返回上一页
      this.$router.go(-1);
    },
  },
  created() {
    this.blogId = this.$route.params.id;
    BlogService.getDetailById({
      blogId: this.blogId,
    }).then((rs) => {
      console.log("博客的详细数据", rs.data);
      this.blogData = rs.data.data.blogData;
    });
    console.log(this.userData)
  },
};
</script>

<style>
</style>