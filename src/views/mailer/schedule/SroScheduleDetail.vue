<template>
  <app-page-title iconClassname="mdi-send-clock" title="Расписание"></app-page-title>
  <template v-if="!isLoadingDetail && !isLoadingNearestTasks">
    <card-with-actions :actions="configActions">
      <v-row>
        <v-col cols="12">
          <v-table class="mt-4 table-view">
            <tbody>
              <tr>
                <td>СРО</td>
                <td>
                  {{ scheduleDetails?.packageSchedule?.sroOrganization?.title }}
                </td>
              </tr>
              <tr>
                <td>Тип</td>
                <td>
                  {{ scheduleDetails?.packageSchedule?.package_type?.package_type_name }}
                </td>
              </tr>
              <tr>
                <td>Периодичность</td>
                <td>
                  {{
                    scheduleDetails?.packageSchedule?.schedule_frequency_type
                      ?.schedule_frequency_type_name
                  }}
                </td>
              </tr>
              <tr>
                <td>Последнее отправление</td>
                <td>
                  {{ shortDateHourFormat(scheduleDetails?.packageSchedule?.dttmLastExecuted) }}
                </td>
              </tr>
              <tr>
                <td>Дата начала</td>
                <td>
                  {{ shortDateHourFormat(scheduleDetails?.packageSchedule?.scheduleFromDttm) }}
                </td>
              </tr>
              <tr>
                <td>Дата окончания</td>
                <td>
                  {{ shortDateHourFormat(scheduleDetails?.packageSchedule?.scheduleUntilDttm) }}
                </td>
              </tr>
              <tr>
                <td>Отправлено</td>
                <td>
                  {{ scheduleDetails?.packageSchedule?.countLaunches }}
                </td>
              </tr>
              <tr>
                <td>Ближайшие отправки</td>
                <td>
                  <div v-if="scheduleNearestTasks.length > 0">
                    <div v-for="(task, index) in scheduleNearestTasks" :key="index" class="mb-1">
                      {{ shortDateHourFormat(task) }}
                    </div>
                  </div>
                  <div v-else class="text-muted">Нет ближайших отправок</div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </card-with-actions>
  </template>
  <template v-else>
    <div style="clear: both"></div>
    <div class="text-center pb-10">
      <v-progress-circular indeterminate class="color-primary" />
    </div>
  </template>
  <modal
    v-model="isShowModal"
    title="Подтверждение действия"
    text="Вы действительно хотите удалить расписание?"
  >
    <template #actions>
      <btn-secondary @click="isShowModal = false"> Закрыть </btn-secondary>
      <btn-primary :loading="isLoadingDelete" @click="handleDelete"> Удалить </btn-primary>
    </template>
  </modal>
</template>

<script setup>
import CardWithActions from "@/components/CardWithActions.vue"
import Modal from "@/components/Modal.vue"
import { BtnPrimary, BtnSecondary } from "@/components/buttons/index.js"
import AppPageTitle from "@/layouts/AppPageTitle.vue"
import {
  taskDelete,
  taskDetail,
  thressNerearestTasks
} from "@/service/mailer/packageScheduleService.js"
import { shortDateHourFormat } from "@/utils/format.js"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const scheduleId = ref()
const scheduleDetails = ref({})
const isLoadingDetail = ref(true)

const scheduleNearestTasks = ref([])
const isLoadingNearestTasks = ref(true)

// Delete Action
const isShowModal = ref(false)
const isLoadingDelete = ref(false)
const handleBack = () => {
  router.go(-1)
}

const redirectEdit = () => {
  router.push(`/mailer/schedule/edit/${route.params.id}`)
}

const redirectDelete = () => {
  isShowModal.value = true
}

const handleDelete = async () => {
  isLoadingDelete.value = true

  await taskDelete(route.params.id).then(res => {
    isLoadingDelete.value = false
    location.replace("/mailer/schedule")
  })
}

const configActions = [
  {
    icon: "mdi-pencil",
    title: "Редактировать",
    handleFunc: redirectEdit
  },
  {
    icon: "mdi-trash-can-outline",
    title: "Удалить",
    handleFunc: redirectDelete
  },
  {
    icon: "mdi-close",
    title: "Закрыть",
    handleFunc: handleBack
  }
]

onMounted(() => {
  scheduleId.value = route.params.id

  taskDetail(scheduleId.value).then(res => {
    scheduleDetails.value = res
    isLoadingDetail.value = false
  })
  thressNerearestTasks({ id: scheduleId.value }).then(res => {
    scheduleNearestTasks.value = res.next_starts
    isLoadingNearestTasks.value = false
  })
})
</script>

<style scoped lang="scss"></style>
