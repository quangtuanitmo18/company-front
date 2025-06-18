<template>
  <v-text-field
      variant="underlined"
      v-model="model"
      type="number"
      :rules="[
                (v) => !!v || 'Это обязательное поле.',
                (v) => (/^[0-9_]+$/.test(v)) || 'Допустимы только цифры',
                (v) => v.length === 10 || v.length === 12 || 'ИНН содержит 10 или 12 символов.',
              ]"
      label="ИНН"
      v-max="maxChars"
  ></v-text-field>
</template>
<script setup>
import {ref, watch} from "vue";
const props = defineProps(["type"])
const model = defineModel()
const maxChars = ref(12)

const handler = (e) => {
  if (e.target.value.length > maxChars.value) {
    model.value = e.target.value.slice(0, maxChars.value)
  }
};

watch(() => props.type, () => {
  if(props.type === "short"){
    maxChars.value = 10
  }else{
    maxChars.value = 12
  }
}, { immediate: true })

const vMax = {
  mounted(el, binding) {
    el.addEventListener('input', handler);
  },
  beforeUnmount(el) {
    el.removeEventListener('input', handler);
  }
};
</script>