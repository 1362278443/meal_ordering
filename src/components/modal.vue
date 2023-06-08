<template>
  <u-modal content="content" close-on-click-overlay>
    <slot />
  </u-modal>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
defineEmits(['close'])
</script>

<style lang="scss"></style>
