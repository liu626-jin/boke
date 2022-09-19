import axios from "./config/axios.default.config";
import defaultConfig from "./config/config.default";

class authorService{
    async  registerUser(userData){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/registerUser`,userData)
    }
    async loginUser(userData){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/loginUser`,userData)
    }
    async  checkPermission(){
        return axios.get(`${defaultConfig.baseApiUrl}/authentication/checkPermission`)
    }
    
}

export default new  authorService();

/*
async 作为一个关键字放在函数的前面，表示该函数是一个异步函数，意味着该函数的执行不会阻塞后面代码的执行，
异步函数的调用跟普通函数一样。
await即等待，用于等待一个Promise对象。它只能在异步函数 async function中使用，否则会报错。
await表达式会暂停当前 async function的执行，等待Promise 处理完成。

*/