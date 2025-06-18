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
  DISPOSITION_TYPES, DISPOSITION_TYPES_INCOMING, EXCHANGE_TYPES, FILTER_TYPE_BETWEEN,
  FILTER_TYPE_DATE_TIME, FILTER_TYPE_EQ, FILTER_TYPE_EQ_BY_GROUP, FILTER_TYPE_EQ_CHECK, FILTER_TYPE_EQ_MULTI,
  FILTER_TYPE_LIKE,
} from "@/utils/dictionary.js";
import { useStore } from "vuex";
import {callDownload, callListIncoming} from "@/service/ossa/calls/callService.js";
import {downloadFile} from "@/utils/files.js";
import {operatorListForFilter} from "@/service/ossa/users/userOperatorsService.js";
import {sroOrgListForFilter} from "@/service/ossa/clients/sroOrganizationService.js";
import * as storage from "@/utils/storage.js";

const page = ref(1)
const filters = shallowRef({})
const sort = shallowRef([])
// Example sort
// const sort = [{
//   sortBy: "id",
//   sortType: "asc"
// }]

const store = useStore()

const list = ref([])
const pagination = shallowRef({})
const loading = ref(true)

const size = computed(() => store.getters["settings/rowPage"])
const countFilters = computed(() => Object.keys(filters.value).length)
const isShowPlayerAudio = computed(() => store.getters["audio/isShow"])

const handleDownloadFile = async (item) => {
  const res = await callDownload(item.id)
  downloadFile(res, item.filename)
}

const handlePlayAudio = (item) => {
  list.value = list.value.map((i) => {
    if(i.id === item.id){
      return {...i, isPlaying: true}
    }else{
      return {...i, isPlaying: false}
    }
  })
  const url = storage.load("project_href") + item.filename

  store.commit("audio/setCurrentFile", url)
  store.commit("audio/setIsShow", true)
}

const columns = [
  {
    heading: 'Статус',
    value: 'disposition',
    sortOptions: {
      sortable: true,
      sortByValue: 'disposition',
    },
    filterOptions: {
      filterByValue: 'disposition',
      filterType: FILTER_TYPE_EQ_CHECK,
      filterValues: DISPOSITION_TYPES_INCOMING
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
    heading: 'Тип линии',
    value: 'exchangeType',
    transcript: true,
    sortOptions: {
      sortable: true,
      sortByValue: 'exchangeType',
    },
    filterOptions: {
      filterByValue: 'exchangeType',
      filterType: FILTER_TYPE_EQ,
      filterValues: EXCHANGE_TYPES
    },
  },
  {
    heading: 'Внешний номер',
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
      sortByValue: 'internalNumber',
    },
    filterOptions: {
      filterByValue: 'operator',
      filterType: FILTER_TYPE_EQ_BY_GROUP,
      filterApi: operatorListForFilter
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
    heading: 'Длительность (сек)',
    value: 'duration',
    valueSecond: 'billsec',
    type: 'duration',
    sortOptions: {
      sortable: true,
      sortByValue: 'duration',
    },
    filterOptions: {
      filterByValue: 'duration',
      filterType: FILTER_TYPE_BETWEEN,
      filterMaxValue: 1500,
      filterStep: 1
    },
  },
  {
    heading: '',
    value: '',
    type: "custom-buttons",
    buttons: [
      {
        conditions: [
          {
            title: "isPlay",
            value: true,
            equal: false
          },
          {
            title: "isFile",
            value: true,
            equal: true
          }
        ],
        type: "icon",
        icon: "mdi-play-circle-outline",
        title: "Воспроизвести аудио",
        handleFunc: (item) => handlePlayAudio(item)
      },
      {
        conditions: [
          {
            title: "isFile",
            value: true,
            equal: true
          }
        ],
        type: "icon",
        icon: "mdi-file-download-outline",
        title: "Скачать аудио",
        handleFunc: (item) => handleDownloadFile(item)
      },
    ]
  }
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
  callListIncoming({
    page: page.value,
    row_page: size.value,
    filters: filters.value,
    // convert sort to object
    sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
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

watch([isShowPlayerAudio], ([newValue]) => {
  if(!newValue){
    list.value = list.value.map(item => ({...item, isPlaying: false}))
  }
})
</script>