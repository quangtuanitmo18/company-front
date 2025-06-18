<template>
  <v-text-field
      variant="underlined"
      v-model="model"
      label="Пользователь *"
      :rules="[
          v => !!v || 'Это обязательное поле.',
          v => /^[a-z]$/.test(v[0]) || 'Первый символ должен быть латинской буквой.',
          v => /^[a-z][a-z0-9._]*$/.test(v) || 'Допускаются только латинские буквы, цифры, нижнее подчёркивание и точка.',
          v => v.length >= 5 && v.length <= 32 || 'Должно не меньше 5 и не больше 32 символов.'
      ]"
      @input="handleInput"
  ></v-text-field>
</template>

<script setup>
const model = defineModel()

const handleInput = (e) => {
  model.value = e.target.value.toLowerCase();
}

</script>