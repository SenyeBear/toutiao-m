<template>
  <div class="update-birthday">
    <!-- currentData 双向绑定日期选择器
        设置日期选择器默认值
        同步日期选择器选择的日期
        minData 可选最小日期
        maxData 可选最大日期
        月份从0起
     -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  data () {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    }
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        // 利用dayjs包处理日期格式
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
    
        await updateUserProfile({
          birthday: currentDate
        })
        
        // 更新视图
        this.$emit('input', currentDate)
        // 关闭弹层
        this.$emit('close')
        //提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style  scoped>

</style>
