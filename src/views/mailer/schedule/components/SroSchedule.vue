<template>
  <div v-for="sro in sroList" :key="sro.id">
    <v-expansion-panels class="pt-4" v-model="panel[sro.id]">
      <v-expansion-panel>
        <v-expansion-panel-title class="panel-header">
          <template v-slot:default="{ expanded }">
            <div class="d-flex justify-space-between align-center w-100">
              <h4 class="panel-section-header">
                <v-icon icon="mdi-menu-down"></v-icon>
                <span class="panel-section-header-text">{{ sro.title }}</span>
              </h4>
              <p class="panel-section-header-description">
                Количество рассылок:
                <span style="color: #ff5722" class="font-weight-bold">{{
                  sroSchedule[sro.id]?.data_header?.count || "нет"
                }}</span>
              </p>
            </div>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-btn
                class="pull-right icon-color-primary"
                @click="createSchedule(sro.id)"
                size="small"
                icon="mdi-plus"
                title="Добавить"
              ></v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-table v-if="sroSchedule[sro.id]" class="table">
                <thead>
                  <tr>
                    <th class="text-center">CРО</th>
                    <th class="text-center">Тип</th>
                    <th class="text-center">Периодичность</th>
                    <th class="text-center">Последнее отправление</th>
                    <th class="text-center">Дата начала</th>
                    <th class="text-center">Дата окончания</th>
                    <th class="text-center">Отправлено</th>
                    <th class="text-center">Ближайшие отправки</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="link-row"
                    v-for="row in sroSchedule[sro.id].items"
                    @click="handleDetailsTo(row)"
                  >
                    <td>{{ row.sroOrganization.title }}</td>
                    <td>{{ row.package_type.package_type_name }}</td>
                    <td>{{ row.schedule_frequency_type.schedule_frequency_type_name }}</td>
                    <td class="text-center">{{ shortDateHourFormat(row.dttmLastExecuted) }}</td>
                    <td class="text-center">{{ shortDateHourFormat(row.scheduleFromDttm) }}</td>
                    <td class="text-center">{{ shortDateHourFormat(row.scheduleUntilDttm) }}</td>
                    <td class="text-center">{{ row.countLaunches }}</td>
                    <td class="text-center">
                      <v-btn
                        class="icon-color-primary"
                        @click.stop="handleNearestTask(row)"
                        size="small"
                        variant="text"
                        icon="mdi-clock"
                        title="Ближайшие задачи"
                      ></v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
  <modal-nearest-tasks
    v-model="isModalTaskNearest"
    :dataModalSchedule="dataModalSchedule"
    :dataTaskNearest="dataTaskNearest"
    :isLoadingModalTaskNearest="isLoadingModalTaskNearest"
  />
</template>

<script setup>
import { tasksSro, thressNerearestTasks } from "@/service/mailer/packageScheduleService.js"
import { shortDateHourFormat } from "@/utils/format.js"
import { ref, watch } from "vue"
import { useRouter } from "vue-router"

import ModalNearestTasks from "./ModalNearestTasks.vue"

const router = useRouter()
const panel = ref({})
const { sroList } = defineProps(["sroList"])
const sroSchedule = ref({})
const detailsTo = "/mailer/schedule/view/"

// modal nearest task
const isModalTaskNearest = ref(false)
const dataTaskNearest = ref([])
const dataModalSchedule = ref({})
const isLoadingModalTaskNearest = ref(false)

const getSroSchedule = async id => {
  sroSchedule.value[id] = await tasksSro(id)
}

const handleRedirect = (name, params = {}) => {
  router.push({ name, params })
}

const createSchedule = id => handleRedirect("mailer-sro-schedule-add", { id })

const handleDetailsTo = item => {
  if (!detailsTo) return

  router.push(detailsTo + item.id)
}

// nearest task modal
const handleNearestTask = async item => {
  dataTaskNearest.value = []
  isModalTaskNearest.value = true
  dataModalSchedule.value = item
  isLoadingModalTaskNearest.value = true
  try {
    const threeNearestTasks = await thressNerearestTasks({ id: item.id })
    dataTaskNearest.value = threeNearestTasks.next_starts
  } catch (error) {
    console.error("Error fetching nearest tasks:", error)
  } finally {
    isLoadingModalTaskNearest.value = false
  }
}
const closeTaskNearestModal = () => {
  isModalTaskNearest.value = false
}

watch(
  () => sroList,
  items => {
    if (items && items.length > 0) {
      items.forEach(sro => {
        getSroSchedule(sro.id)
      })
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.link-row {
  cursor: pointer;
}
</style>
