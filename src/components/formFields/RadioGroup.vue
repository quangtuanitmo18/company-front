<template>
  <v-radio-group v-model="model">
    <v-radio v-for="(item, id) in items" :key="id" :label="item.title" :value="item.value" />
  </v-radio-group>
</template>

<script setup>
  const props = defineProps(["items"])
  const model = defineModel();

</script>

<style scoped lang="scss">

</style>