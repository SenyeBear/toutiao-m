<template>
  <div class="post-comment">
    <van-field
      class="post-field"
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="优质评论将会被优先展示"
      show-word-limit
    />
    <van-button
      type="info"
      size="small"
      @click="onPost"
    >发布</van-button>
  </div>
</template>

<script>
import { addComments } from '@/api/comment'

export default {
  name: 'CommentPost',
  components: {},
  props: {
    target: {
        type: [Number, String, Object],
        required: true
    }
  },
  // 后代接收祖先组件传的数据
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onPost () {
      try {
        this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁用背景点击
        duration: 0, // 持续时间，默认2s 如果为0则持续展示
      })
        const { data } = await addComments({
          target: this.target.toString(), // 评论的目标: id-文章id 或 评论id
          content: this.message,
          art_id: this.articleId ? this.articleId.toString() : this.articleId // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数 不传给null
        })
        
        // 清空文本框
        this.message = ''

        // 通知父组件做响应处理
        this.$emit('post-success', data)

        this.$toast.success('发布成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('发送失败，请重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.post-comment {
  display: flex;
  padding: 15px;
  align-items: center;
  .post-field {
    background: #f5f7f9;
    margin-right: 15px;
  }
}
</style>