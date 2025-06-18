<template>
  <v-row>
    <v-col cols="12" lg="9">
      <v-card class="px-4 py-4">
        <div class="d-flex justify-space-between" style="margin-bottom: -16px;">
          <p class="text-h6">Последние звонки</p>
        </div>
        <template v-if="!loading">
          <table-comp
              :columns="columns"
              :items="list"
              :pagination="pagination"
              :sort="sort"
              :setPage="setPage"
              :setSort="setSort"
              :no-pagination="true"
          />
        </template>
        <template v-else>
          <div style="clear: both"></div>
          <div class="text-center pb-10">
            <v-progress-circular indeterminate class="color-primary" />
          </div>
        </template>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3">
      <v-card class="px-4 py-4">
        <panel-graphic-doughnut></panel-graphic-doughnut>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import {ref, shallowRef, watch} from "vue";
import {
  CALL_TYPES, DISPOSITION_TYPES,
  FILTER_TYPE_DATE_TIME, FILTER_TYPE_EQ, FILTER_TYPE_EQ_CHECK,
  FILTER_TYPE_LIKE,
} from "@/utils/dictionary.js";
import {callList} from "@/service/ossa/calls/callService.js";
import PanelGraphicDoughnut from "@/views/ossa/panel/PanelGraphicDoughnut.vue";
import TableComp from "@/components/table/TableComp.vue";

const page = ref(1)
const sort = shallowRef([])
// Example sort
// const sort = [{
//   sortBy: "id",
//   sortType: "asc"
// }]

const list = shallowRef([])
const pagination = shallowRef({})
const loading = ref(true)

const columns = [
  {
    heading: 'Статус',
    value: 'disposition',
    valueSecond: 'callType',
    type: 'icons-type-call',
    sortOptions: {
      sortable: true,
      sortByValue: 'disposition',
    },
    filterOptions: {
      filterByValue: 'disposition',
      filterType: FILTER_TYPE_EQ_CHECK,
      filterValues: DISPOSITION_TYPES
    },
  },
  {
    heading: 'Организация',
    width: '200px',
    value: 'membersDo',
    type: 'members-do',
    sortOptions: {
      sortable: false,
      sortByValue: '',
    },
    filterOptions: {
      filterByValue: '',
    },
  },
  {
    heading: 'Номер',
    value: 'externalNumber',
    sortOptions: {
      sortable: true,
      sortByValue: 'externalNumber',
    },
    filterOptions: {
      filterByValue: 'externalNumber',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Специалист',
    type: 'employee',
    value: 'operator',
    subValue: 'shortFio',
    valueSecond: 'internalNumber',
    sortOptions: {
      sortable: true,
      sortByValue: 'fio',
    },
    filterOptions: {
      filterByValue: 'fio',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Дата',
    value: 'dttmStart',
    sortOptions: {
      sortable: true,
      sortByValue: 'dttmStart',
    },
    filterOptions: {
      filterByValue: 'dttmStart',
      filterType: FILTER_TYPE_DATE_TIME
    },
  },
  {
    heading: 'Длительность (сек)',
    value: 'duration',
    valueSecond: 'billsec',
    type: 'duration',
  },
]

const setPage = (value) => {
  page.value = value
}

const setSort = (value) => {
  sort.value = value
}


watch([page, sort], () => {
  callList({
    page: page.value,
    row_page: 16,
    // convert sort to object
    sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
  }).then(res => {
    list.value = res.items.map((item => {
      const sortedMembersDo = item.membersDo.sort((a, b) => b.sort - a.sort)

      return {
        ...item,
        membersDo: sortedMembersDo
      }
    }))
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