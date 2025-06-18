<template>
  <div>
    <v-snackbar
        v-model="model"
        :color="color"
        variant="elevated"
    >
      {{ message }}

      <template v-slot:actions>
        <v-btn size="small" variant="elevated" :color=color density="compact" icon="mdi-close" @click="model = false"></v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
  const {color, message} = defineProps(["color", "message"])
  const model = defineModel();

</script>

<style scoped lang="scss">

</style>