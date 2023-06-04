<template>
  <view class="container" v-if="!loading">
    <view class="main" v-if="goods.length">
      <view class="nav">
        <view class="header">
          <view class="left" v-if="orderType == 'takein'">
            <view class="store-name">
              <!-- <text>{{ store.name }}</text> -->
              <text>芝士雪豹</text>
              <view class="iconfont iconarrow-right"></view>
            </view>
            <view class="store-location">
              <image
                src="/static/images/order/location.png"
                style="width: 30rpx; height: 30rpx"
                class="mr-10"
              ></image>
              <!-- <text>距离您 {{ store.distance_text }}</text> -->
              <text>距离您 114514</text>
            </view>
          </view>
          <view class="left overflow-hidden" v-else>
            <view class="d-flex align-items-center overflow-hidden">
              <image
                src="/static/images/order/location.png"
                style="width: 30rpx; height: 30rpx"
                class="mr-10"
              ></image>
              <view
                class="font-size-extra-lg text-color-base font-weight-bold text-truncate"
              >
                <!-- {{ address.street }} -->
                理塘大街
              </view>
            </view>
            <view
              class="font-size-sm text-color-assist overflow-hidden text-truncate"
            >
              由
              <!-- <text class="text-color-base" style="margin: 0 10rpx">{{
                store.name
              }}</text -->
              <text class="text-color-base" style="margin: 0 10rpx">
                理塘丁真
              </text>
              配送
            </view>
          </view>
          <view class="right">
            <view
              class="dinein"
              :class="{ active: orderType == 'takein' }"
              @tap="changeOrderType"
            >
              <text>自取</text>
            </view>
            <view
              class="takeout"
              :class="{ active: orderType == 'takeout' }"
              @tap="changeOrderType"
            >
              <text>外卖</text>
            </view>
          </view>
        </view>
        <view class="coupon">
          <text class="title">"霸气mini卡"超级购券活动，赶紧去购买</text>
          <view class="iconfont iconarrow-right"></view>
        </view>
      </view>
      <view class="content">
        <scroll-view
          class="menus"
          :scroll-into-view="menuScrollIntoView"
          scroll-with-animation
          scroll-y
        >
          <view class="wrapper">
            <view
              class="menu"
              :id="`menu-${item.id}`"
              :class="{ current: item.id === currentCateId }"
              v-for="(item, index) in goods"
              :key="index"
              @tap="handleMenuTap(item.id)"
            >
              <text>{{ item.name }}</text>
              <view class="dot" v-show="menuCartNum(item.id)">{{
                menuCartNum(item.id)
              }}</view>
            </view>
          </view>
        </scroll-view>
        <!-- goods list begin -->
        <scroll-view
          class="goods"
          scroll-with-animation
          scroll-y
          :scroll-top="cateScrollTop"
          @scroll="handleGoodsScroll"
        >
          <view class="wrapper">
            <swiper
              class="ads"
              id="ads"
              autoplay
              :interval="3000"
              indicator-dots
            >
              <swiper-item v-for="(item, index) in ads" :key="index">
                <image :src="item.image"></image>
              </swiper-item>
            </swiper>
            <view class="list">
              <!-- category begin -->
              <view
                class="category"
                v-for="(item, index) in goods"
                :key="index"
                :id="`cate-${item.id}`"
              >
                <view class="title">
                  <text>{{ item.name }}</text>
                  <image :src="item.icon" class="icon"></image>
                </view>
                <view class="items">
                  <!-- 商品 begin -->
                  <view
                    class="good"
                    v-for="(good, key) in item.goods_list"
                    :key="key"
                  >
                    <image
                      :src="good.images"
                      class="image"
                      @tap="showGoodDetailModal(item, good)"
                    ></image>
                    <view class="right">
                      <text class="name">{{ good.name }}</text>
                      <text class="tips">{{ good.content }}</text>
                      <view class="price_and_action">
                        <text class="price">￥{{ good.price }}</text>
                        <view class="btn-group" v-if="good.use_property">
                          <button
                            type="primary"
                            class="btn property_btn"
                            hover-class="none"
                            size="mini"
                            @tap="showGoodDetailModal(item, good)"
                          >
                            选规格
                          </button>
                          <view class="dot" v-show="goodCartNum(good.id)">{{
                            goodCartNum(good.id)
                          }}</view>
                        </view>
                        <view class="btn-group" v-else>
                          <button
                            type="default"
                            v-show="goodCartNum(good.id)"
                            plain
                            class="btn reduce_btn"
                            size="mini"
                            hover-class="none"
                            @tap="handleReduceFromCart(item, good)"
                          >
                            <view class="iconfont iconsami-select"></view>
                          </button>
                          <view class="number" v-show="goodCartNum(good.id)">{{
                            goodCartNum(good.id)
                          }}</view>
                          <button
                            type="primary"
                            class="btn add_btn"
                            size="min"
                            hover-class="none"
                            @tap="handleAddToCart(item, good, 1)"
                          >
                            <view class="iconfont iconadd-select"></view>
                          </button>
                        </view>
                      </view>
                    </view>
                  </view>
                  <!-- 商品 end -->
                </view>
              </view>
              <!-- category end -->
            </view>
          </view>
        </scroll-view>
        <!-- goods list end -->
      </view>
      <!-- content end -->
      <!-- 购物车栏 begin -->
      <view class="cart-box" v-if="cart.length > 0">
        <view class="mark">
          <image
            src="/static/images/menu/cart.png"
            class="cart-img"
            @tap="openCartPopup"
          ></image>
          <view class="tag">{{ getCartGoodsNumber }}</view>
        </view>
        <view class="price">￥{{ getCartGoodsPrice }}</view>
        <button
          type="primary"
          class="pay-btn"
          @tap="toPay"
          :disabled="disabledPay"
        >
          {{ disabledPay ? `差${spread}元起送` : '去结算' }}
        </button>
      </view>
      <!-- 购物车栏 end -->
    </view>
    <!-- 商品详情模态框 begin -->
    <modal
      :show="goodDetailModalVisible"
      class="good-detail-modal"
      color="#5A5B5C"
      width="90%"
      custom
      padding="0rpx"
      radius="12rpx"
    >
      <view class="cover">
        <image v-if="good.images" :src="good.images" class="image"></image>
        <view class="btn-group">
          <image src="/static/images/menu/share-good.png"></image>
          <image
            src="/static/images/menu/close.png"
            @tap="closeGoodDetailModal"
          ></image>
        </view>
      </view>
      <scroll-view class="detail" scroll-y>
        <view class="wrapper">
          <view class="basic">
            <view class="name">{{ good.name }}</view>
            <view class="tips">{{ good.content }}</view>
          </view>
          <view class="properties" v-if="good.use_property">
            <view
              class="property"
              v-for="(item, index) in good.property"
              :key="index"
            >
              <view class="title">
                <text class="name">{{ item.name }}</text>
                <view class="desc" v-if="item.desc">({{ item.desc }})</view>
              </view>
              <view class="values">
                <view
                  class="value"
                  v-for="(value, key) in item.values"
                  :key="key"
                  :class="{ default: value.is_default }"
                  @tap="changePropertyDefault(index, key)"
                >
                  {{ value.value }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="action">
        <view class="left">
          <view class="price">￥{{ good.price }}</view>
          <view class="props" v-if="getGoodSelectedProps(good)">
            {{ getGoodSelectedProps(good) }}
          </view>
        </view>
        <view class="btn-group">
          <button
            type="default"
            plain
            class="btn"
            size="mini"
            hover-class="none"
            @tap="handlePropertyReduce"
          >
            <view class="iconfont iconsami-select"></view>
          </button>
          <view class="number">{{ good.number }}</view>
          <button
            type="primary"
            class="btn"
            size="min"
            hover-class="none"
            @tap="handlePropertyAdd"
          >
            <view class="iconfont iconadd-select"></view>
          </button>
        </view>
      </view>
      <view class="add-to-cart-btn" @tap="handleAddToCartInModal">
        <view>加入购物车</view>
      </view>
    </modal>
    <!-- 商品详情模态框 end -->
    <!-- 购物车详情popup -->
    <popup-layer
      direction="top"
      :show-pop="cartPopupVisible"
      class="cart-popup"
    >
      <template slot="content">
        <view class="top">
          <text @tap="handleCartClear">清空</text>
        </view>
        <scroll-view class="cart-list" scroll-y>
          <view class="wrapper">
            <view class="item" v-for="(item, index) in cart" :key="index">
              <view class="left">
                <view class="name">{{ item.name }}</view>
                <view class="props">{{ item.props_text }}</view>
              </view>
              <view class="center">
                <text>￥{{ item.price }}</text>
              </view>
              <view class="right">
                <button
                  type="default"
                  plain
                  size="mini"
                  class="btn"
                  hover-class="none"
                  @tap="handleCartItemReduce(index)"
                >
                  <view class="iconfont iconsami-select"></view>
                </button>
                <view class="number">{{ item.number }}</view>
                <button
                  type="primary"
                  class="btn"
                  size="min"
                  hover-class="none"
                  @tap="handleCartItemAdd(index)"
                >
                  <view class="iconfont iconadd-select"></view>
                </button>
              </view>
            </view>
            <view
              class="item"
              v-if="orderType == 'takeout' && store.packing_fee"
            >
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
                <button
                  type="primary"
                  class="btn"
                  size="min"
                  hover-class="none"
                >
                  <view class="iconfont iconadd-select"></view>
                </button>
              </view>
            </view>
          </view>
        </scroll-view>
      </template>
    </popup-layer>
    <!-- 购物车详情popup -->
  </view>
  <view class="loading" v-else>
    <image src="/static/images/loading.gif"></image>
  </view>
</template>

<script setup lang="ts">
import modal from '@/components/modal.vue'
import popupLayer from '@/components/popup-layer.vue'
import { onLoad } from '@dcloudio/uni-app'
import { computed, reactive, ref } from 'vue'

// import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

onLoad(async (query: any) => {
  await init()
})

//类型

// interface

const ads = reactive([
  {
    image:
      'https://img-shop.qmimg.cn/s23107/2020/04/27/4ebdb582a5185358c4.jpg?imageView2/2/w/600/h/600'
  },
  {
    image:
      'https://images.qmai.cn/s23107/2020/05/08/c25de6ef72d2890630.png?imageView2/2/w/600/h/600'
  },
  {
    image:
      'https://img-shop.qmimg.cn/s23107/2020/04/10/add546c1b1561f880d.jpg?imageView2/2/w/600/h/600'
  },
  {
    image:
      'https://images.qmai.cn/s23107/2020/04/30/b3af19e0de8ed42f61.jpg?imageView2/2/w/600/h/600'
  },
  {
    image:
      'https://img-shop.qmimg.cn/s23107/2020/04/17/8aeb78516d63864420.jpg?imageView2/2/w/600/h/600'
  }
]) // 广告列表
const goods = ref([]) // 所有商品
const loading = ref(true)
const currentCateId = ref(6905) // 默认分类
const cateScrollTop = ref(0)
const menuScrollIntoView = ref('')
const cart = ref([]) // 购物车
const goodDetailModalVisible = ref(false) // 是否饮品详情模态框
const good = ref({}) // 当前商品
const category = ref({}) // 当前商品所在分类
const cartPopupVisible = ref(false)
const sizeCalcState = ref(false)
const orderType = ref('takeout') //点餐类型
const address = ref({}) //收货地址
const store = ref({}) //店铺信息

//计算属性
const goodCartNum = computed((id) => {
  return cart.value.reduce((acc, cur) => {
    if (cur.id === id) {
      return (acc += cur.number)
    }
    return acc
  }, 0)
})

const menuCartNum = computed<number>((id) =>
  cart.value.reduce((acc, cur) => {
    if (cur.cate_id === id) {
      return (acc += cur.number)
    }
    return acc
  }, 0)
)
const getCartGoodsNumber = computed(() => {
  //计算购物车总数
  return cart.value.reduce((acc, cur) => acc + cur.number, 0)
})

const getCartGoodsPrice = computed(() => {
  //计算购物车总价
  return cart.value.reduce((acc, cur) => acc + cur.number * cur.price, 0)
})
const disabledPay = computed(() => {
  //是否达到起送价
  return orderType.value == 'takeout' &&
    getCartGoodsPrice.value < store.min_price
    ? true
    : false
})
const spread = computed(() => {
  //差多少元起送
  if (orderType.value != 'takeout') return
  return parseFloat((store.min_price - getCartGoodsPrice.value).toFixed(2))
})

//方法

// methods: {
//   ...mapMutations(['SET_ORDER_TYPE']),
//   ...mapActions(['getStore']),

const init = async () => {
  //页面初始化
  loading.value = true
  // await getStore()
  // goods.value = await $api('goods')
  loading.value = false
  cart.value = uni.getStorageSync('cart') || []
}

const changeOrderType = () => {
  //改变点餐类型
  orderType.value = orderType.value == 'takeout' ? 'takein' : 'takeout'
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
const handleAddToCart = (cate, good, num) => {
  // 添加到购物车
  const index = cart.value.findIndex((item) => {
    if (good.use_property) {
      return item.id === good.id && item.props_text === good.props_text
    } else {
      return item.id === good.id
    }
  })
  if (index > -1) {
    cart.value[index].number += num
  } else {
    cart.value.push({
      id: good.id,
      cate_id: cate.id,
      name: good.name,
      price: good.price,
      number: num,
      image: good.images,
      use_property: good.use_property,
      props_text: good.props_text,
      props: good.props
    })
  }
  uni.setStorageSync('cart', cart.value)
}
const handleReduceFromCart = (item, good) => {
  const index = cart.value.findIndex((cartItem) => cartItem.id === good.id)
  cart.value[index].number -= 1
  if (cart.value[index].number <= 0) {
    cart.value.splice(index, 1)
  }
  uni.setStorageSync('cart', cart.value)
}
const showGoodDetailModal = (item, good) => {
  good.value = JSON.parse(JSON.stringify({ ...good.value, number: 1 }))
  category.value = JSON.parse(JSON.stringify(item))
  goodDetailModalVisible.value = true
}
const closeGoodDetailModal = () => {
  //关闭饮品详情模态框
  goodDetailModalVisible.value = false
  category.value = {}
  good.value = {}
}
const changePropertyDefault = (index, key) => {
  //改变默认属性值
  good.value.property[index].values.forEach((value) =>
    this.$set(value, 'is_default', 0)
  )
  good.value.property[index].values[key].is_default = 1
  good.value.number = 1
}
const getGoodSelectedProps = (good, type = 'text') => {
  //计算当前饮品所选属性
  if (good.value.use_property) {
    let props = []
    good.value.property.forEach(({ values }) => {
      values.forEach((value) => {
        if (value.is_default) {
          props.push(type === 'text' ? value.value : value.id)
        }
      })
    })
    return type === 'text' ? props.join(',') : props
  }
  return ''
}
</script>

<style lang="scss" scoped>
// /* #ifdef H5 */
// page {
//   min-height: 100%;
// }
// /* #endif */

// .container {
//   overflow: hidden;
//   position: relative;
// }

// .loading {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   image {
//     width: 260rpx;
//     height: 260rpx;
//     position: relative;
//     margin-top: -200rpx;
//     /* #ifdef h5 */
//     margin-top: 0;
//     /* #endif */
//   }
// }

// .stores {
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   margin-bottom: -40rpx;
//   .store {
//     width: 100%;
//     background-color: $bg-color-grey;
//     padding: 20rpx;
//     display: flex;
//     align-items: center;
//     margin-bottom: 20rpx;
//     border-radius: 6rpx;

//     .iconfont {
//       font-size: 50rpx;
//       margin-right: 15rpx;

//       &.iconradio-button-off {
//         color: $text-color-assist;
//       }

//       &.iconradio-button-on {
//         color: $color-primary;
//       }
//     }

//     .infos {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       color: $text-color-base;
//       overflow: hidden;

//       .name_and_distance {
//         width: 100%;
//         display: flex;
//         justify-content: space-between;
//         margin-bottom: 10rpx;
//         overflow: hidden;

//         .name {
//           flex: 1;
//           flex-shrink: 0;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//           font-size: $font-size-lg;
//         }

//         .distance {
//           flex-shrink: 0;
//           font-size: $font-size-lg;
//           font-weight: bold;
//           margin-left: 20rpx;
//         }
//       }

//       .street {
//         color: $text-color-assist;
//         font-size: $font-size-sm;
//       }
//     }
//   }
// }

// .main {
//   width: 100%;
//   height: 100%;
//   position: relative;
//   display: flex;
//   flex-direction: column;
// }

// .nav {
//   width: 100%;
//   height: 212rpx;
//   flex-shrink: 0;
//   display: flex;
//   flex-direction: column;

//   .header {
//     width: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 20rpx;
//     background-color: #ffffff;
//     height: 140rpx;

//     .left {
//       flex: 1;
//       display: flex;
//       flex-direction: column;

//       .store-name {
//         display: flex;
//         justify-content: flex-start;
//         align-items: center;
//         font-size: $font-size-lg;
//         margin-bottom: 10rpx;

//         .iconfont {
//           margin-left: 10rpx;
//           line-height: 100%;
//         }
//       }

//       .store-location {
//         display: flex;
//         justify-content: flex-start;
//         align-items: center;
//         color: $text-color-assist;
//         font-size: $font-size-sm;

//         .iconfont {
//           vertical-align: middle;
//           display: table-cell;
//           color: $color-primary;
//           line-height: 100%;
//         }
//       }
//     }

//     .right {
//       background-color: $bg-color-grey;
//       border-radius: 38rpx;
//       display: flex;
//       align-items: center;
//       font-size: $font-size-sm;
//       padding: 0 38rpx;
//       color: $text-color-assist;

//       .dinein,
//       .takeout {
//         position: relative;
//         display: flex;
//         align-items: center;
//         &.active {
//           padding: 14rpx 38rpx;
//           color: #ffffff;
//           background-color: $color-primary;
//           border-radius: 38rpx;
//         }
//       }

//       .takeout {
//         margin-left: 20rpx;
//         height: 100%;
//         flex: 1;
//         padding: 14rpx 0;
//       }

//       .dinein.active {
//         margin-left: -38rpx;
//       }

//       .takeout.active {
//         margin-right: -38rpx;
//       }
//     }
//   }

//   .coupon {
//     flex: 1;
//     width: 100%;
//     background-color: $bg-color-primary;
//     font-size: $font-size-base;
//     color: $color-primary;
//     padding: 0 20rpx;
//     display: flex;
//     align-items: center;
//     overflow: hidden;

//     .title {
//       flex: 1;
//       margin-left: 10rpx;
//       overflow: hidden;
//       white-space: nowrap;
//       text-overflow: ellipsis;
//     }

//     .iconfont {
//       line-height: 100%;
//     }
//   }
// }

// .content {
//   flex: 1;
//   overflow: hidden;
//   width: 100%;
//   display: flex;

//   .menus {
//     width: 200rpx;
//     height: 100%;
//     overflow: hidden;
//     background-color: $bg-color-grey;

//     .wrapper {
//       width: 100%;
//       height: 100%;

//       .menu {
//         display: flex;
//         align-items: center;
//         justify-content: flex-start;
//         padding: 30rpx 20rpx;
//         font-size: 26rpx;
//         color: $text-color-assist;
//         position: relative;

//         &:nth-last-child(1) {
//           margin-bottom: 130rpx;
//         }

//         &.current {
//           background-color: #ffffff;
//           color: $text-color-base;
//         }

//         .dot {
//           position: absolute;
//           width: 34rpx;
//           height: 34rpx;
//           line-height: 34rpx;
//           font-size: 22rpx;
//           background-color: $color-primary;
//           color: #ffffff;
//           top: 16rpx;
//           right: 10rpx;
//           border-radius: 100%;
//           text-align: center;
//         }
//       }
//     }
//   }

//   .goods {
//     flex: 1;
//     height: 100%;
//     overflow: hidden;
//     background-color: #ffffff;

//     .wrapper {
//       width: 100%;
//       height: 100%;
//       padding: 20rpx;

//       .ads {
//         height: calc(300 / 550 * 510rpx);

//         image {
//           width: 100%;
//           height: 100%;
//           border-radius: 8rpx;
//         }
//       }

//       .list {
//         width: 100%;
//         font-size: $font-size-base;
//         padding-bottom: 130rpx;

//         .category {
//           width: 100%;

//           .title {
//             padding: 30rpx 0;
//             display: flex;
//             align-items: center;
//             color: $text-color-base;

//             .icon {
//               width: 38rpx;
//               height: 38rpx;
//               margin-left: 10rpx;
//             }
//           }
//         }

//         .items {
//           display: flex;
//           flex-direction: column;
//           padding-bottom: -30rpx;

//           .good {
//             display: flex;
//             align-items: center;
//             margin-bottom: 30rpx;

//             .image {
//               width: 160rpx;
//               height: 160rpx;
//               margin-right: 20rpx;
//               border-radius: 8rpx;
//             }

//             .right {
//               flex: 1;
//               height: 160rpx;
//               overflow: hidden;
//               display: flex;
//               flex-direction: column;
//               align-items: flex-start;
//               justify-content: space-between;
//               padding-right: 14rpx;

//               .name {
//                 font-size: $font-size-base;
//                 margin-bottom: 10rpx;
//               }

//               .tips {
//                 width: 100%;
//                 height: 40rpx;
//                 line-height: 40rpx;
//                 overflow: hidden;
//                 text-overflow: ellipsis;
//                 white-space: nowrap;
//                 font-size: $font-size-sm;
//                 color: $text-color-assist;
//                 margin-bottom: 10rpx;
//               }

//               .price_and_action {
//                 width: 100%;
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: center;

//                 .price {
//                   font-size: $font-size-base;
//                   font-weight: 600;
//                 }

//                 .btn-group {
//                   display: flex;
//                   justify-content: space-between;
//                   align-items: center;
//                   position: relative;

//                   .btn {
//                     padding: 0 20rpx;
//                     box-sizing: border-box;
//                     font-size: $font-size-sm;
//                     height: 44rpx;
//                     line-height: 44rpx;

//                     &.property_btn {
//                       border-radius: 24rpx;
//                     }

//                     &.add_btn,
//                     &.reduce_btn {
//                       padding: 0;
//                       width: 44rpx;
//                       border-radius: 44rpx;
//                     }
//                   }

//                   .dot {
//                     position: absolute;
//                     background-color: #ffffff;
//                     border: 1px solid $color-primary;
//                     color: $color-primary;
//                     font-size: $font-size-sm;
//                     width: 36rpx;
//                     height: 36rpx;
//                     line-height: 36rpx;
//                     text-align: center;
//                     border-radius: 100%;
//                     right: -12rpx;
//                     top: -10rpx;
//                   }

//                   .number {
//                     width: 44rpx;
//                     height: 44rpx;
//                     line-height: 44rpx;
//                     text-align: center;
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }

// .modal-box {
//   max-height: 90vh;
// }

// .good-detail-modal {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;

//   .cover {
//     height: 320rpx;
//     padding: 30rpx 0;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     position: relative;

//     .image {
//       width: 260rpx;
//       height: 260rpx;
//     }

//     .btn-group {
//       position: absolute;
//       right: 10rpx;
//       top: 30rpx;
//       display: flex;
//       align-items: center;
//       justify-content: space-around;

//       image {
//         width: 80rpx;
//         height: 80rpx;
//       }
//     }
//   }

//   .detail {
//     width: 100%;
//     min-height: 1vh;
//     max-height: calc(90vh - 320rpx - 80rpx - 120rpx);

//     .wrapper {
//       width: 100%;
//       height: 100%;
//       overflow: hidden;

//       .basic {
//         padding: 0 20rpx 30rpx;
//         display: flex;
//         flex-direction: column;
//         .name {
//           font-size: $font-size-base;
//           color: $text-color-base;
//           margin-bottom: 10rpx;
//         }
//         .tips {
//           font-size: $font-size-sm;
//           color: $text-color-grey;
//         }
//       }

//       .properties {
//         width: 100%;
//         border-top: 2rpx solid $bg-color-grey;
//         padding: 10rpx 30rpx 0;
//         display: flex;
//         flex-direction: column;

//         .property {
//           width: 100%;
//           display: flex;
//           flex-direction: column;
//           margin-bottom: 30rpx;
//           padding-bottom: -16rpx;

//           .title {
//             width: 100%;
//             display: flex;
//             justify-content: flex-start;
//             align-items: center;
//             margin-bottom: 20rpx;

//             .name {
//               font-size: 26rpx;
//               color: $text-color-base;
//               margin-right: 20rpx;
//             }

//             .desc {
//               flex: 1;
//               font-size: $font-size-sm;
//               color: $color-primary;
//               overflow: hidden;
//               text-overflow: ellipsis;
//               white-space: nowrap;
//             }
//           }

//           .values {
//             width: 100%;
//             display: flex;
//             flex-wrap: wrap;

//             .value {
//               border-radius: 8rpx;
//               background-color: $bg-color-grey;
//               padding: 16rpx 30rpx;
//               font-size: 26rpx;
//               color: $text-color-assist;
//               margin-right: 16rpx;
//               margin-bottom: 16rpx;

//               &.default {
//                 background-color: $color-primary;
//                 color: $text-color-white;
//               }
//             }
//           }
//         }
//       }
//     }
//   }

//   .action {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     background-color: $bg-color-grey;
//     height: 120rpx;
//     padding: 0 26rpx;

//     .left {
//       flex: 1;
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       margin-right: 20rpx;
//       overflow: hidden;

//       .price {
//         font-size: $font-size-lg;
//         color: $text-color-base;
//       }

//       .props {
//         color: $text-color-assist;
//         font-size: 24rpx;
//         width: 100%;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         white-space: nowrap;
//       }
//     }
//     .btn-group {
//       display: flex;
//       align-items: center;
//       justify-content: space-around;

//       .number {
//         font-size: $font-size-base;
//         width: 44rpx;
//         height: 44rpx;
//         line-height: 44rpx;
//         text-align: center;
//       }

//       .btn {
//         padding: 0;
//         font-size: $font-size-base;
//         width: 44rpx;
//         height: 44rpx;
//         line-height: 44rpx;
//         border-radius: 100%;
//       }
//     }
//   }

//   .add-to-cart-btn {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     background-color: $color-primary;
//     color: $text-color-white;
//     font-size: $font-size-base;
//     height: 80rpx;
//     border-radius: 0 0 12rpx 12rpx;
//   }
// }

// .cart-box {
//   position: absolute;
//   bottom: 30rpx;
//   left: 30rpx;
//   right: 30rpx;
//   height: 96rpx;
//   border-radius: 48rpx;
//   box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.2);
//   background-color: #ffffff;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   z-index: 9999;

//   .cart-img {
//     width: 96rpx;
//     height: 96rpx;
//     position: relative;
//     margin-top: -48rpx;
//   }

//   .pay-btn {
//     height: 100%;
//     padding: 0 30rpx;
//     color: #ffffff;
//     border-radius: 0 50rpx 50rpx 0;
//     display: flex;
//     align-items: center;
//     font-size: $font-size-base;
//   }

//   .mark {
//     padding-left: 46rpx;
//     margin-right: 30rpx;
//     position: relative;

//     .tag {
//       background-color: $color-warning;
//       color: $text-color-white;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       font-size: $font-size-sm;
//       position: absolute;
//       right: -10rpx;
//       top: -50rpx;
//       border-radius: 100%;
//       padding: 4rpx;
//       width: 40rpx;
//       height: 40rpx;
//       opacity: 0.9;
//     }
//   }

//   .price {
//     flex: 1;
//     color: $text-color-base;
//   }
// }

// .cart-popup {
//   .top {
//     background-color: $bg-color-primary;
//     color: $color-primary;
//     padding: 10rpx 30rpx;
//     font-size: 24rpx;
//     text-align: right;
//   }
//   .cart-list {
//     background-color: #ffffff;
//     width: 100%;
//     overflow: hidden;
//     min-height: 1vh;
//     max-height: 60vh;

//     .wrapper {
//       height: 100%;
//       display: flex;
//       flex-direction: column;
//       padding: 0 30rpx;
//       margin-bottom: 156rpx;

//       .item {
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         padding: 30rpx 0;
//         position: relative;

//         &::after {
//           content: ' ';
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           width: 100%;
//           background-color: $border-color;
//           height: 2rpx;
//           transform: scaleY(0.6);
//         }

//         .left {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//           margin-right: 30rpx;

//           .name {
//             font-size: $font-size-sm;
//             color: $text-color-base;
//           }
//           .props {
//             color: $text-color-assist;
//             font-size: 24rpx;
//             overflow: hidden;
//             text-overflow: ellipsis;
//             white-space: nowrap;
//           }
//         }

//         .center {
//           margin-right: 120rpx;
//           font-size: $font-size-base;
//         }

//         .right {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;

//           .btn {
//             width: 46rpx;
//             height: 46rpx;
//             border-radius: 100%;
//             padding: 0;
//             text-align: center;
//             line-height: 46rpx;
//           }

//           .number {
//             font-size: $font-size-base;
//             width: 46rpx;
//             height: 46rpx;
//             text-align: center;
//             line-height: 46rpx;
//           }
//         }
//       }
//     }
//   }
// }
</style>
