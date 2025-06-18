<template>
  <v-text-field
      variant="underlined"
      v-model="model"
  ></v-text-field>
</template>

<script setup>
import {watch} from "vue";

const model = defineModel()

watch(() => model.value, (newValue, oldValue) => {
  if(!newValue) return;

  const value = typeof newValue === "number" ? newValue.toString().replace(/\s+/g, '') : newValue.replace(/\s+/g, '')

  if(!value) return;

  if(!/^[0-9.]+$/.test(value)) {
    model.value = oldValue
    return
  }
  const [first, second] = value.split(".")

  let str = new Intl.NumberFormat('ru-RU').format(first.slice(0,10))

  if(second !== undefined){
    str += "." + second.slice(0,2)
  }

  model.value = str
})
</script>
