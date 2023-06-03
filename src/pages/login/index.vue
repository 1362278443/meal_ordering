<template>
  <view class="wrap">
    <view class="top"></view>
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
    <view class="buttom">
      <view class="loginType">
        <view class="wechat item">
          <view class="icon"
            ><u-icon
              size="70"
              name="weixin-fill"
              color="rgb(83,194,64)"
            ></u-icon
          ></view>
          微信
        </view>
        <view class="QQ item">
          <view class="icon"
            ><u-icon size="70" name="qq-fill" color="rgb(17,183,233)"></u-icon
          ></view>
          QQ
        </view>
      </view>
      <view class="hint">
        登录代表同意
        <text class="link">用户协议、隐私政策，</text>
        并授权使用您的账号信息（如昵称、头像、收获地址）以便您统一管理
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/modules/authStore'
import { Toast } from '@/utils/uniapi/prompt'
import { userApi } from '@/api'
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useRouter } from 'uni-mini-router'

const pageQuery = ref<Record<string, any> | undefined>(undefined)
onLoad((query: any) => {
  pageQuery.value = query
})

const router = useRouter()

const form = reactive({
  email: 'uni-app@test.com',
  password: 'Vue3_Ts_Vite'
})
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
}
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
  .buttom {
    .loginType {
      display: flex;
      padding: 350rpx 150rpx 150rpx 150rpx;
      justify-content: space-between;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: $u-content-color;
        font-size: 28rpx;
      }
    }

    .hint {
      padding: 20rpx 40rpx;
      font-size: 20rpx;
      color: $u-tips-color;

      .link {
        color: $u-warning;
      }
    }
  }
}
</style>
