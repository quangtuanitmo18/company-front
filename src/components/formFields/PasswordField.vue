<template>
  <v-text-field
      variant="underlined"
      v-model="model"
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      :rules="[
          v =>  !!v || 'Это обязательное поле.',
          v => !/\s/.test(v) || 'Пробел не допускается.',
          v => v.length >= 8 || 'Пароль не может быть короче 8-ми символов.',
      ]"
      @click:append-inner="visible = !visible"
  ></v-text-field>
</template>

<script setup>
import {ref} from "vue";

const model = defineModel()
const visible = ref(false)
</script>