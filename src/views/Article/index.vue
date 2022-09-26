<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar title="黑马头条">
        <van-icon slot="left" name="arrow-left"
        @click="onClickLeft"></van-icon>
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-warp">
        <van-loading 
      class="article-loading"
      size="24px" color="#1989fa" text-color="#ccc" vertical>加载中...</van-loading>
      </div>
      <!-- /加载中 -->
  
      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->
        <!-- 作者信息 -->
        <div class="author-wrap">
            <van-image
            class="author-avatar"
            round
            fit="cover"
            :src="article.aut_photo"
            />
            <van-cell class="author-info">
              <span slot="title" class="author-name">{{article.aut_name}}</span>
              <span slot="label" cls="publish-time">{{article.pubdate | relativeTime}}</span>
              <!-- 模板中的$event就是事件参数 -->
              <FollowUser 
              class="follow-btn"
              v-model="article.is_followed"
              :user-id="article.aut_id"
              />
              <!-- <FollowUser 
              class="follow-btn"
              :is-followed="article.is_followed"
              :user-id="article.aut_id"
              @update-is_followed="article.is_followed = $event" /> -->
              <!-- <van-button
               v-if="article.is_followed"
               slot="right-icon"  
               class="author-followed" 
               type="plain"
               size="small"
               :loading="followLoading"
               @click="onFollow"
              >已关注</van-button>
              <van-button
               v-else
               slot="right-icon"  
               class="author-follow" 
               type="info"
               icon="plus"
               size="small"
               :loading="followLoading"
               @click="onFollow"
              >关注</van-button> -->
            </van-cell>
        </div>
        <!-- /作者信息 -->

        <!-- 文章内容 -->
        <div 
         class="article-content markdown-body"
         v-html="article.content"
         ref="article-content"
        >
        </div>
        <van-divider>正文结束</van-divider>

        <!-- 文章评论列表 -->
        <div class="comment-list">
          <comment-list 
           :source="article.art_id"
           :list="commentList"
           @onload-success="totalCommentCount = $event.total_count"
           @reply-click="onReplyCLick"
          />
        </div>
        <!-- /文章评论列表 -->

        <!-- 底部区域 -->
      <div class="article-bottom">
        <van-button
         class="comment-btn" 
         plain 
         type="info"
         @click="isPostShow = true"
        >
        写评论
        </van-button>
        <div class="icon-wrap">
          <!-- <span class="comment-count">28</span> -->
          <van-icon 
            class="comment-count"
            name="comment-to"
            :badge="totalCommentCount"
          />
          <van-button class="btn-item" icon="comment-o" />
          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          />
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <!-- <van-icon name="star-o" /> -->
          <!-- <van-button class="btn-item" icon="good-job-o" /> -->
          <van-button class="btn-item" icon="share-o" />
          </div>
      </div>
        <!-- /底部区域 -->
        
        <!-- 发布评论 -->
        <van-popup
         v-model="isPostShow"
         position="bottom"
        >
          <comment-post 
            :target="article.art_id"
            @post-success="onPostSuccess"
          />
        </van-popup>
        <!-- /发布评论 -->

      </div>
      <!-- /加载完成-文章详情 -->
  
      <!-- 加载失败:404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败:404 -->
  
      <!-- 加载失败:其他 -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败:其他 -->

    <!-- /文章内容 -->
      
    </div>
    
    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      style="height: 100%;"
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/article-like'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的loading状态
      errStatus: 0, // 失败的状态码
      followLoading: false, // 关注按钮的loading状态
      totalCommentCount: 0,
      isPostShow: false, // 控制发布评论弹出层的显示状态
      commentList: [], // 评论列表
      isReplyShow: false, // 控制回复评论弹出层的显示状态
      currentComment: {} // 当前点击回复的评论项
    }
  },
  props: {
    articleId: {
        type: [Number, String, Object],
        required: true
    }
  },
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  // 给所有的后代组件提供数据
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },

    async loadArticle () {
      try {
        // 请求失败 重新加载 开启loading
        this.loading = true

        const { data } = await getArticleById
        (this.articleId)
        
        // 随机模拟404外错误
        // if (Math.random() > 0.5) {
        //   JSON.parse('abcdefde')
        // }

        this.article = data.data

        // 初始化图片点击预览
        // 数据驱动视图不是立即的 要等请求到数据渲染到dom才能拿到
        setTimeout(() => {
          this.previewImage()
        }, 0)

        // 请求成功 关闭loading
        this.loading = false
      } catch (err) {
        if (err.response && err.response.request.status === 404) {
          this.errStatus = 404
        }
        this.loading = false
        console.log('获取数据失败', err)
      }
    },

    previewImage () {
      // 得到所有img节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // 获取所有img的src的数组
      const images = []
      // 为每个绑定图片预览点击事件
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
          images: images, // 预览图片的数组
          startPosition: index, // 预览起始位置
         })
        }
      })
    },

    onPostSuccess (data) {
        // 发送成功 关闭弹出层
        this.isPostShow = false
        // 显示内容到列表顶部
        this.commentList.unshift(data.data.new_obj)

    },

    onReplyCLick (comment) {
      this.currentComment = comment

      this.isReplyShow = true
    }
  }
}
</script>

<style  scoped lang="less">
@import './github-markdown.css';

.article-container {
  min-height: 100%;
  background-color: #fff;
  /deep/.van-nav-bar__content {
    height: 85px;
    background-color: #3296fa;
    .van-nav-bar__title {
        color: #fff;
    }
    .van-icon-arrow-left:before {
        font-size: 36px;
        color: #fff;
    }
  }

  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    padding: 20px 40px 20px 40px;
    overflow-y: scroll;
    background-color: #fff;
    .van-loading--vertical {
      padding-top: 128px;
    }

    .article-detail {
        .article-title {
          height: 103px;
          padding-left: 29px;
          padding-right: 53px;
          margin-bottom: 57px;
          font-size: 40px;
        }

        .author-wrap {
          margin-bottom: 55px;
          display: flex;
          align-items: center;
          .author-avatar {
            width: 70px;
            height: 70px;
            margin-right: 9px;
          }
          .author-info {
            padding: 0;
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
             
            .follow-btn {
              width: 170px;
              height: 58px;
              border: 1px solid #dbdbdb;
              border-radius: 29px;
            }

            .author-name {
              font-size: 27px;
            }
            
            .publish-time {
              font-size: 20px;
            }
          }
        }
    }

    .error-wrap {
      padding: 200px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      .van-icon-failure:before {
        font-size: 122px;
        color: #b4b4b4;
      }
      .text {
        font-size: 30px;
        color: #666666;
        margin: 33px 0 46px;
      }
      .retry-btn {
        width: 280px;
        height: 70px;
        line-height: 70px;
        border: 1px solid #c3c3c3;
        font-size: 30px;
        color: #666666;
      }
    }

    .article-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: fixed;
      right: 0;
      left: 0;
      bottom: 0;
      background-color: #fff;
      height: 87px;
      border-top: 1px solid #dbdbdb;

      .comment-btn {
        width: 282px;
        height: 46px;
        margin-left: 29px;
        margin-right: 75px;
        border: 1px solid #dbdbdb;
        border-radius: 23px;
        text-align: left;
        font-size: 30px;
        color: #a7a7a7;
      }

      /deep/ .icon-wrap {
        position: relative;
        flex: 1;
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #dbdbdb;
        // padding-right: 39px;
        // font-size: 40px;

        // .comment-count {
        //   position: absolute;
        //   top: 24px;
        //   right: -80px;
        //   z-index: 2;
        // }

        .btn-item {
          border: none;
          font-size: 40px;
          color: #777777;

          .van-button {
            font-size: 40px;
          }
        }


        .van-info {
          position: absolute;
          right: -72px;
          top: 26px;
          z-index: 1;
          // width: 45px;
          // height: 30px;
          // background-color: red;
          // border-radius: 10px;
          text-align: center;
          color: #fff;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
