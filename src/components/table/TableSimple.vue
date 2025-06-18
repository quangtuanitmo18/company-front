<template>
  <v-card v-if="configPanel" class="d-flex flex-wrap px-4 py-4 mx-2 mb-4 mt-2" elevation="4" >
    <expansion-panel
        class="mb-2"
        :config-panel="configPanel"
    />
  </v-card>
  <table-comp
      :columns="columns"
      :items="items"
      :detailsTo="detailsTo"
      :pagination="pagination"
      :search="search"
      :sort="sort"
      :setPage="setPage"
      :setSort="setSort"
      @handle-edit="(args) => { emit('handleEdit', args) }"
  >
  </table-comp>
</template>

<script setup>
  import {TableComp} from "@/components/index.js";
  import ExpansionPanel from "@/components/panels/ExpansionPanel.vue";
  import {SroPanel} from "@/views/package/components/index.js";
  const props = defineProps([
    "columns",
    "items",
    "detailsTo",
    "pagination",
    "search",
    "searchHint",
    "sort",
    "countFilters",
    "setPage",
    "setSort",
    "setFilter",
    "setSearch",
    "fullMode",
    "showAll",
    "configPanel"
  ])
  const emit = defineEmits(["show-all-fields", "handleEdit"])

  const showFieldsIcon = (state) => {
    if (state === false) {
      return "mdi-table-column-plus-after"
    } else {
      return "mdi-table-column"
    }
  }

  const showAllFields = (showAll) => {
    emit("show-all-fields")
  }
</script>
