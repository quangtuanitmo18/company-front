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
  FILTER_TYPE_LIKE,
} from "@/utils/dictionary.js";
import {memberDoCheckList} from "@/service/ossa/sqlup/memberDoCheckService.js";

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
    heading: 'Тип проверки',
    value: 'checkName',
    sortOptions: {
      sortable: true,
      sortByValue: 'checkName',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Нарушение',
    value: 'violationType',
    sortOptions: {
      sortable: true,
      sortByValue: 'violationType',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Вид',
    value: 'checkTypeCaption',
    sortOptions: {
      sortable: true,
      sortByValue: 'checkTypeCaption',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Примечание',
    value: 'comments',
    sortOptions: {
      sortable: true,
      sortByValue: 'comments',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'ФИО ответственного СРО',
    value: 'sroResponseFio',
    sortOptions: {
      sortable: true,
      sortByValue: 'sroResponseFio',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'ФИО ответственного от организации',
    value: 'agentResponseFio',
    sortOptions: {
      sortable: true,
      sortByValue: 'agentResponseFio',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Статус проверки',
    value: 'checkActStatus',
    sortOptions: {
      sortable: true,
      sortByValue: 'checkActStatus',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Документ',
    value: 'checkBasement',
    sortOptions: {
      sortable: true,
      sortByValue: 'checkBasement',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Тип документа',
    value: 'checkReason',
    sortOptions: {
      sortable: true,
      sortByValue: 'checkReason',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
]

const setSort = (value) => {
  sort.value = value
}

watch([sort], () => {
  memberDoCheckList(route.params.id,{
    // convert sort to object
    sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
  }).then(res => {
    list.value = res.checks
  }).finally(() => {
    loading.value = false
  })
}, { immediate: true })
</script>