<template>
  <div class="ml-2">
    <v-form ref="form" class="mt-4">
      <v-row>
        <v-col cols="2">
          <employee-avatar :upload="true" :id="route.params.id" v-model="employee.photo"></employee-avatar>
        </v-col>
        <v-col cols="10">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                  variant="underlined"
                  v-model="employee.lastName"
                  :rules="[(v) => !!v || 'Это обязательное поле.']"
                  label="Фамилия"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                  variant="underlined"
                  v-model="employee.firstName"
                  :rules="[(v) => !!v || 'Это обязательное поле.']"
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
              <v-text-field
                  variant="underlined"
                  v-model="employee.mobilePhone"
                  label="Номер телефона"
              ></v-text-field>
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
            <v-col cols="12" md="6">
              <dynamic-list v-model="employee.emails" noMargin :defaultValues="{value: ''}">
                <template #header>
                  <p class="mt-1">Email</p>
                </template>
                <template #default="{ item }">
                  <v-col cols="10" md="10">
                    <email-field hide-details v-model="item.value"></email-field>
                  </v-col>
                </template>
              </dynamic-list>
            </v-col>
            <v-col cols="12" md="6">
              <dynamic-list v-model="employee.otherPhones" noMargin :defaultValues="{value: ''}">
                <template #header>
                  <p class="mt-1">Другие номера телефона</p>
                </template>
                <template #default="{ item }">
                  <v-col cols="10" md="10">
                    <v-text-field
                        variant="underlined"
                        v-model="item.value"
                        label="Другие номера телефона"
                        hide-details
                    ></v-text-field>
                  </v-col>
                </template>
              </dynamic-list>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div v-if="notion" class="form-notion mt-4">
        <p class="form-notion-text" :class="{[notion.status]: true}">{{ notion.text }}</p>
      </div>
    </v-form>
    <div class="d-flex justify-end mt-4">
      <btn-secondary @click="handleBack">
        Назад
      </btn-secondary>
      <btn-primary :loading="loading" class="ml-2" @click="handleSubmit">
        Применить
      </btn-primary>
    </div>
  </div>
</template>
<script setup>
import DynamicList from "@/views/employees/components/DynamicList.vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref, shallowRef} from "vue";
import {employeeDictionary, employeeDictionarySearchPost} from "@/service/employees/dictionaryService.js";
import {employeeDetail, employeeEdit} from "@/service/employees/employeeService.js";
import {EmailField, TextWithSearch} from "@/components/formFields";
import {DatePicker} from "@/components";
import {BtnPrimary} from "@/components/buttons";
import {BtnSecondary} from "@/components/buttons/index.js";
import EmployeeAvatar from "@/views/employees/components/EmployeeAvatar.vue";

const route = useRoute()
const router = useRouter()

const employee = ref({
  firstName: "",
  lastName: "",
  patronymic: "",
  mobilePhone: "",
  innerPhone: "",
  internalPhone: "",
  otherPhones: [],
  emails: [],
  department: null,
  post: null,
  birthday: "",
  employmentDate: "",
  dismissalDate: "",
})
const departmentSelect = shallowRef([])
const postSelect = shallowRef([])
const form = ref(null)
const notion = ref(null)
const loading = ref(false)

const handleBack = () => {
  router.go(-1)
}

const handleSubmit = async () => {
  const { valid } = await form.value.validate()

  if(!valid) return
  loading.value = true

  employeeEdit(route.params.id, {
    ...employee.value,
    emails: employee.value.emails?.map((item) => item.value),
    otherPhones: employee.value.otherPhones?.map((item) => item.value),
  }).then(res => {
    notion.value = {
      status: "success",
      text: "Данные сотрудника успешно обновлены."
    }
    employee.value = {
      ...res.employee,
      emails: res.employee.emails?.map(email => ({value: email})),
      otherPhones: res.employee.otherPhones?.map(otherPhone => ({value: otherPhone})),
      department: res.employee.department?.id || null,
      post: res.employee.post?.id || null,
    }

    delete employee.value.vacations
  }).catch(err => {
    notion.value = {
      status: "error",
      text: err
    }
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  employeeDetail(route.params.id).then(res => {
    employee.value = {
      ...res.employee,
      emails: res.employee.emails?.map(email => ({value: email})),
      otherPhones: res.employee.otherPhones?.map(otherPhone => ({value: otherPhone})),
      department: res.employee.department?.id || null,
      post: res.employee.post?.id || null,
    }

    delete employee.value.vacations
  })

  employeeDictionary("department").then(res => {
    departmentSelect.value = res.items.map((item) => ({...item, value: item.id}))
  })

  employeeDictionary("post").then(res => {
    postSelect.value = res.items.map((item) => ({...item, value: item.id}))
  })
})
</script>