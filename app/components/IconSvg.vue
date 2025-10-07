<template>
  <Icon :name="name" class="icon-element"></Icon>
</template>
<script lang="ts" setup>
defineProps<{
  name: string;
}>();

</script>
<style>
.icon-element path {
  fill: currentColor !important;
}
</style>