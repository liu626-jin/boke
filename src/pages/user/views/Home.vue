<template>
    <div class="menus">
        <el-container>
            <el-header style="border-bottom:1px solid #ccc;padding: 10px 0;margin-bottom: 20px;">
                <el-row :gutter='10'>
                <el-col :offset="3" :span="18" style="display:flex; align-items:center;justify-content:space-between">
                <img src="../assets/logo.png" style="height:40px;">
                <el-input v-model="searchStr" placeholder="请输入博客标题" style="width:60%">
                <el-button type="primary" slot="append" icon="el-icon-search">搜索</el-button>
                </el-input>
                <el-dropdown v-if="hasPermission">
                    <!--如果是用data里面的数据，需要在前面加:-->
                    <el-avatar  
                    v-if="hasPermission" 
                    :src="userData.avatar"  
                    :title="userData.userName" 
                    fit="contain" 
                    shape="square"></el-avatar>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item disabled>{{userData.userName}}</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-link type='primary' href="login.html" v-if="!hasPermission">登录</el-link> 
                <el-button type="text" icon="el-icon-s-home" v-if="hasPermission">小树洞</el-button>
                <el-button type="text" icon="el-icon-edit" v-if="hasPermission" @click="goEdiarticle">写文章</el-button>
                <el-button type="text" icon="el-icon-s-data" v-if="isAdmin">站点管理系统</el-button>
                </el-col>
                </el-row>
            </el-header>
            <el-container>
                <el-aside width="300px">
                    <UserInfo :user-data="userData"></UserInfo>
                </el-aside>
                <el-main>
                    <el-tabs v-model="activeName" @tab-click="switchTab">
                        <el-tab-pane label="广场" name="square">
                            <Community></Community>
                        </el-tab-pane>
                        <el-tab-pane label="喜欢" name="like">喜欢</el-tab-pane>
                        <el-tab-pane label="评论" name="comment">评论</el-tab-pane>
                        <el-tab-pane label="关注" name="attention">关注</el-tab-pane>
                        <el-tab-pane label="黑名单" name="blacklist">黑名单</el-tab-pane>
                    </el-tabs>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import authorService from '../../../service/authorService';
import UserInfo from '../components/UserInfo'
import Community from '../components/Community';
export default{
    name:'Home',
    components:{
        UserInfo,
        Community
    },
    data(){
        return {
            searchStr:'' ,
            hasPermission:false,//权限显示控制
            isAdmin:false,
            userData:{},
            activeName:''//当前默认选中的谁
        }
    },
    created(){
        authorService.checkPermission().then(rs=>{
            if(rs.data.status===200){
                this.hasPermission=true;
                this.userData=rs.data.data.userData;//这里相当于是拿到了数据库的信息
                sessionStorage.removeItem('userData')
                sessionStorage.setItem('userData',JSON.stringify(this.userData))
                // console.log(this.userData)
            }else{//没有登录就直接跳转到登录的界面
                window.location.replace('http://localhost:8080/login.html')
            }
        })
        //表示如果存在就返回，如果不存在就返回/article
        this.activeName=this.$route.params.module?this.$route.params.module:'article'
        //路由配置是params传递参数,且这个后面必须加参数，如果不加，刷新页面这些参数会消失
    },
    methods:{
        goEdiarticle(){//跳转到文章编辑界面
            this.$router.push('/editarticle')
        },
        switchTab(tab){
            this.$router.push(`/home/${tab.name}`)
        }
    }
}
</script>

<style>

</style>