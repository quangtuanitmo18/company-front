<template>
  <app-page-title iconClassname="mdi-check" title="Детали роли"></app-page-title>
  <card-with-actions
    :title="`${role?.title}`"
    :subtitle="`${role?.description}`"
    :actions="configActions"
  >
    <v-table class="mt-4 table-view">
      <tbody>
        <tr>
          <td>Роль</td>
          <td>{{ role.title }}</td>
        </tr>
        <tr>
          <td>Описание</td>
          <td>{{ role.description }}</td>
        </tr>
        <tr>
          <td>Статус</td>
          <td>{{ role.enabled ? "Активна" : "Неактивна" }}</td>
        </tr>
        <tr>
          <td>По умолчанию</td>
          <td>{{ role.isDefault ? "Да" : "Нет" }}</td>
        </tr>
        <tr>
          <td>Проект</td>
          <td>{{ role.project ? role.project.title : "" }}</td>
        </tr>
        <tr>
          <td>Действие</td>
          <td>
            <p v-if="role.actions" v-for="action in role.actions">
              {{ action.title }}
            </p>
          </td>
        </tr>
      </tbody>
    </v-table>
  </card-with-actions>
</template>

<script setup>
import CardWithActions from "@/components/CardWithActions.vue"
import AppPageTitle from "@/layouts/AppPageTitle.vue"

import { userRoleDetail } from "@/service/auth/users/userService.js"
import { onMounted, shallowRef } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()
const role = shallowRef({})

const handleBack = () => {
  router.go(-1)
}

const handleNavigate = () => {
  router.push(`/auth/role/update/${route.params.id}`)
}

const configActions = [
  {
    icon: "mdi-pencil",
    title: "Редактировать",
    handleFunc: handleNavigate
  },
  {
    icon: "mdi-close",
    title: "Закрыть",
    handleFunc: handleBack
  }
]

onMounted(() => {
  userRoleDetail(route.params.id).then(res => {
    role.value = res.role
  })
})
</script>

<style scoped lang="scss"></style>
