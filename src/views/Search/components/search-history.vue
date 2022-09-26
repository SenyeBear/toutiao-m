<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>&nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon
       v-else
       name="delete"
       @click="isDeleteShow = true"
      ></van-icon>
    </van-cell>
    <van-cell
     v-for="(item, index) in searchHistories"
     :key="index"
     :title="item"
     @click="onSearchItemClick(item, index)"
    >
      <van-icon v-show="isDeleteShow" name="close"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  data () {
    return {
      isDeleteShow: false, // 控制删除显示状态
    }
  },
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态 删除历史记录
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态 点击进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style  scoped lang="less">

</style>
