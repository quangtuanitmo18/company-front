<template>
  <v-text-field
      variant="underlined"
      v-model="model"
      :rules="[
                v =>  !!v || 'Это обязательное поле.',
                v => /.+@.+\..+/.test(v) || 'Email не правильный.',
                v => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || 'Допускаются только латинские буквы, цифры, нижнее подчёркивание и точка.',
              ]"
      label="Email"
  ></v-text-field>
</template>
<script setup>
const model = defineModel()
</script>