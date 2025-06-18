<template>
  <div class="pull-right mr-2 d-flex ga-2">
    <v-btn
      height="46px"
      variant="flat"
      @click="clearAllSettings"
      title="Очистить все настройки"
      class="filter-icon"
      >Очистить</v-btn
    >
    <v-btn
      v-if="fullMode"
      v-bind="showAll"
      min-width="46"
      width="46"
      height="46"
      variant="flat"
      class="filter-icon"
      :title="!showAll ? 'Полный набор' : 'Короткий набор'"
      @click="showAllFields(showAll)"
    >
      <v-icon class="color-primary" size="x-large" :icon="showFieldsIcon(showAll)"></v-icon>
    </v-btn>
    <Filters
      v-if="innerFilters.length"
      :countFilters="countFilters"
      :filters="innerFilters"
      :setFilter="handleFilter"
      :clearFilter="handleClearFilter"
    ></Filters>
    <slot name="header-buttons"></slot>
  </div>
  <table-comp
    :columns="columns"
    :items="items"
    :detailsTo="detailsTo"
    :pagination="pagination"
    :search="search"
    :sort="sort"
    :setPage="setPage"
    :setSort="setSort"
    :handleClickRow="handleClickRow"
  >
    <div class="table-search" v-if="searchHint">
      <v-text-field
        clearable
        @click:clear="setSearch('')"
        @keydown.enter="handleSearch"
        variant="underlined"
        label="Поиск"
        :hint="searchHint"
        v-model="innerSearch"
        persistent-hint
      />
      <v-icon
        @click="handleSearch"
        :class="{ active: innerSearch }"
        class="table-search-icon"
        icon="mdi-magnify"
      ></v-icon>
    </div>
    <div class="table-search-with-select" v-if="searchSelect">
      <v-text-field
        clearable
        @click:clear="setSearch('')"
        @keydown.enter="handleSearch"
        variant="underlined"
        label="Поиск"
        v-model="innerSearch"
        persistent-hint
        hide-details
      />
      <v-icon
        @click="handleSearch"
        :class="{ active: innerSearch }"
        class="table-search-icon mr-4"
        icon="mdi-magnify"
      ></v-icon>
      <v-select
        label="Поиск по:"
        v-model="innerSelect"
        @update:modelValue="handleSearchVariants"
        :items="searchSelect"
        :multiple="true"
        variant="solo"
        hide-details
      >
      </v-select>
    </div>
    <div>
      <Chip :chips="chips" @close-chip="handleClose"></Chip>
    </div>
  </table-comp>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { TableComp, Filters } from "@/components/index.js";
import Chip from "@/components/chip/Chip.vue";
const props = defineProps([
  "columns",
  "items",
  "detailsTo",
  "pagination",
  "search",
  "searchHint",
  "searchSelect",
  "sort",
  "countFilters",
  "setPage",
  "setSort",
  "setFilter",
  "setSearch",
  "setSearchVariants",
  "fullMode",
  "showAll",
  "handleClickRow",
]);
const emit = defineEmits(["clear-all-settings", "show-all-fields"]);

const chips = ref([]);
const innerSearch = ref(props.search);
const innerFilters = ref(getDefaultFilters());
const innerSelect = ref([]);

const handleSearchVariants = (values, newValues) => {};

function getDefaultFilters() {
  const filters = props.columns.map((column) => ({
    filterBy: column.filterOptions?.filterByValue,
    filterOptions: column.filterOptions ? column.filterOptions : [],
    value: column.filterOptions?.filterDefaultValue || null,
    label: column.heading,
    type: column.filterOptions?.filterType,
    component: column.filterOptions?.filterComponent,
    selectValues: column.filterOptions?.filterValues || [],
    api: column.filterOptions?.filterApi || null,
  }));

  chips.value = JSON.parse(
    JSON.stringify(
      filters.filter((item) => {
        if (Array.isArray(item.value)) {
          if (item.value.length > 0) {
            return true;
          }
        } else if (typeof item.value === "boolean") {
          return true;
        } else {
          if (item.value && item.filterBy) {
            return true;
          }
        }
        return false;
      })
    )
  );

  return filters;
}

const resetDefaultFilters = () =>
  props.columns.map((column) => ({
    filterBy: column.filterOptions?.filterByValue,
    filterOptions: column.filterOptions ? column.filterOptions : [],
    value: null,
    label: column.heading,
    type: column.filterOptions?.filterType,
    component: column.filterOptions?.filterComponent,
    selectValues: column.filterOptions?.filterValues || [],
    api: column.filterOptions?.filterApi || null,
  }));

watch(
  () => props.columns,
  () => {
    innerFilters.value = getDefaultFilters();
  }
);

watch(
  () => innerSelect.value,
  (newValues, oldValues) => {
    let currentValues;

    if (newValues.length === 0) {
      currentValues = [...oldValues];
      innerSelect.value = currentValues;
    } else {
      currentValues = [...newValues];
    }

    props.setSearchVariants(currentValues);
  }
);

const handleClose = (filter) => {
  innerFilters.value.forEach((item) => {
    if (item.filterBy === filter.filterBy) {
      item.value = null;
    }
  });

  props.setFilter(innerFilters.value);
};

const handleSearch = () => {
  props.setSearch(innerSearch.value);
};

const handleFilter = () => {
  props.setFilter(innerFilters.value);

  chips.value = JSON.parse(
    JSON.stringify(
      innerFilters.value.filter((item) => {
        if (Array.isArray(item.value)) {
          if (item.value.length > 0) {
            return true;
          }
        } else if (typeof item.value === "boolean") {
          return true;
        } else {
          if (item.value && item.filterBy) {
            return true;
          }
        }
        return false;
      })
    )
  );
};

const handleClearFilter = () => {
  chips.value = [];
  innerFilters.value = resetDefaultFilters();
  props.setFilter([]);
};

const clearAllSettings = () => {
  chips.value = [];
  innerFilters.value = resetDefaultFilters();
  innerSearch.value = "";
  emit("clear-all-settings");
};

const showFieldsIcon = (state) => {
  if (state === false) {
    return "mdi-table-column-plus-after";
  } else {
    return "mdi-table-column";
  }
};

const showAllFields = (showAll) => {
  emit("show-all-fields");
};

onMounted(() => {
  if (props.searchSelect) {
    const selected = props.searchSelect.map((item) => item.value);
    innerSelect.value = selected;
  }
});
</script>
