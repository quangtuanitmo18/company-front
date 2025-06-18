import '@mdi/font/css/materialdesignicons.css'
import "vuetify/styles"
import '@/assets/font/stylesheet.css'
import '@vuepic/vue-datepicker/dist/main.css'
import '@schedule-x/theme-default/dist/index.css' //calendar schedule


import { createApp } from 'vue'
import router from "@/router"
import store from "@/store"

import App from '@/App.vue'

// Chart
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, LineController, ArcElement } from 'chart.js'
import ChartDataLabels from "chartjs-plugin-datalabels"

ChartJS.register(ChartDataLabels, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, LineController, ArcElement)

// Vuetify
import { createVuetify } from "vuetify";
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components, directives
})

createApp(App)
    .use(store)
    .use(router)
    .use(vuetify)
    .mount('#app')
