<template>
  <div class="search-suggestion">
    <van-cell
     v-for="(text,index) in suggestions"
     :key="index"
     icon="search"
     @click="$emit('search', text.title)"
    >
      <div slot="title" v-html="highlight(text.title)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  data () {
    return {
      suggestions: [], // 联想数据列表
    }
  },
  props: {
    searchText: {
      type: String,
      require: true
    }
  },
  watch: {
    searchText: {
      // 当searchText发生变化 自动调用handler函数
      // handler (value) {
      //   this.loadSearchSuggestions(value)
      // },
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 300),
      // 侦听开始后立即调用
      immediate: true,
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q) 
        this.suggestions = data.data.results
      } catch (err) {
        console.log('数据获取失败，请稍后重试');
      }
    },

    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style  scoped lang="less">
.search-suggestion {
  /deep/span.active {
    color: #3296fa;
  }
}
</style>
