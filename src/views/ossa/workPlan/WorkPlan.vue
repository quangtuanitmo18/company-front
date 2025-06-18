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
          :handleClickRow="handleClickRow"
          @clear-all-settings="handleClearAllSettings"
      />
    </template>
    <template v-else>
      <div style="clear: both"></div>
      <div class="text-center pb-10">
        <v-progress-circular indeterminate class="color-primary" />
      </div>
    </template>
    <modal width="1200px" v-model="isShowModal">
      <template #title>
        <template v-if="!loadingModal">
          <div class="d-flex flex-column">
            <div class="d-flex">
              <p class="mr-1">Наименование:</p>
              <p class="mr-4">{{currentInfo?.shortname}}</p>
            </div>
            <div class="d-flex">
              <p class="mr-1y">ИНН:</p>
              <p class="mr-4">{{currentInfo?.inn}}</p>
              <p class="mr-1" v-if="currentInfo?.memberDoStatus">Статус:</p>
              <p class="mr-4" v-if="currentInfo?.memberDoStatus">{{currentInfo?.memberDoStatus?.title}}</p>
              <p class="mr-1">СРО:</p>
              <p class="mr-4">{{currentInfo?.sro?.shortName}}</p>
            </div>
          </div>
        </template>
        <template v-else>
          Загрузка данных...
        </template>
      </template>
      <template #content>
        <div class="mt-4">
          <detail-card v-if="!loadingModal" :data="currentInfo"></detail-card>
          <template v-else>
            <div style="clear: both"></div>
            <div class="text-center pb-10">
              <v-progress-circular indeterminate class="color-primary" />
            </div>
          </template>
        </div>
      </template>
      <template #actions>
        <btn-secondary @click="() => isShowModal = false">
          Закрыть
        </btn-secondary>
        <btn-primary @click="redirectToDetail">
          Открыть
        </btn-primary>
      </template>
    </modal>
  </div>
</template>
<script setup>
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import { computed, ref, shallowRef, watch } from "vue";
import { TableWithFilter } from "@/components/index.js";
import {
  FILTER_TYPE_DATE,
  FILTER_TYPE_EQ_MULTI,
  FILTER_TYPE_LIKE,
} from "@/utils/dictionary.js";
import { useStore } from "vuex";
import {sroOrgListForFilter} from "@/service/ossa/clients/sroOrganizationService.js";
import Modal from "@/components/Modal.vue";
import {BtnSecondary, BtnPrimary} from "@/components/buttons";
import {memberDoDetailShort} from "@/service/ossa/sqlup/memberDoService.js";
import DetailCard from "@/views/ossa/agents/components/DetailCard.vue";
import {useRouter} from "vue-router";
import {shortDateFormat} from "@/utils/format.js";
import {workPlanList} from "@/service/ossa/workPlan/workPlanService.js";

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

const isShowModal = ref(false)
const currentInfo = ref(null)
const loadingModal = ref(true)

const redirectToDetail = () => {
  router.push(`/ossa/work-plan/view/${currentInfo.value.id}`)
  isShowModal.value = false
}

const handleShowModal = async (item) => {
  isShowModal.value = true
  loadingModal.value = true

  try {
    const { memberDo } = await memberDoDetailShort(item.id)

    currentInfo.value = memberDo
    loadingModal.value = false
  }catch (err){
    console.log("err", err)
  }
}

const handleRedirectDetail = (item) => {
  router.push(`/ossa/work-plan/view/${item.id}`)
}

const columns = [
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
    heading: 'Комментарий',
    width: '400px',
    align: 'text-left',
    value: 'controlComment',
    tooltipValue: 'controlComment',
    filterOptions: {
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: '',
    value: '',
    type: "custom-buttons",
    buttons: [
      {
        conditions: [],
        type: "icon",
        icon: "mdi-location-enter",
        title: "Открыть",
        handleFunc: (item) => handleRedirectDetail(item)
      },
    ]
  }
]

const handleClickRow = (item) => {
  handleShowModal(item)
}

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
  workPlanList({
    page: page.value,
    row_page: size.value,
    filters: filters.value,
    // convert sort to object
    sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
    // parameters: {
    //   today: false
    // }
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