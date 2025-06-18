<template>
  <div v-if="errors.length" class="card-error mt-4">
    <p class="card-error-title">Найдены ошибки заполнения формы:</p>
    <ul class="card-error-list">
      <li v-if="errors.length > 1" v-for="(err, index) in errors" :key="index">{{ err }}</li>
      <li v-else>{{ errors[0] }}</li>
    </ul>
  </div>
</template>

<script setup>
defineProps(["errors"])
</script>

<style scoped lang="scss"></style>
