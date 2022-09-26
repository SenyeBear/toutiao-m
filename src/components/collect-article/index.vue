<template>
  <van-button
   :icon="value ? 'star' : 'star-o'"
   :class="{
    collected: value
   }"
   :loading="loading"
   @click="onCollect"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'

export default {
  name: 'CollectArticle',
  data () {
    return {
      loading: false
    }
  },
  props: {
    value: {
        type: Boolean,
        required: true
    },
    articleId: {
        type: [Number, String, Object],
        required: true
    }
  },
  methods: {
    async onCollect () {
        this.loading = true
        try {
          if (this.value) {
            await deleteCollect(this.articleId)
          } else {
            await addCollect(this.articleId)
          }
          this.$emit('input', !this.value)
          this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
        } catch (err) {
            console.log(err);
        }
        this.loading = false
    }
  }
}
</script>

<style  scoped lang="less">
.collected {
  .van-icon {
    color: #ffa500;
  }
  
}
</style>
