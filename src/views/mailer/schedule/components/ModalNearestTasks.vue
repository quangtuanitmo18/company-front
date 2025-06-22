<template>
  <modal width="600px" v-model="isOpen">
    <template #title>
      <div class="d-flex flex-column">
        <p class="text-h6 mb-1">Ближайшие отправки</p>

        <div class="d-flex text-base">
          <p class="mr-1 font-italic">CРО:</p>
          <p class="mr-4">{{ dataModalSchedule.sroOrganization?.title }}</p>
          <p class="mr-1 font-italic">Тип:</p>
          <p class="mr-4">{{ dataModalSchedule.package_type?.package_type_name }}</p>
          <p class="mr-1 font-italic">Частота:</p>
          <p class="mr-4">
            {{ dataModalSchedule.schedule_frequency_type?.schedule_frequency_type_name }}
          </p>
        </div>
      </div>
    </template>

    <template #content>
      <v-row>
        <v-col cols="12">
          <v-card elevation="2" class="pa-2">
            <v-row>
              <v-col cols="12" md="4">
                <p class="mr-1 font-weight-bold">Дата начала:</p>
                <p>{{ shortDateHourFormat(dataModalSchedule.scheduleFromDttm) }}</p>
              </v-col>
              <v-col cols="12" md="4">
                <p class="mr-1 font-weight-bold">Дата окончания:</p>
                <p>{{ shortDateHourFormat(dataModalSchedule.scheduleUntilDttm) }}</p>
              </v-col>
              <v-col cols="12" md="4">
                <p class="mr-1 font-weight-bold">Всего отправок:</p>
                <p>{{ dataModalSchedule.countLaunches }}</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="12" class="mt-2">
          <v-card elevation="2" class="pa-2">
            <p class="text-h6 mb-3">Ближайшие отправки:</p>

            <!-- Loading state -->
            <template v-if="isLoadingModalTaskNearest">
              <div class="d-flex justify-center pa-4">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
            </template>

            <!-- Tasks list -->
            <template v-else-if="dataTaskNearest.length">
              <v-row v-for="(time, index) in dataTaskNearest" :key="index" class="my-1">
                <v-col cols="12">
                  <div class="d-flex align-center nearest-task-item">
                    <v-icon color="primary" class="mr-3">mdi-calendar-clock</v-icon>
                    <span class="task-time">{{ shortDateHourFormat(time) }}</span>
                  </div>
                </v-col>
              </v-row>
            </template>

            <!-- No tasks -->
            <template v-else>
              <div class="text-center pa-4">
                <v-icon color="grey" size="large">mdi-calendar-remove</v-icon>
                <p class="mt-2">Нет запланированных задач</p>
              </div>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Actions button -->
    <template #actions>
      <btn-secondary @click="closeModal">Закрыть</btn-secondary>
    </template>
  </modal>
</template>

<script setup>
import { shortDateHourFormat } from "@/utils/format.js"
import Modal from "@/components/Modal.vue"
import { BtnSecondary } from "@/components/buttons/index.js"
import { computed } from "vue"

const isOpen = defineModel()

const props = defineProps({
  dataModalSchedule: {
    type: Object,
    default: () => ({})
  },
  dataTaskNearest: {
    type: Array,
    default: () => []
  },
  isLoadingModalTaskNearest: {
    type: Boolean,
    default: false
  }
})

const closeModal = () => {
  isOpen.value = false
}
</script>
