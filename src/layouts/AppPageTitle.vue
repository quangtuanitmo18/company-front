<template>
  <div class="app-page-title">
    <div class="page-title" :class="{'page-title-separate': separate}">
      <div class="page-title-icon">
        <v-icon class="color-primary" size="x-large" :icon="iconClassname"></v-icon>
      </div>
      <div class="w-100">
        <p v-if="title" class="page-title-title">{{ title }}</p>
        <p v-if="subtitle" class="page-title-subtitle">{{ subtitle }}</p>
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(["iconClassname", "title", "subtitle", "separate"])
</script>

<style scoped lang="scss">
.app-page-title{
  background-color: white;
  padding: 20px;
  margin: -20px -20px 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.page-title{
  display: flex;
  align-items: center;

  &-icon{
    padding: 8px;
    margin-right: 16px;
    background-color: #fff;
    box-shadow: 0 0.46875rem 2.1875rem rgba(8, 10, 37, 0.03), 0 0.9375rem 1.40625rem rgba(8, 10, 37, 0.03), 0 0.25rem 0.53125rem rgba(8, 10, 37, 0.05), 0 0.125rem 0.1875rem rgba(8, 10, 37, 0.03);
    border-radius: 4px;
  }

  &-title{
    font-size: 18px;
    color: var(--text-main);
  }

  &-subtitle{
    padding-top: 2px;
    font-size: 14px;
    color: var(--text-secondary);
  }
  .text-deep-purple-accent-4{
    color: var(--color-primary);
  }
}
.page-title-separate{
  width: 100%;
  padding: 0 20px;
  margin-right: auto;
  margin-left: auto;

  @media (min-width: 960px) {
    max-width: 900px;
  }
  @media (min-width: 1280px) {
    max-width: 1200px;
  }
  @media (min-width: 1680px) {
    max-width: 1400px;
  }
}
</style>