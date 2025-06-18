<template>
  <v-chip
      v-for="chip in chips"
      v-model="chip.model"
      class="mr-2 mb-2 color-primary"
      size="small"
      closable
      @click:close="emit('closeChip', chip)"
  >
    <span class="mr-1">{{chip.label}}:</span>
    <span class="font-weight-medium" style="font-size: 13px; line-height: 100%">
      <template v-if="chip.type === FILTER_TYPE_DATE || chip.type === FILTER_TYPE_DATE_TIME">
        {{shortDateFormat(chip.value[0])}} - {{shortDateFormat(chip.value[1])}}
      </template>
      <template v-else-if="chip.type === FILTER_TYPE_EQ_CHECK || chip.type === FILTER_TYPE_EQ || chip.type === FILTER_TYPE_EQ_WITH_SEARCH">
        {{chip.selectValues.find(item => item.value === chip.value).title}}
      </template>
      <template v-else-if="chip.type === FILTER_TYPE_EQ_MULTI || chip.type === FILTER_TYPE_EQ_MULTI_WITH_SEARCH || chip.type === FILTER_TYPE_EQ_BY_GROUP">
        {{getTitlesMultiSelect(chip)}}
      </template>
      <template v-else-if="chip.type === FILTER_TYPE_BETWEEN">
        {{chip.value[0]}} - {{chip.value[1]}}
      </template>
      <template v-else>
        {{chip.value}}
      </template>
    </span>
  </v-chip>
</template>
<script setup>
import {
  FILTER_TYPE_BETWEEN,
  FILTER_TYPE_DATE,
  FILTER_TYPE_DATE_TIME,
  FILTER_TYPE_EQ, FILTER_TYPE_EQ_BY_GROUP,
  FILTER_TYPE_EQ_CHECK,
  FILTER_TYPE_EQ_MULTI, FILTER_TYPE_EQ_MULTI_WITH_SEARCH, FILTER_TYPE_EQ_WITH_SEARCH
} from "@/utils/dictionary.js";
import {shortDateFormat} from "@/utils/format.js";

defineProps(["chips"])
const emit = defineEmits(["closeChip"])

const getTitlesMultiSelect = (chip) => {
  const chipsSelected = chip.selectValues.reduce((acc, item) => {
    if(chip.value.includes(item.value)){
      acc.push(item.title)
    }
    return acc
  },[])

  return chipsSelected.join(", ")
}
</script>