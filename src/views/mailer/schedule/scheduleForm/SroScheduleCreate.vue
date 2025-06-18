<template>
  <app-page-title iconClassname="mdi-send-clock" title="Создать новое расписание"></app-page-title>
  <card-with-actions title="" :actions="configActions">
    <v-form ref="form" class="mt-4">
      <v-row>
        <v-col cols="12" md="12">
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                variant="underlined"
                v-model="schedule.packageType"
                :items="packageTypeList"
                :rules="[v => !!v || 'Это обязательное поле.']"
                label="Тип *"
              ></v-select>
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                variant="underlined"
                v-model="schedule.scheduleFrequencyType"
                :items="scheduleFrequencyTypeList"
                :rules="[v => !!v || 'Это обязательное поле.']"
                label="Частота *"
              ></v-select>
            </v-col>

            <!-- <v-text-field
              variant="underlined"
              type="number"
              v-model.number="schedule.scheduleFrequency"
              :rules="[v => !!/^\d+$/.test(v) || 'Только числа.']"
              label="Количество"
              class="d-none"
            /> -->

            <!-- Weekly frequency: day selection -->
            <v-col v-if="schedule.scheduleFrequencyType === 'weekly'" cols="12" md="4">
              <v-select
                variant="underlined"
                :items="WEEK_DAYS"
                closable-chips
                :rules="[v => v.length > 0 || 'Выберите хотя бы один день недели']"
                label="Дни недели"
              ></v-select>
            </v-col>
            <!-- Monthly frequency: day of month selection -->
            <v-col v-if="schedule.scheduleFrequencyType === 'monthly'" cols="12" md="4">
              <v-select
                variant="underlined"
                :items="monthDaysList"
                :rules="[v => !!v || 'Выберите день месяца']"
                label="День месяца"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props" :title="item.title">
                    <template v-if="item.value > 28" #subtitle>
                      <span class="text-caption">
                        {{
                          item.value === 29
                            ? "Для февраля в невисокосный год будет использован последний день месяца (28)"
                            : item.value === 30
                            ? "Для февраля будет использован последний день месяца (28 или 29)"
                            : "Для февраля, апреля, июня, сентября и ноября будет использован последний день месяца (30)"
                        }}
                      </span>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            <!-- Yearly frequency: date in year selection -->
            <v-col v-if="schedule.scheduleFrequencyType === 'yearly'" cols="12" md="4">
              <date-picker
                :teleport="true"
                v-model="schedule.yearDate"
                :rules="[v => !!v || 'Выберите дату']"
                label="Дата в году"
                :hide-details="true"
              />
            </v-col>

            <v-col cols="12" md="6">
              <date-hour-picker
                :teleport="true"
                :rules="[v => !!v || 'Это обязательное поле.']"
                v-model="schedule.scheduleFromDttm"
                label="Дата начала *"
                :hide-details="true"
              />
            </v-col>
            <v-col cols="12" md="6">
              <date-hour-picker
                :teleport="true"
                v-model="schedule.scheduleUntilDttm"
                label="Дата окончания *"
                :hide-details="true"
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field variant="underlined" v-model="schedule.description" label="Описание" />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox v-model="schedule.enabled" label="Действует" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div v-if="notion" class="form-notion mt-4">
        <p class="form-notion-text" :class="{ [notion.status]: true }">{{ notion.text }}</p>
      </div>
      <ErrorList v-if="errors.length" :errors="errors" />
    </v-form>
    <template v-slot:action>
      <btn-primary :loading="loading" class="ml-2" @click="handleSubmit"> Создать </btn-primary>
    </template>
  </card-with-actions>
</template>

<script setup>
import CardWithActions from "@/components/CardWithActions.vue"
import DateHourPicker from "@/components/date/DateHourPicker.vue"
import DatePicker from "@/components/date/DatePicker.vue"
import AppPageTitle from "@/layouts/AppPageTitle.vue"

import ErrorList from "@/components/notifications/ErrorList.vue"

import {
  scheduleFrequencyDictionaryFilterMailer,
  taskAdd,
} from "@/service/mailer/packageScheduleService.js"
import { typePackageDictionaryFilterMailer } from "@/service/mailer/packageService.js"
import { WEEK_DAYS } from "@/utils/dictionary"
import { printErrors } from "@/utils/handleErrors"
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import BtnPrimary from "../../../../components/buttons/BtnPrimary.vue"

const route = useRoute()
const router = useRouter()

const sroId = ref()
const packageTypeList = ref()
const scheduleFrequencyTypeList = ref()
const form = ref(null)
const notion = ref(null)
const loading = ref(false)
const errors = ref([])

const schedule = ref({
  packageType: null,
  scheduleFrequency: null,
  scheduleFrequencyType: null,
  scheduleFromDttm: null,
  scheduleUntilDttm: null,
  description: null,
  enabled: true,
})

// Days of month for monthly selection
const monthDaysList = computed(() => {
  const days = []
  for (let i = 1; i <= 31; i++) {
    days.push({ title: i.toString(), value: i })
  }
  return days
})

const handleBack = () => {
  router.go(-1)
}

const configActions = [
  {
    icon: "mdi-close",
    handleFunc: handleBack,
  },
]

const handleSubmit = async () => {
  const { valid } = await form.value.validate()

  if (!valid) return

  loading.value = true

  const data = {
    sroOrganization: sroId.value,
    packageType: schedule.value.packageType,
    scheduleFrequency: schedule.value.scheduleFrequency || 1,
    scheduleFrequencyType: schedule.value.scheduleFrequencyType,
    scheduleFromDttm: schedule.value.scheduleFromDttm
      ? schedule.value.scheduleFromDttm.replace(/-/g, ".")
      : null,
    scheduleUntilDttm: schedule.value.scheduleUntilDttm
      ? schedule.value.scheduleUntilDttm.replace(/-/g, ".")
      : null,
    description: schedule.value.description,
    enabled: schedule.value.enabled,
  }

  taskAdd(data)
    .then(res => {
      notion.value = {
        status: "success",
        text: "Расписание успешно создан.",
      }
      errors.value = []
      router.replace("/mailer/schedule")
    })
    .catch(err => {
      notion.value = null
      if (err.validationErrors) {
        errors.value = printErrors(err.validationErrors)
      } else {
        errors.value.push(err)
      }
    })
    .finally(() => {
      loading.value = false
    })

  loading.value = false
}

onMounted(() => {
  sroId.value = route.params.id
  typePackageDictionaryFilterMailer().then(res => {
    packageTypeList.value = res
  })

  scheduleFrequencyDictionaryFilterMailer().then(res => {
    scheduleFrequencyTypeList.value = res
  })
})
</script>

<style scoped lang="scss"></style>
