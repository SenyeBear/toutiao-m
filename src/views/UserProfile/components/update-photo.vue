<template>
  <div class="update-photo">
    <img class="img" :src="img" alt="" ref="img">

    <div class="tool-bar">
        <div class="cancel" @click="$emit('close')">取消</div>
        <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  data () {
    return {
        cropper: null
    }
  },
  props: {
    img: {
        type: [String, Object],
        required: true
    }
  },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
    })
  },
  methods: {
    onConfirm () {
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },

    async updateUserPhoto (blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const formData = new FormData()
        formData.append('photo', blob)  
        const { data } = await updateUserPhoto (formData)  
        // 关闭弹出层
        this.$emit('close')  
        // 更新视图
        this.$emit('update-photo', data.data.  photo)
        // 展示提示
        this.$toast('更新成功')
      } catch (err) {
        console.log(err)
        this.$toast('更新失败')
      }    
      
    }
  }
}
</script>

<style  scoped lang="less">
.update-photo {
  height: 100%;
  background-color: #000;

  .img {
    display: block;
    max-width: 100%;
  }
  .tool-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;

    .cancel, .confirm {
        width: 90px;
        height: 90px;
        color: #fff;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
  }
}

</style>
