<template>
  <app-page-title iconClassname="mdi-account-arrow-right" title="График звонков специалистов за период"></app-page-title>
  <v-card class="px-4 py-4">
    <div class="d-flex ga-4">
      <div class="flex-1-0">
        <v-row>
          <v-col cols="12" md="2">
            <date-picker :teleport="true" label="Начало периода" :hide-details="true" :max-date="maxDateBegin" v-model="dateBegin"></date-picker>
          </v-col>
          <v-col cols="12" md="2">
            <date-picker :teleport="true" label="Конец периода" :hide-details="true" :max-date="new Date()" v-model="dateEnd"></date-picker>
          </v-col>
        </v-row>
      </div>
      <div class="ml-auto">
        <Filters :countFilters="countFilters" :filters="innerFilters" :setFilter="handleFilter" :clearFilter="handleClearFilter"></Filters>
      </div>
    </div>
  </v-card>
  <div class="mt-4">
    <template v-if="!loading">
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="px-4 py-4">
            <p class="text-h6">Результат звонков специалистов за период</p>
            <graphic :animation="true" :data="members"></graphic>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="px-4 py-4">
            <p class="text-h6">Результат звонков специалистов за период, с разбивкой по СРО</p>
            <graphic :animation="true" :data="sro"></graphic>
          </v-card>
        </v-col>
        <v-col cols="12" md="12">
          <v-card class="px-4 py-4">
            <p class="text-h6">Результат звонков специалистов за период, с разбивкой по СРО и специалистам</p>
            <graphic :animation="true" :data="sroRow"></graphic>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <div class="text-center pb-10">
        <v-progress-circular indeterminate class="color-primary" />
      </div>
    </template>
  </div>
</template>
<script setup>
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import {DatePicker, Filters} from "@/components";
import {dateToISOString} from "@/utils/format";
import {computed, ref, watch} from "vue";
import {FILTER_TYPE_EQ_BY_GROUP} from "@/utils/dictionary.js";
import {operatorListForFilter} from "@/service/ossa/users/userOperatorsService.js";
import {GraphicEventDoMembers, GraphicEventDoSro, GraphicEventSroRow} from "@/service/ossa/statistic/eventDo.js";
import Graphic from "@/components/Graphic.vue";

const defaultFilters = () => {
  return [
    {
      filterBy: "operator",
      value: null,
      label: "Специалист",
      type: FILTER_TYPE_EQ_BY_GROUP,
      selectValues: [],
      api: operatorListForFilter
    }
  ]
}

const innerFilters = ref(defaultFilters())
const filters = ref({})
const loading = ref(false)
const dateEnd = ref(dateToISOString(+ new Date()))
const dateBegin = ref(getDateBegin(+ new Date()))

const members = ref({
  labels: [],
  datasets: []
})
const sro = ref({
  labels: [],
  datasets: []
})
const sroRow = ref({
  labels: [],
  datasets: []
})

const maxDateBegin = computed(() => getDateBegin(dateEnd.value))
const countFilters = computed(() => Object.keys(filters.value).length)

function getDateBegin (newValue){
  const timestamp = new Date(newValue).getTime()
  const timeGap = 0 // 0 day

  return dateToISOString(timestamp - timeGap)
}

const handleFilter = () => {
  filters.value = innerFilters.value.reduce((acc, item) => {
    const type = typeof item.value
    if((type === "object" && item.value?.length) || (type === "string" && item.value) || (type === "boolean" && item.value === false)){
      return {
        ...acc,
        [item.filterBy]: item.value
      }
    }

    return acc
  }, {})
}

const handleClearFilter = () => {
  filters.value = {}
  innerFilters.value = defaultFilters()
}

watch([dateEnd],([newValue]) => {
  if(new Date(newValue).getTime() < new Date(dateBegin.value).getTime()){
    dateBegin.value = getDateBegin(newValue)
  }
})

watch([dateEnd, dateBegin, filters], () => {
  loading.value = true

  const data = {
    filters: filters.value,
    parameters: {
      date_begin: dateBegin.value,
      date_end: dateEnd.value,
    },
  }

  Promise.all([GraphicEventDoMembers(data), GraphicEventDoSro(data), GraphicEventSroRow(data)]).then(values => {
    const [resMembers, resSro, resSroRow] = values

    resMembers.datasets[0].backgroundColor = "#33b4ee"
    resSro.datasets[0].backgroundColor = "#ff9005"
    resSroRow.datasets[0].backgroundColor = "#7091E6"
    resSroRow.datasets[1].backgroundColor = "#3D52A0"
    resSroRow.datasets[2].backgroundColor = "#ADBBDA"

    members.value = resMembers
    sro.value = resSro
    sroRow.value = resSroRow

  }).finally(() => {
    loading.value = false
  })
}, {immediate: true})
</script>