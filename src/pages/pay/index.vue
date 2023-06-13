<template>
  <u-navbar title="付款" fixed placeholder auto-back></u-navbar>
  <view class="container position-relative">
    <view style="margin-bottom: 130rpx">
      <view class="section-1">
        <list-cell @click="chooseAddress">
          <view class="w-100 flex-col">
            <view class="flex items-center flex-justify-between mb-10">
              <view class="text-size-lg text-dark-50">{{
                address?.detail
              }}</view>
              <u-icon name="arrow-left" class="arrow" size="30"></u-icon>
            </view>
            <view class="flex text-gray-500 text-size-sm items-center">
              <view class="mr-5">{{ address?.consignee }}</view>
              <view class="mr-10">{{ address?.sex ? '先生' : '女士' }}</view>
              <view>{{ address?.phone }}</view>
            </view>
          </view>
        </list-cell>
      </view>
      <!-- 购物车列表 begin -->
      <view class="section-2">
        <view class="cart flex flex-col">
          <list-cell last v-for="(item, index) in cart" :key="index">
            <view class="w-100 flex flex-col">
              <view class="flex items-center mb-10">
                <view class="name-and-props overflow-hidden">
                  <view class="text-dark-200 text-size-lg">
                    {{ item.name }}
                  </view>
                </view>
                <view
                  class="flex flex-grow justify-between items-center text-dark-200 text-size-lg"
                >
                  <view>x{{ item.number }}</view>
                  <view>￥{{ item.amount }}</view>
                </view>
              </view>
              <view class="text-truncate text-gray-500">
                {{ item.dishFlavor }}
              </view>
            </view>
          </list-cell>
        </view>
        <list-cell last>
          <view class="flex flex-grow justify-end items-center">
            <view>总计￥{{ total }}</view>
          </view>
        </list-cell>
      </view>
      <!-- 购物车列表 end -->
      <!-- 备注 begin -->
      <list-cell arrow last>
        <view
          class="flex flex-grow items-center justify-between overflow-hidden"
        >
          <view class="flex-shrink-0 mr-20">备注</view>
        </view>
      </list-cell>
      <u-textarea
        auto-height
        v-model="form!.remark"
        placeholder="请输入内容"
        count
        fixed
        class="mx-5"
      ></u-textarea>
      <!-- 备注 end -->
    </view>
    <!-- 付款栏 begin -->
    <view class="pay_btn" @tap="openPopup">
      <view class="pay"> 付款 </view>
    </view>
    <!-- 付款栏 end -->
    <u-popup
      mode="bottom"
      :show="popup"
      close-on-click-overlay
      @close="closePopup"
    >
      <list class="m-4">
        <u-icon name="weixin-fill" size="30" @click="pay(1)"></u-icon>
        微信支付
      </list>
      <list class="m-4">
        <u-icon name="zhifubao" size="30" @click="pay(2)"> </u-icon>
        支付宝支付
      </list>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
// import { mapState, mapMutations } from 'vuex'
import ListCell from '@/components/list-cell.vue'
import { addressApi, cartApi, orderApi } from '@/api'
import router from '@/router'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { useAddressStore, useUserStore } from '@/store'

const userStore = useUserStore()
const addressStore = useAddressStore()

const radio = ref([
  {
    name: '微信支付',
    disabled: false
  },
  {
    name: '支付宝支付',
    disabled: false
  }
])

const order = ref<Order>()
const cart = ref<Array<Cart>>([]) // 购物车
const address = ref<Address>() //收货地址
const form = { remark: '' }
const popup = ref(false)

onShow(() => {
  console.log('show')
  //获取购物车数据
  cartApi.getCartList().then((res) => {
    cart.value = res.data
  })

  //获取默认地址
  console.log(addressStore.id)
  addressApi.getAddress(addressStore.id!).then((res) => {
    address.value = res.data
  })
})

const total = computed(() =>
  cart.value.reduce((acc, cur) => acc + cur.number * cur.amount, 0)
)

function chooseAddress() {
  router.push({ name: 'address' })
}

function openPopup() {
  popup.value = true
}

function closePopup() {
  popup.value = false
}

function pay(orderType: number) {
  uni.showLoading({ title: '加载中' })
  order.value = {
    status: 1,
    userId: userStore.id!,
    addressBookId: addressStore.getId!,
    payMethod: orderType,
    amount: total.value,
    remark: form.remark,
    phone: address.value!.phone!,
    adress: address.value!.detail!,
    consignee: address.value!.consignee!
  }
  console.log(order.value)
  orderApi
    .submitOrder(order.value)
    .then((res) => {
      if (!res.data) {
        uni.showToast({
          title: '下单失败',
          icon: 'none',
          duration: 2000
        })
        return
      }
      order.value = res.data
      orderApi.payOrder(order.value!).then((res) => {
        uni.hideLoading()
        if (res.data === '支付成功') {
          uni.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
          router.back()
        } else {
          uni.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    })
    .catch(() => {
      uni.hideLoading()
      uni.showToast({
        title: '支付失败',
        icon: 'none',
        duration: 2000
      })
    })
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
}

.arrow {
  position: relative;
  margin-right: -10rpx;
}

.section-1 {
  margin-bottom: 30rpx;
  .contact {
    .contact-tip {
      margin-left: 10rpx;
      border: 2rpx solid $color-primary;
      padding: 6rpx 10rpx;
      color: $color-primary;
    }
  }
}

.section-2 {
  .name-and-props {
    width: 65%;
  }
}

.pay_btn {
  display: flex;
  justify-content: space-around;
  width: 600rpx;
  line-height: 100rpx;
  position: absolute;
  bottom: 30rpx;
  left: 80rpx;
  background-color: $color-primary;
  border-radius: 60rpx;
  font-size: 30rpx;
  .pay {
    display: flex;
    align-items: center;
    color: #ffffff;
    .icon {
      margin-right: 10rpx;
    }
  }
}
</style>
