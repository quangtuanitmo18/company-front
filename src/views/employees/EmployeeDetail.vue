<template>
  <app-page-title
    iconClassname="mdi-account"
    title="Сотрудник"
    subtitle="Профиль сотрудника"
  ></app-page-title>
  <card-with-actions :title="`${employee.fio}`" :actions="configActions">
    <v-row>
      <v-col cols="2">
        <avatar :avatar="employee.photo"></avatar>
      </v-col>
      <v-col cols="10">
        <v-table class="mt-4 table-view">
          <tbody>
            <tr>
              <td>Отдел</td>
              <td>{{ transcript(employee.department?.id, departmentList) }}</td>
            </tr>
            <tr>
              <td>Должность</td>
              <td>{{ transcript(employee.post?.id, postList) }}</td>
            </tr>
            <tr>
              <td>Emails</td>
              <td>
                <p v-for="email in employee.emails">
                  <a class="mail" :href="`mailto:${email}`">{{ email }}</a>
                </p>
              </td>
            </tr>
            <tr>
              <td>Номер телефона</td>
              <td>{{ employee.mobilePhone }}</td>
            </tr>
            <tr>
              <td>Добавочный номер телефона</td>
              <td>{{ employee.innerPhone }}</td>
            </tr>
            <tr>
              <td>Внутренний номер телефона</td>
              <td>{{ employee.internalPhone }}</td>
            </tr>
            <tr>
              <td>Другие номера телефона</td>
              <td>
                <p v-for="phone in employee.ortherPhone">{{ phone }}</p>
              </td>
            </tr>
            <tr>
              <td>Дата рождения</td>
              <td>{{ shortDateFormat(employee.birthday) }}</td>
            </tr>
            <tr>
              <td>Дата трудоустройства</td>
              <td>{{ shortDateFormat(employee.employmentDate) }}</td>
            </tr>
            <tr>
              <td>Отпуска</td>
              <td>
                <p v-for="vacation in employee.vacations">
                  {{ shortDateFormat(vacation.vacation.startDate) }} -
                  {{ shortDateFormat(vacation.vacation.endDate) }}
                </p>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </card-with-actions>
</template>
<script setup>
import AppPageTitle from "@/layouts/AppPageTitle.vue"
import CardWithActions from "@/components/CardWithActions.vue"
import { computed, onMounted, shallowRef } from "vue"
import { useRoute, useRouter } from "vue-router"
import { employeeDetail } from "@/service/employees/employeeService.js"
import { shortDateFormat, transcript } from "@/utils/format.js"
import { employeeDictionary } from "@/service/employees/dictionaryService.js"
import Avatar from "@/components/avatar/Avatar.vue"
import { useStore } from "vuex"
import { hasPermission, PERMISSIONS } from "@/utils/Permission"

const store = useStore()
const route = useRoute()
const router = useRouter()

const employee = shallowRef({})
const departmentList = shallowRef({})
const postList = shallowRef({})

const canEdit = hasPermission(PERMISSIONS.EMPLOYEE.EDIT)

onMounted(() => {
  employeeDetail(route.params.id).then(res => {
    employee.value = res.employee
  })

  employeeDictionary("department").then(res => {
    departmentList.value = res.items.map(item => ({ ...item, value: item.id }))
  })

  employeeDictionary("post").then(res => {
    postList.value = res.items.map(item => ({ ...item, value: item.id }))
  })
})

const handleBack = () => {
  router.go(-1)
}

const redirectEdit = () => {
  router.push(`/employee/edit/${route.params.id}`)
}

const configActions = canEdit.value
  ? [
      {
        icon: "mdi-pencil",
        title: "Редактировать",
        handleFunc: redirectEdit
      },
      {
        icon: "mdi-close",
        title: "Закрыть",
        handleFunc: handleBack
      }
    ]
  : [
      {
        icon: "mdi-close",
        title: "Закрыть",
        handleFunc: handleBack
      }
    ]
</script>
