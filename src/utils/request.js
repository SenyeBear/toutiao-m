// 请求模块
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

// 创建axios实例 自定义配置
const request = axios.create({
    // 接口的基准路径
    baseURL: 'http://toutiao.itheima.net', 
    // 自定义后端返回的原始数据
    transformResponse: [function (data) {
      try {
        return JSONBig.parse(data)
      } catch (err) {
        return data
      }
    }]
})

// 请求拦截器
// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // config 本次请求的配置对象
    // console.log(config);
    const { user } = store.state
    // 判断是否有user且有token
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // 这里必须返回config对象 否则请求停在此处出不去
    return config
  }, function (error) {
    // 对请求错误做些什么(请求还没发出去出错了)
    return Promise.reject(error)
  })
  
// 响应拦截器

export default request