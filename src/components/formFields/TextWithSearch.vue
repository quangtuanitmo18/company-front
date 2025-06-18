<template>
  <v-combobox
      variant="underlined"
      v-model="search"
      persistent-hint
      :no-filter="true"
      :items="items"
      :loading="loading"
      @update:modelValue="handleUpdate"
      @update:search="handleInput"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props" title="">
        <p><b v-html="highlightedText(item.raw.title, search)"></b></p>
        <div style="color: var(--text-secondary); font-size: 14px">
          <span>{{item.raw.description}}</span>
        </div>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {highlightedText} from "@/utils/format.js";
import {isObject} from "@/utils/object.js";

const model = defineModel()
const {searchApi} = defineProps(["searchApi"])

const search = ref(null)
const items = ref([])
const timeout = ref()
const loading = ref(false)

const handleUpdate = (newValue) => {
  if(isObject(newValue)){
    // when the user selects from the list
    search.value = newValue.title
    model.value = newValue.id
  }else{
    // when the user types
    model.value = newValue
  }
}

const handleInput = (newValue) => {
  if(typeof newValue !== "string") return

  loading.value = true
  items.value = []
  if(timeout.value){
    clearTimeout(timeout.value)
  }

  timeout.value = setTimeout(() => {
    searchApi(newValue).then((res) => {
      items.value = res
    }).finally(() => {
      loading.value = false
    })
  }, 500)
}

onMounted(() => {
  searchApi("").then((res) => {
    items.value = res

    if(model.value){
      const currentItem = items.value.find(item => item.id === model.value)
      if(currentItem){
        search.value = currentItem.title
      }
    }
  }).finally(() => {
    loading.value = false
  })
})

watch(model, (newValue) => {
  const currentItem = items.value.find(item => item.id === newValue)

  if(currentItem){
    search.value = currentItem.title
  }
})
</script>