<template>
  <div class="search-result">
    <van-list
     v-model="loading"
     :finished="finished"
     finished-text="没有更多了"
     :error.sync="error"
     error-text="加载失败，请点击重试"
     @load="onLoad"
    >
      <van-cell
       v-for="(article, index) in list" 
       :key="index" 
       :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 10,
      error: false
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    async onLoad() {
      // 1.请求加载数据
      // 2.将数据添加到数组列表
      // 3.将本次loading设置结束
      // 4.判断是否还有数据
        // 有 更新获取下一页页码
        // 无 将finished设置true
      try {
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.searchText
        })

        const { results } = data.data
        this.list.push(...results)

        this.loading = false

        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        // 展示加载失败的提示状态
        this.error = true
        // 加载失败 loading也要关闭
        this.loading = false
      }
    },
  }
}
</script>

<style  scoped lang="less">

</style>
