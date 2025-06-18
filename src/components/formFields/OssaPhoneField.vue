<template>
  <v-text-field
      variant="underlined"
      v-model="model"
      :label="props.type === 'mobile' ? 'Мобильный номер *' : 'Контактный телефон *'"
      placeholder="XXXX"
      v-maska:[options]
  ></v-text-field>
</template>

<script setup>
import { vMaska } from "maska";
const model = defineModel()
const props = defineProps(["type"])

const options = {
  mask: (value) => '####',
  eager: true
}

</script>