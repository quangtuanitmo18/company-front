<template>
  <app-page-title iconClassname="mdi-send-clock" title="Расписание"></app-page-title>
  <template v-if="!isLoadingDetail">
    <card-with-actions :actions="configActions">
      <v-row>
        <v-col cols="12">
          <v-table class="mt-4 table-view">
            <tbody>
              <tr>
                <td>SRO</td>
                <td>
                  {{ scheduleDetails?.packageSchedule?.sroOrganization?.title }}
                </td>
              </tr>
              <tr>
                <td>Type</td>
                <td>
                  {{ scheduleDetails?.packageSchedule?.package_type?.package_type_name }}
                </td>
              </tr>
              <tr>
                <td>Frequency</td>
                <td>
                  {{
                    scheduleDetails?.packageSchedule?.schedule_frequency_type
                      ?.schedule_frequency_type_name
                  }}
                </td>
              </tr>
              <tr>
                <td>Last Execute</td>
                <td>
                  {{ shortDateHourFormat(scheduleDetails?.packageSchedule?.dttmLastExecuted) }}
                </td>
              </tr>
              <tr>
                <td>From</td>
                <td>
                  {{ shortDateHourFormat(scheduleDetails?.packageSchedule?.scheduleFromDttm) }}
                </td>
              </tr>
              <tr>
                <td>Until</td>
                <td>
                  {{ shortDateHourFormat(scheduleDetails?.packageSchedule?.scheduleUntilDttm) }}
                </td>
              </tr>
              <tr>
                <td>Count</td>
                <td>
                  {{ scheduleDetails?.packageSchedule?.countLaunches }}
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
import CardWithActions from '@/components/CardWithActions.vue'
import Modal from '@/components/Modal.vue'
import { BtnPrimary, BtnSecondary } from '@/components/buttons/index.js'
import AppPageTitle from '@/layouts/AppPageTitle.vue'
import { taskDelete, taskDetail } from '@/service/mailer/packageScheduleService.js'
import { shortDateHourFormat } from '@/utils/format.js'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const scheduleId = ref()
const scheduleDetails = ref({})
const isLoadingDetail = ref(true)

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
    location.replace('/mailer/schedule')
  })
}

const configActions = [
  {
    icon: 'mdi-pencil',
    title: 'Редактировать',
    handleFunc: redirectEdit,
  },
  {
    icon: 'mdi-trash-can-outline',
    title: 'Удалить',
    handleFunc: redirectDelete,
  },
  {
    icon: 'mdi-close',
    title: 'Закрыть',
    handleFunc: handleBack,
  },
]

onMounted(() => {
  scheduleId.value = route.params.id

  taskDetail(scheduleId.value).then(res => {
    scheduleDetails.value = res
    isLoadingDetail.value = false
  })
})
</script>

<style scoped lang="scss"></style>
