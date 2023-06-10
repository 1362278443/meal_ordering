<template>
  <u-button shape="circle" class="custom-style">
    <slot />
  </u-button>
</template>
<script setup lang="ts"></script>
<style lang="scss">
.custom-style {
  width: 50rpx;
  height: 50rpx;
  margin: 0rpx 16rpx;
  border-radius: 50%;
}
</style>
