<template>
  <v-select
      variant="underlined"
      v-model="model"
      :items="selectFiltered"
      no-data-text="Ничего не найдено"
      :multiple="multiple"
  >
    <template v-slot:prepend-item>
      <v-text-field class="px-4" variant="underlined" v-model="search" placeholder="Поиск" @update:focused="handleBlur" @input="searchInput"></v-text-field>
    </template>
    <template v-slot:item="{props, item}">
      <v-list-item v-bind="props">
        <template v-if="multiple" v-slot:prepend="{ isSelected }">
          <v-checkbox-btn :model-value="isSelected"></v-checkbox-btn>
        </template>
        <template v-slot:title>
          <div v-html="highlightedText(item.raw.title, search)"></div>
        </template>
        <template v-if="item.raw.subtitle" v-slot:subtitle>
          <div v-html="highlightedText(item.raw.subtitle, search)"></div>
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup>
import {ref, watch} from "vue";
import {highlightedText} from "@/utils/format.js";
const props = defineProps(["items", "multiple"]);
const model = defineModel();

const search = ref("");
const select = ref([]);
const selectFiltered = ref([]);

watch(() => props.items, () => {
  select.value = props.items
  selectFiltered.value = props.items
}, {immediate: true})

const handleBlur = (e) => {
  if(e === false) {
    search.value = ""
    selectFiltered.value = select.value
  }
}

const searchInput = () => {
  if(!search.value) {
    selectFiltered.value = [...select.value]
  }

  selectFiltered.value = select.value.filter((item) =>
      item.title.toLowerCase().includes(search.value.toLowerCase())
      || item?.subtitle?.toLowerCase().includes(search.value.toLowerCase())
  )
}
</script>