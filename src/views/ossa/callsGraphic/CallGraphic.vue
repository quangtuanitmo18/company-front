<template>
  <app-page-title iconClassname="mdi-signal-cellular-3" :title="title"></app-page-title>
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
            <call-graphic-stacked title="Входящие звонки" :colors="GRAPHIC_COLORS_CALL_INCOMING" :data="callIncoming"></call-graphic-stacked>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="px-4 py-4">
            <call-graphic-stacked title="Исходящие звонки" :colors="GRAPHIC_COLORS_CALL_OUTGOING" :data="callOutgoing"></call-graphic-stacked>
          </v-card>
        </v-col>
        <v-col cols="12" md="12">
          <v-card class="px-4 py-4">
            <call-graphic-all title="Все звонки" :data="callAll"></call-graphic-all>
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
import {DatePicker, Filters} from "@/components/index.js";
import {computed, onBeforeMount, ref, watch} from "vue";
import {dateToISOString} from "@/utils/format.js";
import {
  FILTER_TYPE_EQ_BY_GROUP,
  GRAPHIC_COLORS_CALL_INCOMING,
  GRAPHIC_COLORS_CALL_OUTGOING
} from "@/utils/dictionary.js";
import {operatorListForFilter} from "@/service/ossa/users/userOperatorsService.js";
import {
  graphCallByHour,
  graphCallByOperators,
  graphCallBySro,
  graphCallHourlyByType
} from "@/service/ossa/statistic/callsService.js";
import CallGraphicStacked from "@/views/ossa/callsGraphic/components/GraphicStacked.vue";
import CallGraphicAll from "@/views/ossa/callsGraphic/components/GraphicAll.vue";
import {useRoute} from "vue-router";

const route = useRoute()

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
const title = ref("")

const callIncoming = ref({
  labels: [],
  datasets: []
})
const callOutgoing = ref({
  labels: [],
  datasets: []
})
const callAll = ref({
  labels: [],
  datasets: []
})

const maxDateBegin = computed(() => getDateBegin(dateEnd.value))
const countFilters = computed(() => Object.keys(filters.value).length)

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


function getDateBegin (newValue){
  const timestamp = new Date(newValue).getTime()
  const timeGap = 0 // 1 day

  return dateToISOString(timestamp - timeGap)
}

const getSumFromDatasets = (datasets, config, length) => {
  const datasetsSum = {
    ...config,
    data: [...Array(length)]
  }

  for (let i = 0; i < length; i++){
    let sum = 0

    for(let j = 0; j < datasets.length; j++){
      sum += datasets[j].data[i]
    }

    datasetsSum.data[i] = sum
  }

  return datasetsSum
}

const getDatasetsCallAll = (data) => {
  const length = data.labels.length

  const datasetsIncomingSum = getSumFromDatasets(data.incoming.datasets, {id: "incoming", label: "Входящие звонки", backgroundColor: "#ff9005"}, length)
  const datasetsOutgoingSum = getSumFromDatasets(data.outgoing.datasets, {id: "outgoing", label: "Исходящие звонки", backgroundColor: "#33b4ee"}, length)

  const all = {
    datasets: []
  }

  all.datasets.push(datasetsIncomingSum)
  all.datasets.push(datasetsOutgoingSum)

  return all.datasets
}

onBeforeMount(() => {
  switch (route.name){
    case "calls-operator":
      title.value = "Графики звонков по специалистам"
      break
    case "calls-sro":
      title.value = "Графики звонков по СРО"
      break
    case "calls-hourly-by-type":
      title.value = "Графики звонков по типам связи"
      break
    default:
      title.value = "Графики звонков по часам"
      break
  }
})

watch([dateEnd],([newValue]) => {
  if(new Date(newValue).getTime() < new Date(dateBegin.value).getTime()){
    dateBegin.value = getDateBegin(newValue)
  }
})

watch([dateEnd, dateBegin, filters], () => {
  loading.value = true

  let graphCallApi = () => {}

  switch (route.name){
    case "calls-operator":
      graphCallApi = graphCallByOperators
          break
    case "calls-sro":
      graphCallApi = graphCallBySro
          break
    case "calls-hourly-by-type":
      graphCallApi = graphCallHourlyByType
          break
    default:
      graphCallApi = graphCallByHour
          break
  }

  graphCallApi({
      parameters: {
          date_begin: dateBegin.value,
          date_end: dateEnd.value,
      },
      filters: filters.value
  }).then(res => {
    callIncoming.value = {
      labels: res.labels,
      datasets: res.incoming.datasets
    }

    callOutgoing.value = {
      labels: res.labels,
      datasets: res.outgoing.datasets
    }

    callAll.value = {
      labels: res.labels,
      datasets: getDatasetsCallAll(res)
    }
  }).finally(() => {
    loading.value = false
  })
}, {immediate: true})


</script>