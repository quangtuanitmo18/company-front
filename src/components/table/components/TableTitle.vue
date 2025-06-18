<template>
  <th class="text-center" :class="{[column.width]: column.width }">
    <template v-if="hasSort">
      <table-sort-by
          :column="column"
          :sort="sort"
          :setSort="setSort"
      ></table-sort-by>
    </template>
    <template v-else>
      <div :class="{[column.alignTitle]: column.alignTitle }">
        {{ column.heading }}
      </div>
    </template>
  </th>
</template>

<script setup>
import TableSortBy from "./TableSortBy.vue";
import { computed } from "vue";
const { column } = defineProps(["column", "setSort", "sort"])

const hasSort = computed(() => column.sortOptions && column.sortOptions.sortable)
</script>