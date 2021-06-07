//在http.js中引入axios
import axios from 'axios';
import store from '@/store'

//基本域名
var baseURL = ``;

//创建axios实例  请求超时时间
const instance = axios.create({
    baseURL,
    timeout: 500000, //超时时间
    withCredentials: true   //withCredentials是当前请求为跨域类型时是否在请求中协带cookie，默认为false
});

// post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


// 请求拦截器
instance.interceptors.request.use(
    config => {
        // console.log(config.hideloading);
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        if (store.state.token) {
            //在配置的头信息里添加授权字段=vuex里的token
            config.headers.Authorization = store.state.token;
        }
        //如果vuex中有token，证明已经登陆了，在发送请求的时候携带token
        // 在请求的头信息里 的Authorization字段携带token
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
)

// 添加响应拦截器
instance.interceptors.response.use(
    function (response) {
        //如果后台返回的数据告诉我们 token是无效的 就跳转到登陆页面
        // if (response.data.msg === "无效token") {
        //     router.push({
        //         path: "/login",
        //     });
        // }
        return response;
    },
    function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default function http(url, method, data = {}, params = {}) {
    return instance({
        url: url,
        method: method,
        data: data,  //data是post的传参  
        params: params,  //params是get的传参
    })
        .then((res) => {
            // console.log(res);
            if (res.status >= 200 && res.status < 300) {
                return res;
            } else {
                return Promise.reject(res.data.meta.msg);
                //如果状态码不是200-300的之后就走失败的回调
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}
