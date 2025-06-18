<template>
  <v-btn :style="{'text-transform': uppercase ? 'uppercase' : 'initial'}"  color="primary" variant="outlined">
    <slot></slot>
  </v-btn>
</template>

<script setup>
defineProps(["uppercase"])
</script>