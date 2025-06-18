<template>
  <v-text-field
      variant="underlined"
      v-model="model"
      type="number"
      :rules="[
                (v) => !!v || 'Это обязательное поле.',
                (v) => (/^[0-9_]+$/.test(v)) || 'Допустимы только цифры',
                (v) => v.length === 13 || v.length === 15 || 'ОГРН содержит 13 или 15 символов..',
              ]"
      label="ОГРН"
      v-max="maxChars"
  ></v-text-field>
</template>

<script setup>
import {ref, watch} from "vue";
const props = defineProps(["type"])
const model = defineModel()
const maxChars = ref(15)

const handler = (e) => {
  if (e.target.value.length > maxChars.value) {
    model.value = e.target.value.slice(0, maxChars.value)
  }
};

watch(() => props.type, () => {
  if(props.type === "short"){
    maxChars.value = 13
  }else{
    maxChars.value = 15
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