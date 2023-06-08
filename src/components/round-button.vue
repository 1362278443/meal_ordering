<template>
  <u-button shape="circle" class="custom-style">
    <slot />
  </u-button>
</template>
<script setup lang="ts"></script>
<style lang="scss">
.custom-style {
  width: 46rpx;
  height: 46rpx;
  margin: 0rpx 8rpx;
  border-radius: 50%;
}
</style>
