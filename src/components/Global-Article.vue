<template>
    <div @click="goArticleDetail">
        <el-card class="box-card">
           <div slot="header" class="clearfix">
                <span>{{articleData.title}}</span>
                <el-tag type="warning" v-if="!articleData.approved">未审核</el-tag>
           </div>
           <el-row :gutter="10">
                <el-col :span="24">
                    <el-image
                    :src="articleData.cover"
                    >
                        <div slot="placeholder" class="image-slot">
                            加载中<span class="dot">...</span>
                        </div>
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                </el-col>
           </el-row>
           <el-row :gutter="10">
            <el-col :span="24">
                <p>{{articleData.description}}</p>
            </el-col>
           </el-row>
           <el-row :gutter="10">
            <el-col :span="2">
                <el-avatar :src="articleData.autor.avatar"></el-avatar>
            </el-col>
            <el-col :span="4">
                <p>{{articleData.autor.userName}}</p>
            </el-col>
            <el-col :span="4">
                <p>{{articleData.lastModified | transformTime}}</p>
            </el-col>
            <el-col :span="12" style="display:flex;justify-content:space-around">
                <el-badge :value="articleData.likes" class="item">
                <el-button size="small">喜欢</el-button>
                </el-badge>
                <el-badge :value="articleData.views" class="item" type="primary">
                <el-button size="small">阅览</el-button>
                </el-badge>
                <el-badge :value="articleData.comment.length" class="item" type="warning">
                <el-button size="small">回复</el-button>
                </el-badge>
            </el-col>
           </el-row>

        </el-card>

    </div>
</template>

<script>
export default {
    name:'GlobalArticle',
    props:{
       articleData:{
            default(){
                return {
                    title: "",
                    tags: [],
                    description: "",
                    cover: "",
                    comment: [],
                    autor: {},
                    lastModified: new Date(),
                    views: 0,
                    likes: 0,
                    blogId: 1, 
                    approved:true
                }
            }
        }
    },
    filters:{
        transformTime(time){//以后都可以用
            let blogCreateTime=new Date(time)//获取博客发布时间
            let currentTime=new Date() //获取当前时间
            let offsetTime=currentTime-blogCreateTime//时间差 单位ms
            let offsetST=offsetTime/1000 //转成秒
            let offsetMT=offsetST/60 //分钟
            let offsetHT=offsetMT/60 //转成小时
            let offsetDT=offsetHT/24 //转成天
            if(offsetDT>=365){
                return `发表于${Math.floor(offsetDT/365)}年之前`
            }else if(offsetDT>=30 && offsetDT<365){
                return `发表于${Math.floor(offsetDT/30)}月之前`
            }else if(offsetDT>=7 && offsetDT<30){
                return `发表于${Math.floor(offsetDT/7)}周之前`
            }else if(offsetDT>=1 && offsetDT<7){
                return `发表于${Math.floor(offsetDT)}天之前`
            }else if(offsetHT>=1){
                return `发表于${Math.floor(offsetHT)}小时之前`
            }else if(offsetMT>=1){
                return `发表于${Math.floor(offsetMT)}分钟之前`
            }else if(offsetST>=1){
                return `发表于${Math.floor(offsetST)}秒之前`
            }
        }      
    },
    methods:{
        goArticleDetail(){
            this.$router.push(`/article${this.articleData.blogId}`)
        }
    }

}
</script>

<style>

</style>