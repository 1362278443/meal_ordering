<template>
  <u-navbar title="添加地址" fixed placeholder auto-back></u-navbar>
  <u-form class="mx-10 m-5" label-width="auto" :model="address" ref="form1">
    <u-form-item required label="收货人" prop="consignee">
      <u-input
        type="text"
        placeholder-class="line"
        placeholder="请填写收货人姓名"
        v-model="address.consignee"
      />
    </u-form-item>
    <u-form-item required label="性别 男/女" prop="sex">
      <u-switch v-model="address!.sex"></u-switch>
    </u-form-item>

    <u-form-item required label="手机号码" prop="phone">
      <u-input
        type="text"
        placeholder-class="line"
        placeholder="请填写收货人手机号"
        v-model="address.phone"
      />
    </u-form-item>
    <u-form-item required label="详细地址" prop="detail">
      <u-input
        type="text"
        placeholder-class="line"
        placeholder="请填写收货人详细地址"
        v-model="address.detail"
      />
    </u-form-item>
    <u-form-item label="标签" prop="label">
      <u-input
        v-model="address.label"
        type="text"
        placeholder-class="line"
        placeholder="标签"
      />
    </u-form-item>
    <u-form-item required label="是否设置为默认地址" prop="is_default">
      <u-switch v-model="address!.isDefault"></u-switch>
    </u-form-item>
  </u-form>
  <view class="addSite" @tap="">
    <u-button
      class="m-3"
      type="primary"
      :color="$u.color.primary"
      @click="submit"
    >
      提交
    </u-button>
  </view>
</template>

<script setup lang="ts">
import { addressApi } from '@/api'
import router from '@/router'
import { useUserStore } from '@/store'
import { Toast } from '@/utils/uniapi/prompt'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const userStore = useUserStore()

const address = ref<Address>({
  id: undefined,
  userId: userStore.id,
  consignee: undefined,
  sex: 0,
  phone: undefined,
  detail: undefined,
  label: undefined,
  isDefault: false
})

var isEdit = false

onLoad((query: any) => {
  console.log(query)
  if (query['id']) {
    isEdit = true
    console.log('修改数据')

    //向后端请求数据
    addressApi
      .getAddress(query['id'])
      .then((res) => {
        address.value = res.data
        console.log(address.value)
      })
      .catch((res) => {
        Toast(res.msg)
        //查询失败则返回
        router.back()
      })
  }
})

const submit = () => {
  address.value.sex = Number(address.value.sex)

  //如果是修改
  if (isEdit) {
    console.log(address.value)
    addressApi.editAddress(address.value).then(() => {
      router.back()
    })
  } else {
    addressApi.addAddress(address.value).then(() => {
      router.back()
    })
  }
}
</script>

<style lang="scss" scoped></style>
