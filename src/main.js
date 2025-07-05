import "@/assets/font/stylesheet.css"
import "@mdi/font/css/materialdesignicons.css"
import "@schedule-x/theme-default/dist/index.css" //calendar schedule
import "@vuepic/vue-datepicker/dist/main.css"
import "vuetify/styles"

import router from "@/router"
import store from "@/store"
import { createApp } from "vue"

import App from "@/App.vue"

// Chart
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(
  ChartDataLabels,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  LineController,
  ArcElement
)

// Vuetify
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

const vuetify = createVuetify({
  components,
  directives
})

createApp(App).use(store).use(router).use(vuetify).mount("#app")
