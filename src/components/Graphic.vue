<template>
  <Bar
      :options="chartOptions"
      :data="data"
  />
</template>
<script setup>
import {Bar} from "vue-chartjs";
const {stackedY, stackedX, animation} = defineProps(["data", "stackedY", "stackedX", "animation"])

const chartOptions = {
  responsive: true,
  animation: animation,
  scales: {
    x: {
      stacked: stackedX,
      grid: {
        display: false
      }
    },
    y: {
      stacked: stackedY,
    }
  },
  plugins: {
    legend: {
      display: false
    },
    datalabels: {
      display: false
    },
  }
}
</script>