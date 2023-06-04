<template>
  <view class="wrap">
    <view class="top h-20"></view>
    <view class="content">
      <view class="title">欢迎登录</view>
      <input
        class="u-border-bottom"
        type="number"
        v-model="tel"
        placeholder="请输入手机号"
      />
      <view class="tips">未注册的手机号验证后自动创建账号</view>
      <button @tap="submit" :style="[inputStyle]" class="getCaptcha">
        获取短信验证码
      </button>
      <view class="alternative">
        <view class="password">密码登录</view>
        <view class="issue">遇到问题</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store'
import { Toast } from '@/utils/uniapi/prompt'
import { userApi } from '@/api'
import { StyleValue, computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useRouter } from 'uni-mini-router'

const pageQuery = ref<Record<string, any> | undefined>(undefined)
onLoad((query: any) => {
  pageQuery.value = query
})

const router = useRouter()

const tel = ref('')

const authStore = useAuthStore()

const submit = (e: any) => {
  // userApi.login(e.detail.value).then((res) => {
  //   Toast('登录成功', { duration: 1500 })
  //   authStore.setToken(res.data.token)
  //   setTimeout(() => {
  //     // 返回上一页
  //     router.back()
  //   }, 1500)
  // })

  if (uni.$u.test.mobile(tel.value)) {
    router.push({
      name: 'code',
      params: {
        tel: tel.value
      }
    })
  } else {
    Toast('请输入正确的手机号', { duration: 1500 })
  }
}

const inputStyle = computed(() => {
  let style: StyleValue = {}
  if (tel.value) {
    style.color = '#fff'
    style.backgroundColor = uni.$u.color['warning']
  }
  console.log(style)
  return style
})
</script>

<style lang="scss" scoped>
.wrap {
  font-size: 28rpx;
  .content {
    width: 600rpx;
    margin: 80rpx auto 0;

    .title {
      text-align: left;
      font-size: 60rpx;
      font-weight: 500;
      margin-bottom: 100rpx;
    }
    input {
      text-align: left;
      margin-bottom: 10rpx;
      padding-bottom: 6rpx;
    }
    .tips {
      color: $u-info;
      margin-bottom: 60rpx;
      margin-top: 8rpx;
    }
    .getCaptcha {
      background-color: rgb(253, 243, 208);
      color: $u-tips-color;
      border: none;
      font-size: 30rpx;
      padding: 12rpx 0;

      &::after {
        border: none;
      }
    }
    .alternative {
      color: $u-tips-color;
      display: flex;
      justify-content: space-between;
      margin-top: 30rpx;
    }
  }
}
</style>
