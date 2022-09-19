<template>
    <div>
        <GlobalArticle 
        v-for="(blogItem,index) of blogList"
        :article-data="blogItem"
        :key="index"
        ></GlobalArticle>
        <el-pagination
        layout="prev, pager, next"
        :pageSize="params.limit"
        :page-count="10"
        :total="totalNum"
        @current-change="changePage"
        >

        </el-pagination>
    </div>
</template>

<script>
import GlobalArticle from '../../../components/Global-Article';
import BlogService from '../../../service/blogServiec';
export default {
    name:'Community',
    components:{
        GlobalArticle
    },
    data(){
        return {
            blogList:[],
            params:{
                limit:1,//表示可以连续几页放在一起
                offset:0
            },
            totalNum:0
        }
    },
    created(){
        this.getBlogData()
    },
    methods:{
        getBlogData(){
            BlogService.getPublishBlog(this.params).then(rs=>{
              console.log('博客数据',rs)
              this.totalNum=rs.data.data.totalNum
              this.blogList=rs.data.data.blogList
            })
        },
        changePage(page){
            this.params.offset=(page-1)*this.params.limit
            this.getBlogData()
        }
    }
}
</script>

<style>

</style>