<template>
<!-- van-cell的to属性 和 VueRouter routerlink导航组件 to属性 用法一样 -->
<!-- :to="`/article/${article.art_id}`" -->
  <van-cell 
  class="article-item"
  :to="{
    // 根据路由名称进行跳转
    name: 'article',
    // 传递路由动态参数
    params: {
      articleId: article.art_id
    }
  }"
  >
    <div slot="title" class="title van-multi-ellipsis--l2">{{ article.title }}</div>
    <div slot="label">
      <div 
      v-if="article.cover.type === 3"
      class="cover-wrap"
      >
        <div 
        class="cover-item" 
        v-for="(img, index) in article.cover.images" :key="index">
          <van-image
            class="cover-item-image"
            :src="img"
            fit="cover"
            />
          </div>
          
      </div>
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <van-image
    v-if="article.cover.type === 1"
    slot="default" 
    class="right-cover"
    :src="article.cover.images[0]"
    fit="cover"
    />
  </van-cell> 
</template>

<script>
export default {
    name: 'ArticleItem',
  data () {
    return {
    }
  },
  props: {
    article: {
        type: Object,
        required: true
    }
  }
}
</script>

<style  scoped lang="less">
.article-item {
    .title {
        font-size: 32px;
        color: #3a3a3a;
    }
    
    .van-cell__value {
        flex: unset;
        width: 232px;
        height: 146px;
        padding-left: 25px;
    }
    
    .right-cover {
        width: 232px;
        height: 146px;
    }
    
    .label-info-wrap {
        font-size: 22px;
        color: #b4b4b4;
        span {
          margin-right: 25px;
        }
    }

    .cover-wrap {
        display: flex; 
        padding: 30px 0;
        .cover-item {
            flex: 1;
            height: 146px;
            &:not(:last-child) {
                padding-right: 4px;
            }
            .cover-item-image {
                width: 100%;
                height: 146px;
            }
        }
    }
}

</style>
