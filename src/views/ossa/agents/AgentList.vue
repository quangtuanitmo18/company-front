<template>
  <app-page-title iconClassname="mdi-office-building" title="Члены СРО"></app-page-title>
  <v-card class="px-4 py-4">
<!--    <template v-if="!loading">-->
<!--      <table-with-filter-->
<!--          :columns="columns"-->
<!--          :detailsTo="detailsTo"-->
<!--          :search="search"-->
<!--          :searchSelect="searchSelect"-->
<!--          :items="list"-->
<!--          :pagination="pagination"-->
<!--          :sort="sort"-->
<!--          :countFilters="countFilters"-->
<!--          :setPage="setPage"-->
<!--          :setSort="setSort"-->
<!--          :setFilter="setFilter"-->
<!--          :setSearch="setSearch"-->
<!--          :setSearchVariants="setSearchVariants"-->
<!--          @clear-all-settings="handleClearAllSettings"-->
<!--      />-->
<!--    </template>-->
    <template v-if="!loading">
      <table-with-filter
          :columns="columns"
          :detailsTo="detailsTo"
          :items="list"
          :pagination="pagination"
          :sort="sort"
          :countFilters="countFilters"
          :setPage="setPage"
          :setSort="setSort"
          :setFilter="setFilter"
          @clear-all-settings="handleClearAllSettings"
      />
    </template>
    <template v-else>
      <div style="clear: both"></div>
      <div class="text-center pb-10">
        <v-progress-circular indeterminate class="color-primary" />
      </div>
    </template>
  </v-card>
</template>
<script setup>
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import { computed, ref, shallowRef, watch } from "vue";
import { TableWithFilter } from "@/components/index.js";
import {
  FILTER_TYPE_DATE,
  FILTER_TYPE_EQ, FILTER_TYPE_EQ_MULTI,
  FILTER_TYPE_LIKE,
} from "@/utils/dictionary.js";
import { useStore } from "vuex";
import {sroOrgListForFilter} from "@/service/ossa/clients/sroOrganizationService.js";
import {memberDoList} from "@/service/ossa/sqlup/memberDoService.js";
import {dictionaryMemberDoStatusListForFilter} from "@/service/ossa/dictionaries/dictionaryService.js";

const page = ref(1)
const filters = shallowRef({})
const sort = shallowRef([])
// Example sort
// const sort = [{
//   sortBy: "id",
//   sortType: "asc"
// }]

const detailsTo = '/ossa/agent/view/';

const store = useStore()

const list = ref([])
const search = ref("")
const searchVariants = ref(["inn", "telNumber"])
const pagination = shallowRef({})
const loading = ref(true)

const size = computed(() => store.getters["settings/rowPage"])
const countFilters = computed(() => Object.keys(filters.value).length)

const searchSelect = [
  {
    value: "inn",
    title: "ИНН"
  },
  {
    value: "telNumber",
    title: "Номер телефона"
  },
]

const columns = [
  {
    heading: 'Статус',
    value: 'memberDoStatus',
    subValue: 'title',
    sortOptions: {
      sortable: true,
      sortByValue: 'memberDoStatus',
    },
    filterOptions: {
      filterByValue: 'memberDoStatus',
      filterType: FILTER_TYPE_EQ,
      filterApi: dictionaryMemberDoStatusListForFilter
    },
  },
  {
    heading: 'СРО',
    value: 'sro',
    subValue: 'shortName',
    sortOptions: {
      sortable: true,
      sortByValue: 'sro',
    },
    filterOptions: {
      filterByValue: 'sro',
      filterType: FILTER_TYPE_EQ_MULTI,
      filterApi: sroOrgListForFilter
    },
  },
  {
    heading: 'ИНН',
    value: 'inn',
    sortOptions: {
      sortable: true,
      sortByValue: 'inn',
    },
    filterOptions: {
      filterByValue: 'inn',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Наименование',
    value: 'shortname',
    sortOptions: {
      sortable: true,
      sortByValue: 'shortname',
    },
    filterOptions: {
      filterByValue: 'shortname',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Локальное время',
    value: 'timeDiff',
    type: 'local-time',
    sortOptions: {
      sortable: true,
      sortByValue: 'timeDiff',
    },
    filterOptions: {
      // filterByValue: 'timeDiff',
      filterType: FILTER_TYPE_LIKE
    },
  },
  {
    heading: 'Дата контроля',
    value: 'controlDate',
    sortOptions: {
      sortable: true,
      sortByValue: 'controlDate',
    },
    filterOptions: {
      filterByValue: 'controlDate',
      filterType: FILTER_TYPE_DATE,
    },
  }
]

const setPage = (value) => {
  page.value = value
}

const setSort = (value) => {
  sort.value = value
}

const setSearch = (value) => {
  // Change the search value to trigger "watch", it will call the api when the search icon is clicked
  search.value = ""
  search.value = value
}

const setSearchVariants = (values) => {
  searchVariants.value = values
}

const handleClearAllSettings = () => {
  page.value = 1
  filters.value = {}
  sort.value = []
}


const setFilter = (dataFilters) => {
  // dataFilters always is arr
  filters.value = dataFilters.reduce((acc, item) => {
    const type = typeof item.value
    if((type === "object" && item.value?.length) || (type === "string" && item.value) || (type === "number" && item.value) || (type === "boolean" && item.value === false)){
      return {
        ...acc,
        [item.filterBy]: item.value
      }
    }

    return acc
  }, {})
}

watch([page, sort, filters, search], () => {
  memberDoList({
    page: page.value,
    row_page: size.value,
    filters: filters.value,
    // convert sort to object
    sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
    search_string: search.value,
    // search_variants: searchVariants.value
  }).then(res => {
    list.value = res.items
    pagination.value = {
      count: res.data_header.count,
      pages: res.data_header.count_pages,
      page: res.data_header.page,
      size: res.data_header.row_page,
    }
    loading.value = false
  })
}, { immediate: true })
</script>