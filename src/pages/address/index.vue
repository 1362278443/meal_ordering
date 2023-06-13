<template>
  <view>
    <u-navbar title="选择地址" fixed placeholder @left-click="back"></u-navbar>
    <view
      class="item"
      v-for="(res, index) in addressList"
      :key="res.id"
      @click="selectAddress(res.id!)"
    >
      <view class="top">
        <view class="name">{{ res.consignee }}</view>
        <view class="phone">{{ res.phone }}</view>
        <view class="tag">
          <text class="current" v-if="currentAddress === res.id">当前</text>
          <text class="yellow" v-if="res.isDefault"> 默认 </text>
          <text v-if="res.label?.length"> {{ res.label }}</text>
        </view>
      </view>
      <view class="bottom">
        {{ res.detail }}
        <u-icon
          class="ml-auto"
          @click="removeAddress(res.id!)"
          name="trash"
          :size="40"
          color="#B42929"
        ></u-icon>
        <u-icon
          @click="editAddress(res.id!)"
          name="edit-pen"
          :size="40"
          color="#999999"
        ></u-icon>
      </view>
    </view>
    <view class="addSite" @tap="addAddress">
      <view class="add">
        <u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon
        >新建收货地址
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { addressApi } from '@/api'
import router from '@/router'
import { ref } from 'vue'
import { useAddressStore } from '@/store'

const addressStore = useAddressStore()

const addressList = ref<Array<Address>>([])

const currentAddress = ref(addressStore.id)

onShow(() => {
  //获取地址列表
  addressApi.getAddressList().then((res) => {
    addressList.value = res.data
  })
})

const addAddress = () => {
  router.push({ name: 'addressAdd' })
}

//删除地址
const removeAddress = (id: number) => {
  addressApi.removeAddress(id).then(() => {
    addressApi.getAddressList().then((res) => {
      addressList.value = res.data
    })
  })
}

const editAddress = (id: number) => {
  router.push({
    name: 'addressAdd',
    params: {
      id: id.toString()
    }
  })
}

//选择地址
const selectAddress = (id: number) => {
  if (currentAddress.value === id) {
    return
  }
  addressStore.setAddress(id)
  currentAddress.value = id
}

//返回
const back = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.item {
  padding: 40rpx 20rpx;
  .top {
    display: flex;
    font-weight: bold;
    font-size: 34rpx;
    .phone {
      margin-left: 60rpx;
    }
    .tag {
      display: flex;
      font-weight: normal;
      align-items: center;
      text {
        display: block;
        width: 60rpx;
        height: 34rpx;
        line-height: 34rpx;
        color: #ffffff;
        font-size: 20rpx;
        border-radius: 6rpx;
        text-align: center;
        margin-left: 30rpx;
        background-color: rgb(49, 145, 253);
      }
      .yellow {
        background-color: $color-warning;
      }
      .current {
        background-color: coral;
      }
    }
  }
  .bottom {
    display: flex;
    margin-top: 20rpx;
    font-size: 28rpx;
    justify-content: space-between;
    color: #999999;
  }
}
.addSite {
  display: flex;
  justify-content: space-around;
  width: 600rpx;
  line-height: 100rpx;
  position: sticky;
  bottom: 30rpx;
  left: 80rpx;
  background-color: $color-primary;
  border-radius: 60rpx;
  font-size: 30rpx;
  .add {
    display: flex;
    align-items: center;
    color: #ffffff;
    .icon {
      margin-right: 10rpx;
    }
  }
}
</style>
