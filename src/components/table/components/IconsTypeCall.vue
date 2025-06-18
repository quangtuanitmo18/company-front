<template>
  <v-tooltip close-on-content-click max-width="600" offset="4" location="top">
    <template v-slot:activator="{ props }">
      <span v-bind="props" :class="`mdi ${currentValue.icon ? currentValue.icon : `mdi-circle`}`" :style="`color: ${currentValue.color}; font-size: 20px`"></span>
    </template>
    <div>
      <p>Тип: {{CALL_TYPES.find(type => type.value === callType).title}}</p>
      <p>Статус: {{currentValue.title}}</p>
    </div>
  </v-tooltip>
</template>
<script setup>
import {DISPOSITION_TYPES_OUTGOING, DISPOSITION_TYPES_INCOMING, CALL_TYPES} from "@/utils/dictionary.js";

const { disposition, callType} = defineProps(["disposition", "callType"])
const currentList = callType === "outgoing" ? DISPOSITION_TYPES_OUTGOING : DISPOSITION_TYPES_INCOMING
const currentValue = currentList.find(item => disposition === item.value)
</script>