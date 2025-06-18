<template>
  <vue-date-picker
      :disabled="disabled"
      :teleport="true"
      v-model="model"
      select-text="Выбрать"
      cancel-text="Закрыть"
      month-name-format="long"
      @update:modelValue="handleUpdateTime"
      locale="ru"
      ref="datepicker"
      auto-apply
  >
    <template #trigger>
      <v-text-field
          :disabled="disabled"
          @blur="handleBlur"
          :label="label"
          variant="underlined"
          :rules="rules"
          v-model="inputValue"
          :hide-details="hideDetails"
          clearable
          v-maska:[options]
          tabindex="-1"
      />
    </template>
  </vue-date-picker>
</template>

<script setup>
import { vMaska } from "maska";
import VueDatePicker from "@vuepic/vue-datepicker";
import {ref, watch} from "vue";
import {dateHourFormatBack, dateToStringHour, shortDateHourFormat} from "@/utils/format.js";

defineProps(["label", "rules", "disabled", "hideDetails"])

const model = defineModel()
const inputValue = ref("")


const options = {
  mask: "##.##.#### ##:##",
  eager: true
}

const formatInput = (value) => {
  if(!value) return null

  return shortDateHourFormat(value)
}

const handleBlur = (e) => {
  if(!inputValue.value) {
    model.value = null
  }else{
    model.value = dateHourFormatBack(inputValue.value)
  }
}

const handleUpdateTime = (newValue) => {
  model.value = dateToStringHour(newValue);
}

watch(() => model.value, (newValue) => {
  inputValue.value = formatInput(newValue)
}, { immediate: true })

</script>