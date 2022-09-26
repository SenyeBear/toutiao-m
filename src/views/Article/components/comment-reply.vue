<template>
  <div class="comment-reply">
    <van-nav-bar 
    :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'">
      <van-icon
       slot="left" 
       name="cross"
       @click="$emit('close')"
      />
    </van-nav-bar>
    
    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <comment-item 
        :comment="comment"
      />
      <!-- /当前评论项 -->
  
      <!-- 评论的回复列表 -->
      <van-cell title="全部回复" />
      <comment-list 
       :source="comment.com_id"
       :list="commentList"
       :type="c"
      />
      <!-- /评论的回复列表 -->
    </div>

    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button
       size="small"
       class="post-btn"
       @click="isPostShow = true"
      >写评论</van-button>
    </div>
    <!-- /发布评论 -->

    <!-- 发布评论弹出层 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
      <comment-post
       :target="comment.com_id"
       @post-success="onPostSuccess"
      />
    </van-popup> 
    <!-- /发布评论弹出层 -->
   
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
        type: Object,
        required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: [] // 评论的回复列表
    }
  },
  methods: {
    onPostSuccess (data) {
      // 更新回复的数量
      this.comment.reply_count++
      // 关闭弹出层
      this.isPostShow = false
      // 将最新回复的内容展示到列表顶部
      this.commentList.unshift(data.data.new_obj)
    }
  }
}
</script>

<style  scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border: 1px solid #dbdbdb;
  .post-btn {
    width: 60%;
  }
}
</style>
