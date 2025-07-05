<!-- src/components/Profile.vue -->
<template>
  <div class="body">
    <!-- Header -->
    <template v-if="!loading">
      <v-card>
        <div class="mb-4" elevation="2">
          <v-card-title class="text-center">
            <h1 class="text-h4">@{{ user.username }}</h1>
          </v-card-title>
          <div class="text-center">
            <v-chip :color="user.enabled ? 'green' : 'red'">
              Статус: {{ user.enabled ? "активен" : "неактивен" }}
            </v-chip>
          </div>
        </div>

        <v-divider></v-divider>

        <!-- Basic info -->
        <v-row>
          <v-col cols="12" md="6">
            <v-card-text>
              <v-list-item>
                <v-list-item-title><strong>Email:</strong></v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>Ф.И.О:</strong></v-list-item-title>
                <v-list-item-subtitle>{{ user.fio }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>Дата создания:</strong></v-list-item-title>
                <v-list-item-subtitle>{{
                  shortDateHourFormat(user.dttmCreated)
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-card-text>
          </v-col>
          <v-col cols="12" md="6">
            <v-card-text>
              <v-list-item>
                <v-list-item-title><strong>Последнее обновление:</strong></v-list-item-title>
                <v-list-item-subtitle>{{
                  shortDateHourFormat(user.dttmUpdate)
                }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>Подследний вход:</strong></v-list-item-title>
                <v-list-item-subtitle>{{
                  shortDateHourFormat(user.dttmLastAuthorization)
                }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title
                  ><strong>Доступ к нескольким аккаунтам:</strong></v-list-item-title
                >
                <v-list-item-subtitle>{{
                  user.multipleAccess ? "Да" : "Нет"
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-card-text>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- Project Roles -->
        <div class="ml-4">
          <v-card-text>
            <v-table class="table-view">
              <tbody>
                <tr>
                  <v-list-item-title><strong>Проектные роли:</strong></v-list-item-title>
                  <td>
                    <v-row v-for="(roles, title) in groupedRoles" :key="title">
                      <v-col cols="12" md="12">
                        <h3 style="color: #27394e">{{ title }}</h3>
                        <p v-for="role in roles" :key="role.id">
                          <span><v-icon icon="mdi-check" /></span> {{ role.title }}
                        </p>
                      </v-col>
                    </v-row>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </div>
        <div class="card-footer d-flex justify-end mt-4">
          <v-btn class="ma-4 mt-0" color="primary" variant="outlined" @click="handleBack">
            Назад
          </v-btn>
        </div>
      </v-card>
    </template>
    <template v-else>
      <div style="clear: both"></div>
      <div class="text-center pb-10">
        <v-progress-circular indeterminate class="color-primary" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { userProfile } from "@/service/homeService"
import { shortDateHourFormat } from "@/utils/format.js"
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const user = ref({})
const loading = ref(false)
const projectRoles = ref([])

const handleBack = () => {
  router.go(-1)
}

const groupedRoles = computed(() => {
  return projectRoles.value.reduce((acc, role) => {
    const projectTitle = role.project.title

    if (!acc[projectTitle]) {
      acc[projectTitle] = []
    }

    acc[projectTitle].push(role)
    return acc
  }, {})
})

onMounted(() => {
  loading.value = true
  userProfile()
    .then(res => {
      user.value = res.user
      projectRoles.value = res.user.projectRoles
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
