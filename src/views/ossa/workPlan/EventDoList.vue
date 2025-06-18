<template>
  <div class="pt-2">
    <template v-if="!loading">
      <table-with-filter
          :columns="columns"
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
  </div>
</template>
<script setup>
import { computed, ref, shallowRef, watch } from "vue";
import { TableWithFilter } from "@/components/index.js";
import {
  DO_RING_STATUS,
  FILTER_TYPE_DATE, FILTER_TYPE_DATE_TIME, FILTER_TYPE_EQ_BY_GROUP, FILTER_TYPE_EQ_CHECK,
  FILTER_TYPE_EQ_MULTI,
  FILTER_TYPE_LIKE,
} from "@/utils/dictionary.js";
import { useStore } from "vuex";
import {sroOrgListForFilter} from "@/service/ossa/clients/sroOrganizationService.js";
import {useRouter} from "vue-router";
import {eventDoToday} from "@/service/ossa/sqlup/eventDoService.js";
import {operatorListForFilter} from "@/service/ossa/users/userOperatorsService.js";

const page = ref(1)
const filters = shallowRef({})
const sort = shallowRef([])
// Example sort
// const sort = [{
//   sortBy: "id",
//   sortType: "asc"
// }]

const store = useStore()
const router = useRouter()

const list = ref([])
const pagination = shallowRef({})
const loading = ref(true)

const size = computed(() => store.getters["settings/rowPage"])
const countFilters = computed(() => Object.keys(filters.value).length)
const isOperator = computed(() => store.getters["auth/isOperator"])

const columns = isOperator.value ? [
  {
    heading: 'Статус',
    value: 'ringStatus',
    subValue: 'id',
    transcript: true,
    filterOptions: {
      filterByValue: 'ringStatus',
      filterType: FILTER_TYPE_EQ_CHECK,
      filterValues: DO_RING_STATUS
    },
  },
  {
    heading: 'Дата контроля',
    value: 'controlDate',
    filterOptions: {
      filterByValue: 'controlDate',
      filterType: FILTER_TYPE_DATE,
    },
  },
  {
    heading: 'Дата',
    value: 'activateDate',
    filterOptions: {
      filterByValue: 'activateDate',
      filterType: FILTER_TYPE_DATE_TIME,
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
    value: 'memberDo',
    subValue: 'inn',
    sortOptions: {
      sortable: true,
      sortByValue: 'inn',
    },
    filterOptions: {
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Наименование',
    value: 'memberDo',
    subValue: 'shortname',
    sortOptions: {
      sortable: true,
      sortByValue: 'shortname',
    },
    filterOptions: {
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Тел. номер абонента',
    value: 'contactDo',
    subValue: 'contact',
    filterOptions: {
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Тема',
    value: 'activateDate',
    type: 'themes',
  },
  {
    heading: 'Комментарий',
    width: '400px',
    align: 'text-left',
    value: 'comment',
    tooltipValue: 'comment',
    filterOptions: {
      filterByValue: 'comment',
      filterType: FILTER_TYPE_LIKE,
    },
  },
] : [
  {
    heading: 'Статус',
    value: 'ringStatus',
    subValue: 'id',
    transcript: true,
    filterOptions: {
      filterByValue: 'ringStatus',
      filterType: FILTER_TYPE_EQ_CHECK,
      filterValues: DO_RING_STATUS
    },
  },
  {
    heading: 'Дата контроля',
    value: 'controlDate',
    filterOptions: {
      filterByValue: 'controlDate',
      filterType: FILTER_TYPE_DATE,
    },
  },
  {
    heading: 'Дата',
    value: 'activateDate',
    filterOptions: {
      filterByValue: 'activateDate',
      filterType: FILTER_TYPE_DATE_TIME,
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
    value: 'memberDo',
    subValue: 'inn',
    sortOptions: {
      sortable: true,
      sortByValue: 'inn',
    },
    filterOptions: {
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Наименование',
    value: 'memberDo',
    subValue: 'shortname',
    sortOptions: {
      sortable: true,
      sortByValue: 'shortname',
    },
    filterOptions: {
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Специалист',
    value: 'operator',
    subValue: 'fio',
    sortOptions: {
      sortable: true,
      sortByValue: 'operator',
    },
    filterOptions: {
      filterByValue: 'operator',
      filterType: FILTER_TYPE_EQ_BY_GROUP,
      filterApi: operatorListForFilter
    },
  },
  {
    heading: 'Тел. номер абонента',
    value: 'contactDo',
    subValue: 'contact',
    filterOptions: {
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Комментарий',
    width: '400px',
    align: 'text-left',
    value: 'comment',
    tooltipValue: 'comment',
    filterOptions: {
      filterByValue: 'comment',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Тема',
    value: 'activateDate',
    type: 'themes',
  },
]

const setPage = (value) => {
  page.value = value
}

const setSort = (value) => {
  sort.value = value
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

watch([page, sort, filters], () => {
  eventDoToday({
    page: page.value,
    row_page: size.value,
    filters: filters.value,
    // convert sort to object
    sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
  }).then(res => {
    console.log("res", res)
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