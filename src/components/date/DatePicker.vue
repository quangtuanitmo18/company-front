<template>
  <vue-date-picker
      :teleport="teleport"
      v-model="model"
      :range="range"
      select-text="Выбрать"
      cancel-text="Закрыть"
      month-name-format="long"
      :enable-time-picker="false"
      @update:modelValue="handleUpdateTime"
      :disabled="disabled"
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
import VueDatePicker from "@vuepic/vue-datepicker";
import {dateFormatBack, shortDateFormat} from "@/utils/format.js";
import {onMounted, ref, shallowRef, watch} from "vue";
import { vMaska } from "maska";

const { range } = defineProps(["range", "teleport", "label", "rules", "disabled", "hideDetails"])

const model = defineModel()
const emit = defineEmits(["updated"])
const inputValue = ref("")
const options = shallowRef({})
const datepicker = ref(null)

const optionsSinger = {
  mask: "##.##.####",
  eager: true
}

const optionsMulti = {
  mask: (value) => value.includes('-') ? "##.##.#### - ##.##.####" : "##.##.####",
  eager: true
}

const handleBlur = (e) => {
  if(!inputValue.value) {
    model.value = null
    emit("updated", model.value)
    return
  }

  if(!range){
    model.value = dateFormatBack(inputValue.value.trim())
  } else{
    model.value = inputValue.value.split("-").map((item) => dateFormatBack(item.trim()))
  }
  emit("updated", model.value)
}
const formatInput = (value) => {
  if(!value) return null

  if(!range){
    return shortDateFormat(value)
  }else{
    if(value.length === 2){
      return `${shortDateFormat(value[0])} - ${shortDateFormat(value[1])}`
    }else if(value.length === 1){
      return shortDateFormat(value[0])
    }
  }
}

const handleUpdateTime = (newValue) => {
  if(!range){
    model.value = newValue.toISOString().slice(0, 10)
  }else{
    const updatedValue = []
    if(newValue && newValue.length){
      newValue.forEach(value => {
        if(value){
          updatedValue.push(value.toISOString().slice(0, 10))
        }
      })

      model.value = [...updatedValue]
    }else{
      model.value = null
    }
  }

  emit("updated", model.value)
}

onMounted(() => {
  if(range){
    options.value = optionsMulti
  }else{
    options.value = optionsSinger
  }
})

watch(() => model.value, (newValue) => {
  inputValue.value = formatInput(newValue)
}, { immediate: true })
</script>