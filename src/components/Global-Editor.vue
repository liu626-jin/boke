<template>
    <el-card class="box-card" v-loading="isPublishing">
        <div slot="header" class="clearfix">
            <span>写文章</span>
            <el-button style="float:right;padding:3px" type="text" @click="publishBlog">发布</el-button>
        </div>
        <el-row :gutter="10">
            <el-col :span="6">
                <el-upload
                class="avatar-uploader"
                name="uploadAvatar"
                :action="`${defaultConfig.baseApiUrl}/uploadImg`"
                :show-file-list="false"
                :on-success="handleAvaterSuccess"
              >
                <img
                  v-if="cover"
                  :src="cover"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon">文章封面</i>
              </el-upload>
            </el-col>
            <el-col :span="18">
                <el-row :gutter="10" >
                    <el-col :span="24">
                        <el-input v-model="title" placeholder="请输入文章标题"></el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top:20px">
                    <el-col :span="24">
                        <el-input v-model="description" placeholder="请输入文章简介"></el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top:20px">
                    <el-col :span="24">
                        <el-tag
                        :key="tag"
                        v-for="tag in tags"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{tag}}
                        </el-tag>
                        <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">添加标签</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="10">
           <el-col :span="24">
                <div id="editor" ref="editor"></div>
           </el-col>
        </el-row>
    </el-card>
</template>

<script>
import defaultConfig from '../service/config/config.default';
import Editor from 'wangeditor';
import hljs from 'highlight.js';
import imgfileService from '../service/imgfile.service';
import BlogService from '../service/blogServiec';
export default {// 这一页可能被很多地方引用，所以全局拿出来
    name:'Global-Editor',
    data(){
        return {
            defaultConfig,
            title:'',
            description:'',
            tags:[],
            cover:'',
            inputVisible:false,
            inputValue:'',
            editor:null,
            isPublishing:false//发布动画
        }
    },
    mounted(){
        this.editor=new Editor(this.$refs.editor);//初始化编辑器实例
        this.editor.highlight=hljs;//实现代码编辑器里面的代码高亮亮
        //编辑器的基本尺寸，焦距，占位符的相关配置
        this.editor.config.height=200;
        this.editor.config.zIndex=1000;
        this.editor.config.placeholder ='请输入文章内容';
        this.editor.config.focus=true;
        // 默认情况下，显示所有菜单：功能菜单
        this.editor.config.menus = [
            'head',
            'bold',
            'fontSize',
            'fontName',
            'italic',
            'underline',
            'strikeThrough',
            'indent',
            'lineHeight',
            'foreColor',
            'backColor',
            'link',
            'list',
            'todo',
            'justify',
            'quote',
            'emoticon',
            'image',
            'video',
            'table',
            'code',
            'splitLine',
            'undo',
            'redo',
        ]
        //字体颜色 背景颜色的预设值
        this.editor.config.colors=[
            '#000000',
            '#eeece0',
            '#1c487f',
            '#4d80bf'
        ]
        //字体种类
        this.editor.config.Names=[
                '黑体',
                '仿宋',
                '楷体',
                '标楷体',
        ]
        // 字号预设值
        this.editor.config.fontSize={//只能是这几种，不能多，但是能少。数据也不用改
            'x-small': { name: '10px', value: '1' },
            'small': { name: '13px', value: '2' },
            'normal': { name: '16px', value: '3' },
            'large': { name: '18px', value: '4' },
            'x-large': { name: '24px', value: '5' },
            'xx-large': { name: '32px', value: '6' },
            'xxx-large': { name: '48px', value: '7' },
        }
        // 行高配置
        this.editor.config.lineHeight=['1', '1.15', '1.6', '2', '2.5', '3'] 
        // 表情包
        this.editor.config.emotions = [
            {
                title: 'emoji',  // tab 的标题
                type: 'emoji', // 'emoji' / 'image'
                // emoji 表情，content 是一个数组即可
                content: '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐'.split(/\s/),
            },{//这个可以后端引入一个表情包的
                title:'收藏',
                type:'image',
                content:[
                    {
                        alt:'哈哈',//src是在线图片
                        src:'http://5b0988e595225.cdn.sohucs.com/images/20171111/cbec944b946b4e19a4636cfaa045b730.jpeg'
                    }
                ]

            }
        ]
        // 支持编辑语言
        this.editor.config.languageType=[//插入代码语言配置
                'Bash',
                'C',
                'C#',
                'C++',
                'CSS',
                'Java',
        ]
        // 是否支持全屏
        this.editor.config.showFullScreen=true;
        // 自定义的插入链接的内容校验
        // this.editor.config.linkCheck=function(text,link){
        //     //校验逻辑自定义 通过返回的布尔值，来作为检测是否合格
        //     return true
        // }
        // 检查插入网络图片的内容科研
        // this.editor.config.linkImgCheck = function() {
        //     return true
        // }
        // // 插入图片的校验
        // this.editor.config.linkImgCheck = function() {
        //     return true
        // }
        //插入本地图片，实现本地图片上传并插入到编辑器里面（很重要）
        this.editor.config.uploadImgMaxSize=2*1024*1024//单位是字节。上传图片尺寸的限制
        this.editor.config.uploadImgMaxLength=5//上传图片个数的限制
        this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
            // resultFiles 是 input 中选中的文件列表
            // insertImgFn 是获取图片 url 后，插入到编辑器的方法
            let imgData=new FormData();
            for(let i=0,len=resultFiles.length;i<len;i++){//将选中的相片加入到imgData里面
                imgData.append("uploadAvatar",resultFiles[i])
            }
            imgfileService.uploadImgFile(imgData).then(rs=>{//将图片上传到服务器
                for(let i=0,len=rs.data.data.imgList.length;i<len;i++){
                // 上传图片，返回结果，将图片插入到编辑器中
                insertImgFn(rs.data.data.imgList[i])//将存入服务器的图片插入编辑器中
            }
            })
                
        }
        //粘贴文本的内容处理
        // this.editor.config.pasteTextHandle = function (pasteStr) {
        //     // 对粘贴的文本进行处理，然后返回处理后的结果
        //     // let str=pasteStr
        //     return '解析后的str'
        // }

        //编辑器内容的获取，纯文本，html，json格式的数据

        //编辑器内容的修改

        this.editor.create();//把实例变成元素内容 注意这个要写在最后面的
    },
    methods:{
        handleAvaterSuccess(rs) {
            this.cover= rs.data.imgList[0];//将相片放入相应的位置
        },
        handleClose(tag){//点击删除指定tag
            this.tags.splice(this.tags.indexOf(tag),1)
        },
        handleInputConfirm(){
            if(this.inputValue){
                this.tags.push(this.inputValue)
                this.inputValue=''
            }
            this.inputVisible=false
        },
        showInput(){//点击出现这个输入框
            this.inputVisible=true
        },
        publishBlog(){
            let blogData={
                title:this.title,
                description:this.description,
                tags:this.tags,
                cover:this.cover,
                content:this.editor.txt.html(),
            }
           
            //文章校验
            if(this.title&&this.description&&this.tags.length&&this.cover&&blogData.content){
                this.isPublishing=true
                BlogService.createBlog(blogData).then(rs=>{//发布
                    if(rs.data.status==200){
                    this.$message.success("发布成功")
                    this.$emit('publishSuccess')
                      //  自定义事件$emit。使用$emit建立父子组件之间的通信。子组件到父组件之间的通信。
                    }else{
                        this.$message.error('发布失败')
                    }
                }).finally(()=>{
                    this.isPublishing=false
                })
            }else{
                this.$message.warning('信息不全，请完善后再发表')
                this.isPublishing=false
            }  
        }
    },
    beforeDestroy(){
        this.editor.destroy()//当用户离开这个组件，销毁编辑器
    }
    
}

</script>

<style>
    /* 上传样式 */
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

    /* tag样式 */
    .el-tag + .el-tag {
    margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>