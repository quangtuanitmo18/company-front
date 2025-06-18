<template>
  <div class="avatar">
    <div class="avatar-head">
      <img alt="Avatar" :src="avatar ? avatar : defaultUser">
    </div>
  </div>
</template>
<script setup>
import defaultUser from "@/assets/images/user_default-avatar.jpg"
defineProps(["avatar"])
</script>
<style scoped lang="scss">
.avatar{
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  &:hover .avatar-layout{
    opacity: 1;
  }
}
.avatar-head{
  max-width: 240px;
  display: flex;
}
</style>