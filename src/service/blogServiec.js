import axios from "axios";
import defaultConfig from "./config/config.default";

class BlogService {
    async createBlog(blogData){
        return axios.post(`${defaultConfig.baseApiUrl}/blog/create`,blogData)
    }
    async getPublishBlog(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getPublishBlog`,{
            params:args
        })
    }
    async getDetailById(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getDetailById`,{
            params:args
        })
    }

}
export default new BlogService()

//博客地址