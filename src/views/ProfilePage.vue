<!-- src/components/Profile.vue -->
<template>
  <div class="body">
    <!-- Header -->
    <v-card>

      <div class="mb-4" elevation="2">
        <v-card-title class="text-center">
          <h1 class="text-h4">@{{ user.username }}</h1>
        </v-card-title>
        <div class="text-center">
          <v-chip :color="user.enabled ? 'green' : 'red'">
            Статус: {{ user.enabled ? 'активен' : 'неактивен' }}
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
                <v-list-item-subtitle>{{ shortDateHourFormat(user.dttmCreated) }}</v-list-item-subtitle>
              </v-list-item>
            </v-card-text>
        </v-col>
        <v-col cols="12" md="6">
            <v-card-text>
              <v-list-item>
                <v-list-item-title><strong>Последнее обновление:</strong></v-list-item-title>
                <v-list-item-subtitle>{{ shortDateHourFormat(user.dttmUpdate) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>Подследний вход:</strong></v-list-item-title>
                <v-list-item-subtitle>{{ shortDateHourFormat(user.dttmLastAuthorization) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>Доступ к нескольким аккаунтам:</strong></v-list-item-title>
                <v-list-item-subtitle>{{ user.multipleAccess ? 'Да' : 'Нет' }}</v-list-item-subtitle>
              </v-list-item>
            </v-card-text>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <!-- Project Roles -->
      <div>
        <v-card-title class="pl-8">Проектные роли</v-card-title>
        <v-card-text>
          <v-table class="table-view">
            <tbody>
              <tr v-for="role in user.projectRoles">
                <td>{{ role.project.title }}</td>
                <td>{{ role.title }}</td>
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
  </div>
</template>

<script setup>
import {shortDateHourFormat, transcript} from "@/utils/format.js";
import {useStore} from "vuex";
import {computed} from "vue";
import {useRouter} from "vue-router";

const store = useStore()
const router = useRouter()

const user = computed(() => store.getters["auth/user"])

const handleBack = () => {
  router.go(-1)
}
</script>
