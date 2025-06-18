<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="bottom right">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        min-width="46"
        width="46"
        height="46"
        title="Фильтр"
        variant="flat"
        :data-count="countFilters"
        class="filter-icon"
        :class="{ 'filter-baget': !!countFilters }"
      >
        <v-icon class="color-primary" size="x-large" icon="mdi-filter"></v-icon>
      </v-btn>
    </template>

    <v-card min-width="380" class="filter px-2">
      <h3 class="text-center pt-4">Фильтр</h3>

      <v-list>
        <FilterFields v-for="filter in filters" :filter="filter" />
      </v-list>

      <v-card-actions class="py-4">
        <v-spacer></v-spacer>
        <v-btn size="small" variant="outlined" color="primary" @click="handleClear">Очистить</v-btn>
        <v-btn color="primary" variant="flat" size="small" @click="handleSubmit(filters)"
          >Применить</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup>
import FilterFields from "@/components/filter/FilterFields.vue"
import { ref } from "vue"

const { setFilter, clearFilter } = defineProps([
  "setFilter",
  "filters",
  "clearFilter",
  "countFilters",
])

const menu = ref(false)

const handleSubmit = filters => {
  menu.value = false
  setFilter(filters)
}

const handleClear = () => {
  menu.value = false
  clearFilter()
}
</script>

<style lang="scss">
button.filter-icon {
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: 0.3s;
  background-color: #fff;
  color: rgb(var(--color-primary));

  &:hover {
    background-color: #f8f9fa;
  }
}
.filter .v-list,
.filter .v-list .v-list-item__content,
.v-menu > .v-overlay__content > .v-card.filter {
  overflow: visible;
}
.v-list-item__content {
  overflow: visible;
}
button.filter-baget {
  position: relative;

  &::before {
    content: attr(data-count);
    position: absolute;
    top: 0;
    right: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    background-color: #ff5722;
    color: white;
    font-size: 13px;
    transform: translate(50%, -50%);
    z-index: 99;
  }
}
</style>
