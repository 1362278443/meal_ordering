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

<template>
  <view class="container">
    <view class="title">登录</view>
    <view class="form-wrap">
      <form class="form" @submit="submit">
        <label class="form-item">
          <view class="form-label">邮箱:</view>
          <view class="form-element"
            ><input name="email" :value="form.email"
          /></view>
        </label>
        <label class="form-item">
          <view class="form-label">密码:</view>
          <view class="form-element"
            ><input type="password" name="password" :value="form.password"
          /></view>
        </label>
        <button form-type="submit" class="submit-btn" hover-class="none">
          登录
        </button>
      </form>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  width: 80%;

  .title {
    padding: 320rpx 0 32rpx 0;
    text-align: center;
  }

  .form-wrap {
    padding: 20rpx 24rpx;
    box-shadow: 16rpx 16rpx 30rpx #e5e7eb;

    .form {
      .form-item {
        display: flex;
        height: 88rpx;
        border-bottom: 2rpx solid #dbeafe;
        align-items: center;

        .form-label {
          min-width: 96rpx;
        }

        .form-element {
          flex-grow: 1;
        }
      }

      .submit-btn {
        margin-top: 44rpx;
        border: 4rpx solid #bfdbfe;
        background-color: #60a5fa;
        border-radius: 8rpx;
        font-size: 28rpx;
        color: #ffffff;

        :hover {
          background-color: #3b82f6;
        }
      }
    }
  }
}
</style>
