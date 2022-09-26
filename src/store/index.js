import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem} from '@/utils/storage'

Vue.use(Vuex)

// 多处使用了TOUTIAO_USER 使用常量存储 便于检测和修改
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 一个对象 用来存储当前登录用户信息(token等数据)
    user: getItem(TOKEN_KEY),
  },
  getters: {
  },
  mutations: {
    setUser (state, data) {
      state.user = data

      // 为了防止刷新丢失 把数据备份存储到本地
      // 本地存储只能存字符串 需要JSON字符串转换
      // 都已经封装在本地数据模块
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
