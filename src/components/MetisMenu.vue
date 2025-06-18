<template>
  <ul class="metismenu-list">
    <metis-menu-item v-for="(item, index) in content" :key="index" :item="item"></metis-menu-item>
  </ul>
</template>

<script setup>
const { content } = defineProps(["content"])
import MetisMenuItem from "@/components/MetisMenuItem.vue";
</script>
