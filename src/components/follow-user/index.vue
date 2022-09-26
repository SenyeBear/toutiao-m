<template>
    <van-button
       v-if="value"
       slot="right-icon"  
       type="plain"
       size="small"
       :loading="loading"
       @click="onFollow"
      >已关注
      </van-button>
      <van-button
       v-else
       slot="right-icon"  
       type="info"
       icon="plus"
       size="small"
       :loading="loading"
       @click="onFollow"
      >关注
    </van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
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
    userId: {
        type: [Number, String, Object],
        required: true
    }
  },
  methods: {
    async onFollow () {
      // 展示loading状态
      this.loading = true
      try {
        if (this.value) {
          // 取消关注
          await deleteFollow(this.userId)
        } else {
          // 关注
          await addFollow(this.userId)
        }
        // this.isFollowed = !this.isFollowed
        // 更新视图状态
        this.$emit('input', !this.value)
      } catch (err) {
        let message = '操作失败，请重试'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      // 无论请求成功还是失败最后都关闭loading状态
      this.loading = false

    }
  }
}
</script>

<style  scoped>

</style>
