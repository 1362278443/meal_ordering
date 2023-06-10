<template>
  <view class="container">
    <view class="main">
      <view class="nav">
        <!-- 头部 -->
        <view class="header">
          <view class="left">
            <view class="flex items-center overflow-hidden">
              <u-icon name="map"></u-icon>
              <view
                class="text-size-lg text-color-base font-weight-bold text-truncate"
              >
                <!-- {{ address.street }} -->
                理塘大街
              </view>
            </view>
            <view
              class="text-size-sm text-gray-400 overflow-hidden text-truncate"
            >
              由
              <!-- <text class="text-color-base" style="margin: 0 10rpx">{{
                store.name
              }}</text -->
              <text class="text-gray-700" style="margin: 0 10rpx">
                理塘丁真
              </text>
              配送
            </view>
          </view>
        </view>
      </view>
      <!-- 主页面 -->
      <view class="content">
        <!-- 左侧菜单 -->
        <scroll-view
          class="menus"
          :scroll-into-view="menuScrollIntoView"
          scroll-with-animation
          scroll-y
        >
          <view
            class="menu"
            :id="`menu-${item.id}`"
            :class="{ current: item.id === currentCateId }"
            v-for="(item, index) in categories"
            :key="index"
            @tap="handleMenuTap(item.id)"
          >
            <text>{{ item.name }}</text>
            <u-badge
              absolute
              bg-color="#FFC711"
              offset="[8rpx, 10rpx]"
              type="success"
              :value="menuCartNum(item.id)"
              max="99"
            ></u-badge>
          </view>
        </scroll-view>
        <!-- 商品列表 -->
        <scroll-view
          class="goods"
          scroll-with-animation
          scroll-y
          :scroll-top="cateScrollTop"
          @scroll="handleGoodsScroll"
        >
          <view class="wrapper">
            <view class="list">
              <view class="items">
                <view class="good" v-for="(item, key) in goods" :key="key">
                  <image :src="item.image" class="image"></image>
                  <view class="right">
                    <text class="name">{{ item.name }}</text>
                    <text class="tips">{{ item.description }}</text>
                    <view class="price_and_action">
                      <text class="price">￥{{ item.price }}</text>

                      <view class="btn-group" v-if="item.use_property">
                        <u-button
                          class="mr-3"
                          shape="circle"
                          type="primary"
                          :color="$u.color.primary"
                          @click="showGoodDetailModal(item)"
                          size="small"
                        >
                          选规格
                        </u-button>
                        <view class="dot" v-show="goodCartNum(item.id)">{{
                          goodCartNum(item.id)
                        }}</view>
                      </view>
                      <view class="btn-group" v-else>
                        <round-button
                          v-show="goodCartNum(item.id)"
                          icon="minus"
                          @click="handleReduceFromCart(item)"
                        >
                        </round-button>
                        <view class="number" v-show="goodCartNum(item.id)">{{
                          goodCartNum(item.id)
                        }}</view>
                        <round-button
                          icon="plus"
                          type="primary"
                          :color="$u.color.primary"
                          @click="handleAddToCart(item.categrory_id, item, 1)"
                        >
                        </round-button>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- content end -->
      <!-- 购物车栏 begin -->
      <view class="cart-box" v-if="cart.length > 0">
        <view class="mark">
          <u-icon
            @click="openCartPopup"
            class="cart-img"
            size="60"
            name="shopping-cart"
          ></u-icon>
          <view class="tag">{{ getCartGoodsNumber }}</view>
        </view>
        <view class="price">￥{{ getCartGoodsPrice }}</view>
        <button type="primary" class="pay-btn" @tap="toPay">去结算</button>
      </view>
      <!-- 购物车栏 end -->
    </view>
    <!-- 商品详情模态框 begin -->
    <u-modal
      :show="goodDetailModalVisible"
      closeOnClickOverlay
      @close="closeGoodDetailModal"
    >
      <view class="good-detail-modal">
        <view class="cover">
          <view class="btn-group">
            <u-icon
              bold
              size="18"
              name="close"
              @click="closeGoodDetailModal"
            ></u-icon>
          </view>
        </view>
        <scroll-view class="detail" scroll-y>
          <view class="wrapper">
            <view class="basic">
              <view class="name">{{ good?.name }}</view>
              <view class="tips">{{ good?.description }}</view>
            </view>
            <view class="properties" v-if="good?.flavors">
              <view
                class="property"
                v-for="(item, index) in good.flavors"
                :key="index"
              >
                <view class="title">
                  <text class="name">{{ item.name }}</text>
                  <!-- <view class="desc" v-if="item.desc">({{ item.desc }})</view> -->
                </view>
                <view class="values">
                  <view
                    class="value"
                    v-for="(value, key) in item.value"
                    :key="key"
                    :class="{ default: item.default_value == key }"
                    @tap="changePropertyDefault(index, key)"
                  >
                    {{ value }}
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="action">
          <view class="left">
            <view class="price">￥{{ good?.price }}</view>
            <view class="props" v-if="getGoodSelectedProps(good!)">
              {{ getGoodSelectedProps(good!) }}
            </view>
          </view>
          <view class="btn-group">
            <roundButton
              icon="minus"
              plain
              type="default"
              @click="handlePropertyReduce"
            >
            </roundButton>
            <view class="number">{{ good?.number }}</view>
            <roundButton icon="plus" type="primary" @click="handlePropertyAdd">
            </roundButton>
          </view>
        </view>
      </view>

      <template #confirmButton>
        <u-button
          slot="confirm-button"
          text="加入购物车"
          type="primary"
          shape="circle"
          @click="handleAddToCartInModal"
        >
        </u-button>
      </template>
    </u-modal>
    <!-- 商品详情模态框 end -->
    <!-- 购物车详情popup -->
    <u-popup
      mode="bottom"
      :show="cartPopupVisible"
      close-on-click-overlay
      class="cart-popup"
      round="50"
      @close="closeCartPopup"
    >
      <view class="top">
        <text @tap="handleCartClear">清空</text>
      </view>
      <scroll-view class="cart-list" scroll-y>
        <view class="wrapper">
          <view class="item" v-for="(item, index) in cart" :key="index">
            <view class="left">
              <view class="name">{{ item.name }}</view>
              <view class="props">{{ item.dish_flavor.join(',') }}</view>
            </view>
            <view class="center">
              <text>￥{{ item.amount * item.number }}</text>
            </view>
            <view class="right">
              <roundButton icon="minus" @click="handleCartItemReduce(index)">
              </roundButton>
              <view class="number">{{ item.number }}</view>
              <roundButton
                icon="plus"
                type="primary"
                @click="handleCartItemAdd(index)"
              >
              </roundButton>
            </view>
          </view>
          <!-- 额外费用 -->
          <!-- <view class="item">
            <view class="left">
              <view class="name">包装费</view>
            </view>
            <view class="center">
              <text>￥{{ parseFloat(store.packing_fee) }}</text>
            </view>
            <view class="right invisible">
              <button
                type="default"
                plain
                size="mini"
                class="btn"
                hover-class="none"
              >
                <view class="iconfont iconsami-select"></view>
              </button>
              <view class="number">1</view>
              <button type="primary" class="btn" size="min" hover-class="none">
                <view class="iconfont iconadd-select"></view>
              </button>
            </view>
          </view> -->
        </view>
      </scroll-view>
    </u-popup>
    <!-- 购物车详情popup -->
    <u-loading-page
      loading-text="loading"
      loading-mode="circle"
      :loading="loading"
    />
  </view>
</template>

<script setup lang="ts">
import roundButton from '@/components/round-button.vue'
import useUserStore from '@/store/modules/userStore'
import { onLoad } from '@dcloudio/uni-app'
import axios from 'axios'
import { computed, nextTick, ref } from 'vue'

// import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

onLoad(async (query: any) => {
  await init()
})

//类型
const categories = ref<Array<Category>>([]) // 分类列表
const goods = ref<Array<Dish>>([]) // 所有商品
const loading = ref(true)
const currentCateId = ref(6905) // 默认分类
const cateScrollTop = ref(0)
const menuScrollIntoView = ref('')
const cart = ref<Array<Cart>>([]) // 购物车
const goodDetailModalVisible = ref(false) // 是否商品详情模态框
const good = ref<Dish>() // 当前商品
const cartPopupVisible = ref(false)
const sizeCalcState = ref(false)
const address = ref({}) //收货地址
const store = ref({}) //店铺信息

//计算属性
const goodCartNum = computed(() => {
  //获取商品在购物车数量
  return (id: number) => {
    return cart.value.reduce((acc, cur) => {
      if (cur.dish_id === id) {
        return (acc += cur.number)
      }
      return acc
    }, 0)
  }
})

const menuCartNum = computed(() => {
  return (id: number) =>
    cart.value.reduce((acc, cur) => {
      if (cur.cate_id === id) {
        return (acc += cur.number)
      }
      return acc
    }, 0)
})
const getCartGoodsNumber = computed(() => {
  //计算购物车总数
  return cart.value.reduce((acc, cur) => acc + cur.number, 0)
})

const getCartGoodsPrice = computed(() => {
  //计算购物车总价
  return cart.value.reduce((acc, cur) => acc + cur.number * cur.amount, 0)
})

//方法

const init = async () => {
  //页面初始化
  loading.value = true
  // await getStore()
  // goods.value = await $api('goods')
  // categories.value = await $api('categories')
  await axios.get('/api/cate').then((res) => {
    console.log(res)
    categories.value = res.data.data
  })
  await axios.get('/api/goods').then((res) => {
    console.log(res)
    goods.value = res.data.data
    console.log(goods)
  })
  loading.value = false
  cart.value = uni.getStorageSync('cart') || []
  // console.log('aaaa')
}

const handleMenuTap = (id) => {
  // 点击菜单项事件
  if (!sizeCalcState.value) {
    calcSize()
  }

  currentCateId.value = id
  nextTick(() => {
    cateScrollTop.value = goods.value.find((item) => item.id == id).top
  })
}
const handleGoodsScroll = ({ detail }) => {
  // 商品列表滚动事件
  if (!sizeCalcState.value) {
    calcSize()
  }
  const { scrollTop } = detail
  let tabs = goods.value.filter((item) => item.top <= scrollTop).reverse()
  if (tabs.length > 0) {
    currentCateId.value = tabs[0].id
  }
}
const calcSize = async () => {
  // 计算尺寸
  sizeCalcState.value = true
  let h = 10

  const adsView = await nextTick(() => uni.createSelectorQuery().select('#ads'))
  const adsData = await nextTick(() => adsView.fields({ size: true }))
  h += Math.floor(adsData.height)

  for (const item of goods.value) {
    const cateView = await nextTick(() =>
      uni.createSelectorQuery().select(`#cate-${item.id}`)
    )
    const cateData = await nextTick(() => cateView.fields({ size: true }))
    item.top = h
    h += cateData.height
    item.bottom = h
  }

  sizeCalcState.value = false
}

const handleAddToCart = (cate_id: number, good: Dish, num: number) => {
  // console.log(good)
  //取出商品的属性
  let flavors: any[] = []
  good.flavors!.forEach(({ default_value, value }) => {
    value.forEach((v, index) => {
      if (index == default_value) {
        flavors.push(v)
      }
    })
  })
  // 添加到购物车
  const index = cart.value.findIndex((item) => {
    if (good.use_property) {
      //判断是否有重复商品
      return (
        item.id === good.id && item.dish_flavor.join(',') === flavors.join(',')
      )
    } else {
      return item.id === good.id
    }
  })

  //发送请求后再添加到购物车
  if (index > -1) {
    cart.value[index].number += num
  } else {
    cart.value.push({
      id: 0,
      cate_id: cate_id,
      name: good.name,
      image: good.image,
      user_id: useUserStore().id!,
      dish_id: good.id,
      setmeal_id: 0,
      dish_flavor: flavors,
      number: num,
      amount: good.price
    })
  }
}

const handleReduceFromCart = (good) => {
  const index = cart.value.findIndex((cartItem) => cartItem.id === good.id)
  cart.value[index].number -= 1
  if (cart.value[index].number <= 0) {
    cart.value.splice(index, 1)
  }
  uni.setStorageSync('cart', cart.value)
}

const showGoodDetailModal = (item: Dish) => {
  good.value = item
  goodDetailModalVisible.value = true
}

const closeGoodDetailModal = () => {
  //关闭商品详情模态框
  good.value = undefined
  goodDetailModalVisible.value = false
}

const changePropertyDefault = (index: number, key: number) => {
  console.log(index, key)
  //改变默认属性值
  if (good.value && good.value.flavors) {
    good.value.flavors[index].default_value = key
  }
}

const getGoodSelectedProps = (good: Dish) => {
  //计算当前商品所选属性
  if (!good) return
  if (good.use_property) {
    let flavors: any[] = []
    good.flavors!.forEach(({ default_value, value }) => {
      value.forEach((v, index) => {
        if (index == default_value) {
          flavors.push(v)
        }
      })
    })
    return flavors.join(',')
  }
  return ''
}

const handlePropertyAdd = () => {
  good.value!.number += 1
}

const handlePropertyReduce = () => {
  if (good.value!.number === 1) return
  good.value!.number -= 1
}

const handleAddToCartInModal = () => {
  handleAddToCart(currentCateId.value, good.value!, good.value!.number)
  closeGoodDetailModal()
}

const openCartPopup = () => {
  // 打开购物车列表popup
  cartPopupVisible.value = true
}

const closeCartPopup = () => {
  // 关闭购物车列表popup
  cartPopupVisible.value = false
}

const handleCartClear = () => {
  // 清空购物车
  closeCartPopup()
  uni.showModal({
    title: '提示',
    content: '确定清空购物车么',
    success: ({ confirm }) => {
      if (confirm) {
        cartPopupVisible.value = false
        cart.value = []
      }
    },
    fail: () => {
      openCartPopup()
    }
  })
}

const handleCartItemAdd = (index) => {
  cart.value[index].number += 1
}

const handleCartItemReduce = (index) => {
  if (cart.value[index].number === 1) {
    cart.value.splice(index, 1)
  } else {
    cart.value[index].number -= 1
  }
  if (!cart.value.length) {
    cartPopupVisible.value = false
  }
}

const toPay = () => {
  closeCartPopup()
  uni.showModal({
    title: '假装付款',
    content: '确定v我' + getCartGoodsPrice.value + '元',
    success: ({ confirm }) => {
      if (confirm) {
        cartPopupVisible.value = false
        cart.value = []
      }
    },
    fail: () => {
      openCartPopup()
    }
  })
}
</script>

<style lang="scss" scoped>
@import '~@/pages/index/index.scss';
</style>
