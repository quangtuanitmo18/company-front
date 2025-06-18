<template>
  <p class="text-h6">{{title}}</p>
  <Graphic :animation="true" :stackedY="true" :stackedX="true" :data="dataInner"></Graphic>
</template>
<script setup>
import {Graphic} from "@/components/index.js";
import {computed, watch} from "vue";

const {data, colors} = defineProps(["data", "colors", "title"])

const dataInner = computed(() => {
  data.datasets = data.datasets.map((item) => {
    const currentOption = colors.find(i => i.value === item.id)

    return {
      ...item,
      backgroundColor: currentOption.color,
    }
  })

  return data
})

</script>