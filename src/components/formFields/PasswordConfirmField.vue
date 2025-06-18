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
          passwordConfirmationRule
      ]"
      @click:append-inner="visible = !visible"
  ></v-text-field>
</template>

<script setup>
import {computed, ref, watch} from "vue";

const props = defineProps(["password"])
const model = defineModel()
const visible = ref(false)
const password = ref(props.password)

const passwordConfirmationRule = computed(() => {
  return model.value === password.value || 'Пароли не совпадают.'
})

watch(() => props.password, (newValue) => {
  password.value = newValue
})

</script>