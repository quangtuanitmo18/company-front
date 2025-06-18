<template>
  <slot></slot>
  <div class="mb-2" style="clear: both"></div>
  <template v-if="items.length">
    <v-table class="table pt-4" :class="{'view-detail': !!detailsTo || !!handleClickRow}">
      <thead>
        <tr>
          <table-title
              v-for="(column, index) in columns"
              :key="index" :column="column"
              :setSort="setSort"
              :sort="sort"
          />
        </tr>
      </thead>
      <tbody>
        <table-columns
            :key="tableColumnsId"
            @handle-edit="(args) => {emit('handleEdit', args); tableColumnsId++}"
            @update-checkbox="(data) => emit('update-checkbox', data)"
            :columns="columns"
            :detailsTo="detailsTo"
            :search="search"
            :items="items"
            :handleClickRow="handleClickRow"
        />
      </tbody>
    </v-table>
    <v-divider />
    <table-pagination v-if="!noPagination" :pagination="pagination" :setPage="setPage"/>
  </template>
  <template v-else>
    <p class="text-center py-10">Записи, удовлетворяющие критериям поиска отсутствуют</p>
  </template>
</template>

<script setup>
import { TableColumns, TablePagination, TableTitle } from "./components"
import {ref} from "vue";
const { pagination } = defineProps(["columns", "detailsTo", "items", "pagination", "sort", "search", "setPage", "setSort", "noPagination", "handleClickRow"])
const emit = defineEmits(["update-checkbox", "handleEdit"])

const tableColumnsId = ref(1);
</script>
