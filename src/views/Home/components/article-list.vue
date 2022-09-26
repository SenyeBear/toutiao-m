<!--  -->
<template>
  <div class="article-list">
    <van-pull-refresh 
    :success-text="refreshSuccessText"
    success-duration="1500"
    v-model="isreFreshLoading" 
    @refresh="onRefresh">
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
      >
        <!-- <van-cell 
        v-for="(article, index) in list"   :key="index" 
        :title="article.title" /> -->
        <article-item
        v-for="(article, index) in list"   :key="index"
        :article ="article"
        />
      </van-list>
    </van-pull-refresh>
    
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  components: {
    ArticleItem
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      error: false, // 控制列表加载失败的提示状态
      loading: false, // 控制加载中的loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      isreFreshLoading: false, // 控制下拉刷新的loading状态
      refreshSuccessText: '刷新成功', // 下拉刷新成功的提示文本
    }
  },
  props: {
    channel: {
        type: Object,
        required: true
    }
  },
  methods: {
    // 初始化或滚动到底部时会触发onLoad
    // 如果初始化加载的数据铺不满屏幕还会触发
    // onLoad () {
    //   // 1.请求获取数据
    //   setTimeout(() => {
    //     // 2.把请求结果数据放到list数组中
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }

    //     // 3.本次数据加载结束后设置加载状态结束
    //     // loading 关闭以后才能触发下一次的加载更多
    //     this.loading = false;

    //     // 4.判断数据是否全部加载完成
    //     if (this.list.length >= 40) {
    //     //   如果没有数据了把finished设置true 之后不再加载更多
    //       this.finished = true
    //     }
    //   }, 1000)
    // },
    async onLoad () {
      try {
        // 1.请求获取数据
        const data = await getArticle({
            channel_id: this.channel.id,
            // 请求第1页数据：当前时间戳
            // 用于请求之后数据的时间戳会在当前请求结果中返回
            timestamp: this.timestamp || Date.now() ,
        })

        // 模拟随即失败的情况
        // if (Math.random() > 0.5) {
        //     JSON.parse('dsnajajajaj')
        // }

        // 2.把请求结果数据放到list数组中
        const { pre_timestamp, results } = data.data.data
        this.list.push(...results)

        // 3.本次数据加载结束后设置加载状态结束
        this.loading = false

        // 4.判断数据是否全部加载完成
        if (results.length) {
            // 更新获取下一页数据的时间戳
            this.timestamp = pre_timestamp
        } else {
            // 没有数据了 设置finished结束状态
            this.finished = true
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true
        // 请求失败了 loading也需要关闭
        this.loading = false

      }

      


    },

    // 当下拉刷新的时候会触发该调用函数
    async onRefresh() {
      try {
        // 1.请求加载数据
      const data = await getArticle({
            channel_id: this.channel.id,
            // 下拉刷新 每次请求获取最新数据 所以是最新时间戳
            timestamp: Date.now() ,
        })

        // 模拟随即失败的情况
        // if (Math.random() > 0.2) {
        //     JSON.parse('dsnajajajaj')
        // }

      // 2.将数据追加到列表顶部
      const { results } = data.data.data
      this.list.unshift(...results)

      // 3.关闭下拉刷新的loading状态
      this.isreFreshLoading = false

      // 4.更新刷新成功提示的文本
      this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
    } catch (err) {
      this.isreFreshLoading = false
      this.refreshSuccessText = `刷新失败`
    }
   }
  }
}
</script>

<style  scoped lang="less">
.article-list {
    height: 79vh;
    overflow-y: auto;
}

</style>
