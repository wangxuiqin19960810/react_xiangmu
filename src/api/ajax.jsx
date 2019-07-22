/* 
封装的能发ajax请求的函数, 向外暴露的本质是axios
1. 解决post请求携带参数的问题: 默认是json, 需要转换成urlencode格式
2. 让请求成功的结果不再是response, 而是response.data的值
3. 统一处理所有请求的异常错误
*/
import qs from 'qs';//使用工具包qs,将传入的data对象转为username=admin&password=admin形式
import axios from 'axios';
import {message} from 'antd'



//我们要做一个统一的事情，对所有的post请求的data对象进行字符串化，转成一个query字符串a=1&b=2格式，做一次，后面只需要传对象就可以
// Interceptors 可以在在处理请求或响应之前拦截它们

//添加一个请求拦截器(本质上是一个函数):让post请求的请求体格式转为urlencode格式a=1&b=2
axios.interceptors.request.use(function (config) {//config接收发送请求时传入的配置对象
    //得到请求方式和请求数据
    const {method,data} = config;
    //处理post请求，让data对象转换成query参数格式的字符串
    if(method.toLowerCase() === 'post' && typeof data === 'object'){
        config.data = qs.stringify(data);
    }
    return config;
  });
  export default axios;

//添加一个响应拦截器:在请求返回之后，在我们指定的请求响应回调函数之前
    //功能1：将请求成功的结构不再是response，而是response.data的值
    //功能2：统一处理所有请求的异常错误
axios.interceptors.response.use(function (response) {
    
    return response.data;//返回的结果会交给我们指定的请求响应的回调
  }, function (error) {

    message.error('请求出错'+ error.message)
    // alert('请求出错'+ message.error);
    return new Promise(()=>{});//返回一个pending状态的promise,中断promise链，即使请求响应.then中有失败的回调也没用

    // return Promise.reject(error);//如果不把错误的情况return出去，就会直接进成功的回调。路由不对时，如果不写错误的拦截回调，就可以直接进请求响应失败的回调
  });
