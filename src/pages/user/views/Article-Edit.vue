<template>
    <div>
        <el-page-header @back="goBack"></el-page-header>
        <GlobalEditor @publishSuccess="goBack"></GlobalEditor>
    </div>
</template>

<script>
import GlobalEditor from '@/components/Global-Editor';
export default{
    name:'Article-Edit',
    components:{
        GlobalEditor
    },
    methods:{
        goBack(){//返回上一页
            this.$router.go(-1)
        }
    }
}
</script>

<style>
</style>