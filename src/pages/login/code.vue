<template>
  <view class="wrap">
    <view class="key-input">
      <view class="title">输入验证码</view>
      <view class="tips">验证码已发送至 +{{ pageQuery['tel'] }}</view>
      <u-code-input
        :focus="true"
        :value="value"
        @change="change"
        @finish="finish"
        mode="box"
        :maxlength="maxlength"
      ></u-code-input>
      <text :class="{ error: error }">验证码错误，请重新输入</text>
      <view class="captcha">
        <text :class="{ noCaptcha: show }" @tap="noCaptcha">点我重新发送</text>
        <text :class="{ regain: !show }">{{ second }}秒后重新获取验证码</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore, useAuthStore } from '@/store'
import { Toast } from '@/utils/uniapi/prompt'
import { userApi } from '@/api'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useRouter } from 'uni-mini-router'

const pageQuery = ref<Record<string, any>>({})

onLoad((query: any) => {
  pageQuery.value = query

  //向后端请求验证码
  userApi.getCode(pageQuery.value['tel']).then((res) => {
    Toast(res.data, { duration: 1500 })
  })
})

const router = useRouter()

const authStore = useAuthStore()
const userStore = useUserStore()

const maxlength = ref(6)
const value = ref('')
const second = ref(3)
const show = ref(false)
const error = ref(false)

let interval = setInterval(() => {
  second.value--
  if (second.value <= 0) {
    show.value = true
    clearInterval(interval)
  }
}, 1000)

// 重新发送验证码
const noCaptcha = () => {
  userApi.getCode(pageQuery.value['tel']).then((res) => {
    Toast(res.data, { duration: 1500 })
  })
}
// change事件侦听
const change = (value: string) => {
  // console.log('change', value);
}
// 输入完验证码最后一位执行
const finish = (value: string) => {
  // 完成发送请求验证
  console.log('finish', value)
  userApi
    .login({
      phone: pageQuery.value['tel'],
      code: value
    })
    .then((res) => {
      console.log(res)
      if (res.code === 1) {
        Toast('登录成功', { duration: 1500 })
        authStore.setToken(res.data.id)
        userStore.setUserInfo(res.data)
        router.push({ name: 'Home' })
      } else {
        value = ''
        error.value = true
      }
    })
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 80rpx;
}

.box {
  margin: 30rpx 0;
  font-size: 30rpx;
  color: 555;
}

.key-input {
  padding: 30rpx 0;
  text {
    display: none;
  }
  .error {
    display: block;
    color: red;
    font-size: 30rpx;
    margin: 20rpx 0;
  }
}

.title {
  font-size: 50rpx;
  color: #333;
}

.key-input .tips {
  font-size: 30rpx;
  color: #333;
  margin-top: 20rpx;
  margin-bottom: 60rpx;
}
.captcha {
  color: $u-warning;
  font-size: 30rpx;
  margin-top: 40rpx;
  .noCaptcha {
    display: block;
  }
  .regain {
    display: block;
  }
}
</style>
