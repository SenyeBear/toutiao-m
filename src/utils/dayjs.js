import dayjs from 'dayjs'
import Vue from 'vue'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

import  relativeTime from 'dayjs/plugin/relativeTime'

// dayjs默认语言为英语 需要配置为中文

// 全局配置中文语言包
dayjs.locale('zh-cn')

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 定义一个全局过滤器 可以在任何组件的模板中使用
Vue.filter('relativeTime', value => {
    return dayjs().to(dayjs(value))
})

