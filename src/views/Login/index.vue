<!--  -->
<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <!-- vant封装了input type和maxlength是html5自带功能 -->
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button class="send-sms-btn" >
          <!-- 倒计时时间 -->
          <van-count-down 
          v-if="isCountDownShow"
          :time="time" 
          format="ss 秒"
          @finish="isCountDownShow = false" />
          <van-button 
          v-else
          @click="onSendSms"
          round 
          size="small" 
          type="default"
          native-type="button"   >
          发送验证码
          </van-button>
        </template> 
      </van-field>
      <div style="margin: 16px;" class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import {login, sendSms} from '@/api/user'

export default {
  name: 'LoginIndex',
   data() {
    return {
      user: {
        mobile: '', // 手机号
        code: '', // 验证码
      },
      // 配置表单验证规则
      userFormRules: {
        mobile: [{ 
          required: true, 
          message: '手机号不能为空' 
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{ 
          required: true, 
          message: '验证码不能为空' 
        }, {
           pattern: /^\d{6}$/,
           message: '验证码格式错误'
        }],
      },
      // 倒计时时间
      time: 60 * 1000,
      isCountDownShow: false,
    }
  },
  methods: {
    // 登录功能
    async onSubmit (values) {
      // 1.获取表单数据
      const user = this.user

      // 2.表单验证

      // 在组件中必须通过this.$toast 来调用 Toast组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0, // 持续时间，默认2s 如果为0则持续展示
      })
      // 3.提交表单请求登录
      try {
        const {data} = await login(user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')

        // 登录成功 跳转回原来页面
        // back的方式不严谨 后面功能优化
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误')

        } else {
          console.log('登录失败，请稍后重试', err)
          this.$toast.fail('登录失败')
        }
      }
      // 4.根据请求响应结果处理后续操作
    },

    // 发送验证码
    async onSendSms () {
      // 1.校验手机号
      try {
        this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      
      // 2.验证通过，显示倒计时
      this.isCountDownShow = true;

      // 3.请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          console.log('发送失败', err)
        }
      }
    }
  }
}
</script>

<style  scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }

  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;

    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
