<template>
  <div class="text-center">
    <div class="mb-2 d-flex ga-2 justify-center">
      <v-btn color="grey-lighten-3" :active="frequency === freq.value" size="small" v-for="freq in FREQUENCY_SELECT" @click="frequency = freq.value">{{freq.title}}</v-btn>
    </div>
    <p class="text-h6">Входящие звонки</p>
    <div v-if="!isEmptyOutgoing" class="d-flex justify-center" style="max-width: 390px; margin: auto">
      <Doughnut
          :options="chartOptions"
          :data="dataIncoming"
      />
    </div>
    <div v-else class="text-center my-10" style="height: 328px">
      Нет данных
    </div>
    <p class="text-h6">Исходящие звонки</p>
    <div v-if="!isEmptyIncoming" class="d-flex justify-center" style="max-width: 390px; margin: auto">
      <Doughnut
          :options="chartOptions"
          :data="dataOutgoing"
      />
    </div>
    <div v-else class="text-center my-10" style="height: 328px">
      Нет данных
    </div>
  </div>
</template>
<script setup>
import {Doughnut} from "vue-chartjs";
import {computed, ref, watch} from "vue";
import {graphCircleCalls, graphCircleOutgoing} from "@/service/ossa/statistic/commonService.js";

const FREQUENCY_SELECT = [
  {
    value: "day",
    title: "Сутки"
  },
  {
    value: "week",
    title: "Неделя"
  },
  {
    value: "month",
    title: "Месяц"
  }
]

const chartOptions = {
  responsive: true,
  animation: true,
}

const dataOutgoing = ref({
  labels: [],
  datasets: []
})

const dataIncoming = ref({
  labels: [],
  datasets: []
})

const frequency = ref("day")

const isEmptyOutgoing = computed(() => dataOutgoing.value.datasets[0]?.data.every(item => item === 0) )
const isEmptyIncoming = computed(() => dataIncoming.value.datasets[0]?.data.every(item => item === 0) )

watch([frequency], () => {
  graphCircleCalls({
    parameters:{
      frequency: frequency.value
    }
  }).then(res => {
    const {incoming, outgoing} = res

    incoming.datasets[0].backgroundColor = [
      '#33b4ee',
      '#ff9005',
      '#fb3737',
    ]
    incoming.datasets[0].hoverOffset = 5

    dataIncoming.value = incoming

    outgoing.datasets[0].backgroundColor = [
      '#33b4ee',
      '#ff9005',
      '#fb3737',
    ]
    outgoing.datasets[0].hoverOffset = 5

    dataOutgoing.value = outgoing
  })
}, {immediate: true})

</script>