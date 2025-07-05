<template>
  <div class="mx-4 mt-4">
    <template v-if="!loading">
      <table-comp
          :columns="columns"
          :items="list"
          :sort="sort"
          :setSort="setSort"
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
import {ref, shallowRef, watch} from "vue";
import {useRoute} from "vue-router";
import TableComp from "@/components/table/TableComp.vue";
import {
  CORRECT_REPORT,
  FILTER_TYPE_DATE,
  FILTER_TYPE_EQ_CHECK,
  FILTER_TYPE_LIKE,
} from "@/utils/dictionary.js";
import {memberDoReportList} from "@/service/ossa/sqlup/memberDoReportService.js";

const route = useRoute()

const sort = shallowRef([])
// Example sort
// const sort = [{
//   sortBy: "id",
//   sortType: "asc"
// }]

const list = ref([])
const loading = ref(true)

const columns = [
  {
    heading: 'Корректен',
    width: "50px",
    value: 'isCorrect',
    sortOptions: {
      sortable: true,
      sortByValue: 'isCorrect',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_EQ_CHECK,
      filterValues: CORRECT_REPORT
    },
  },
  {
    heading: 'Год',
    value: 'year',
    sortOptions: {
      sortable: true,
      sortByValue: 'year',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Тип документа',
    value: 'docType',
    sortOptions: {
      sortable: true,
      sortByValue: 'docType',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Комментарий',
    value: 'description',
    sortOptions: {
      sortable: true,
      sortByValue: 'description',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Изменил',
    value: 'userAdd',
    sortOptions: {
      sortable: true,
      sortByValue: 'userAdd',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Дата последнего изменения',
    value: 'dateAdd',
    sortOptions: {
      sortable: true,
      sortByValue: 'dateAdd',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_DATE,
    },
  },
]

const setSort = (value) => {
  sort.value = value
}

watch([sort], () => {
  memberDoReportList(route.params.id,{
    // convert sort to object
    sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
  }).then(res => {
    list.value = res.reports
  }).finally(() => {
    loading.value = false
  })
}, { immediate: true })
</script>