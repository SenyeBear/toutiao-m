<template>
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  :error="error"
  erroe-text="加载失败，请点击重试"
  :immediate-check="false"
  @load="onLoad"
  >
  <comment-item v-for="(item, index) in list" :key="index"
  :comment="item"
  @reply-click="$emit('reply-click', $event)"
  />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false
    }
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => [] // list不是必须的，父组件需要使用就传值 否则默认值
    },
    type: {
      type: String,
      // 自定义 prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  created () {
    // 一渲染就立马调用加载评论方法 显示评论数量
    // 当手动初始onLoad时 不会自动开始初始的loading 因此要设置
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad() {
      try {
        // 1.请求数据
        const { data } = await getComments({
          type: this.type, // 评论类型：a-对文章的评论 c-对评论的回复
          source: this.source.toString(), // 文章id 或 评论id
          offset: this.offset,
          limit: this.limit
        })

        // 2.把数据添加到列表中
        const { results } = data.data
        this.list.push(...results)

          // 把文章评论总数量传递到外部
          this.$emit('onload-success', data.data)

        // 3.loading结束
        this.loading = false

        // 判断是否还有数据
        if (results.length) {
          // 有 更新获取下一页数据
          this.offset = data.data.end_id
        } else {
          // 无 结束finish
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },
  }
}
</script>

<style  scoped>

</style>
