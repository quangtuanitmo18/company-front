<template>
  <app-page-title iconClassname="mdi-account-plus" title="Создание сотрудника"></app-page-title>
  <card-with-actions :actions="configActions">
    <v-form ref="form" class="mt-4">
      <v-row>
        <v-col cols="2">
          <employee-avatar :upload="true" v-model="employee.photo"></employee-avatar>
        </v-col>
        <v-col cols="10">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                variant="underlined"
                v-model="employee.lastName"
                :rules="[v => !!v || 'Это обязательное поле.']"
                label="Фамилия"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                variant="underlined"
                v-model="employee.firstName"
                :rules="[v => !!v || 'Это обязательное поле.']"
                label="Имя"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                variant="underlined"
                v-model="employee.patronymic"
                label="Отчество"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <phone-field v-model="employee.mobilePhone" label="Номер телефона"></phone-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                variant="underlined"
                v-model="employee.innerPhone"
                label="Добавочный номер телефона"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                variant="underlined"
                v-model="employee.internalPhone"
                label="Внутренний номер телефона"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <date-picker
                :teleport="true"
                v-model="employee.birthday"
                label="Дата рождения"
              ></date-picker>
            </v-col>
            <v-col cols="12" md="4">
              <date-picker
                :teleport="true"
                v-model="employee.employmentDate"
                label="Дата трудоустройства"
              ></date-picker>
            </v-col>
            <v-col cols="12" md="4">
              <date-picker
                :teleport="true"
                v-model="employee.dismissalDate"
                label="Дата увольнения"
              ></date-picker>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                variant="underlined"
                v-model="employee.department"
                :items="departmentSelect"
                label="Отдел"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <text-with-search
                v-model="employee.post"
                label="Должность"
                :search-api="employeeDictionarySearchPost"
              ></text-with-search>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                variant="underlined"
                v-model="employee.functionality"
                label="Функционал сотрудника"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <dynamic-list v-model="employee.emails" noMargin :defaultValues="{ value: '' }">
                <template #header>
                  <p class="mt-1">Электронная почта</p>
                </template>
                <template #default="{ item }">
                  <v-col cols="10" md="10">
                    <email-field hide-details v-model="item.value"></email-field>
                  </v-col>
                </template>
              </dynamic-list>
            </v-col>
            <v-col cols="12" md="4">
              <dynamic-list v-model="employee.otherPhones" noMargin :defaultValues="{ value: '' }">
                <template #header>
                  <p class="mt-1">Другие номера телефона</p>
                </template>
                <template #default="{ item }">
                  <v-col cols="10" md="10">
                    <phone-field v-model="item.value" label="Номер телефона"></phone-field>
                  </v-col>
                </template>
              </dynamic-list>
            </v-col>
            <v-col cols="12" md="4">
              <dynamic-list v-model="employee.vacations" noMargin :defaultValues="{ value: '' }">
                <template #header>
                  <p class="mt-1">Отпуск</p>
                </template>
                <template #default="{ item }">
                  <v-col cols="10" md="10">
                    <date-picker
                      :range="true"
                      :teleport="true"
                      v-model="item.value"
                      label="Отпуск"
                      :hide-details="true"
                    ></date-picker>
                  </v-col>
                </template>
              </dynamic-list>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div v-if="notion" class="form-notion mt-4">
        <p class="form-notion-text" :class="{ [notion.status]: true }">{{ notion.text }}</p>
      </div>
    </v-form>
    <template v-slot:action>
      <btn-primary :loading="loading" class="ml-2" @click="handleSubmit"> Создать </btn-primary>
    </template>
  </card-with-actions>
</template>
<script setup>
import BtnPrimary from "@/components/buttons/BtnPrimary.vue"
import CardWithActions from "@/components/CardWithActions.vue"
import DatePicker from "@/components/date/DatePicker.vue"
import EmailField from "@/components/formFields/EmailField.vue"
import { PhoneField, TextWithSearch } from "@/components/formFields/index.js"
import AppPageTitle from "@/layouts/AppPageTitle.vue"
import {
  employeeDictionary,
  employeeDictionarySearchPost
} from "@/service/employees/dictionaryService.js"
import { employeeAdd } from "@/service/employees/employeeService.js"
import DynamicList from "@/views/employees/components/DynamicList.vue"
import EmployeeAvatar from "@/views/employees/components/EmployeeAvatar.vue"
import { onMounted, ref, shallowRef } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const form = ref(null)
const notion = ref(null)
const departmentSelect = shallowRef([])
const postSelect = shallowRef([])
const loading = ref(false)

const employee = ref({
  firstName: "",
  lastName: "",
  patronymic: "",
  mobilePhone: "",
  innerPhone: "",
  internalPhone: "",
  otherPhones: [],
  emails: [],
  vacations: [],
  department: null,
  post: null,
  birthday: "",
  employmentDate: "",
  dismissalDate: "",
  functionality: ""
})

const handleSubmit = async () => {
  const { valid } = await form.value.validate()

  if (!valid) return

  loading.value = true

  const data = {
    ...employee.value,
    emails: employee.value.emails.map(item => item.value),
    otherPhones: employee.value.otherPhones.map(item => item.value),
    vacations: employee.value.vacations.map(item => `[${item.value.join(",")}]`)
  }

  employeeAdd(data)
    .then(res => {
      location.replace("/employees")
    })
    .catch(err => {
      notion.value = {
        status: "error",
        text: err
      }
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  employeeDictionary("department").then(res => {
    departmentSelect.value = res.items.map(item => ({ ...item, value: item.id }))
  })

  employeeDictionary("post").then(res => {
    postSelect.value = res.items.map(item => ({ ...item, value: item.id }))
  })
})

const handleBack = () => {
  router.go(-1)
}

const configActions = [
  {
    icon: "mdi-close",
    title: "Закрыть",
    handleFunc: handleBack
  }
]
</script>
