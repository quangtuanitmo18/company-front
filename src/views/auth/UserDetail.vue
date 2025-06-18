<template>
  <app-page-title iconClassname="mdi-account" title="Профиль пользователя"></app-page-title>
  <card-with-actions :title="`${user.fio}`" :subtitle="user.email" :actions="user.enabled ? configActionsBlock : configActionsUnblock" :key="cardKey">
    <modal v-model="dialogBlockConfirm" title="Подтверждение действия" text="Вы действительно хотите заблокировать пользователя?">
      <template #actions>
        <btn-secondary @click="dialogBlockConfirm = false">
          Закрыть
        </btn-secondary>
        <btn-primary @click="handleBlock">
          Заблокировать
        </btn-primary>
      </template>
    </modal>
    <modal v-model="dialogUnblockConfirm" title="Подтверждение действия" text="Вы действительно хотите разблокировать пользователя??">
      <template #actions>
        <btn-secondary @click="dialogUnblockConfirm = false">
          Закрыть
        </btn-secondary>
        <btn-primary @click="handleUnblock">
          Разблокировать
        </btn-primary>
      </template>
    </modal>
    <v-table class="mt-4 table-view">
      <tbody>
      <tr>
        <td>Логин</td>
        <td>
          <v-row>
            {{ user.username }}
          </v-row>
        </td>
      </tr>
      <tr>
        <td>Email</td>
        <td>
          <v-row>
            {{ user.email }}
          </v-row>
        </td>
      </tr>
      <tr>
        <td>Фамилия</td>
        <td>
          <v-row>
            {{ user.surname }}
          </v-row>
        </td>
      </tr>
      <tr>
        <td>Имя</td>
        <td>
          <v-row>
            {{ user.firstname }}
          </v-row>
        </td>
      </tr>
      <tr>
        <td>Отчество</td>
        <td>
          <v-row>
            {{ user.lastname }}
          </v-row>
        </td>
      </tr>
      <tr>
        <td>E-mail</td>
        <td>
          <v-row>
            {{ user.email }}
          </v-row>
        </td>
      </tr>
      <tr>
        <td style="vertical-align: top;">Роль пользователя</td>
        <td>
          <v-row
              v-for="(roles, title) in groupedRoles"
              :key="title"
          >
            <v-col cols="12" md="12">
              <h3 style="color: #27394e;">{{ title }}</h3>
              <p v-for="role in roles" :key="role.id">
                <span><v-icon size="x-small" icon="mdi-check" /></span>   {{ role.title }}
              </p>

            </v-col>
          </v-row>
        </td>
      </tr>
      </tbody>
    </v-table>
    <div v-if="notion" class="form-notion mt-4">
      <p class="form-notion-text" :class="{[notion.status]: true}">{{ notion.text }}</p>
    </div>
  </card-with-actions>
</template>

<script setup>

import AppPageTitle from "@/layouts/AppPageTitle.vue";
import CardWithActions from "@/components/CardWithActions.vue";

import { useRouter, useRoute } from "vue-router";
import {computed, onMounted, ref, shallowRef} from "vue";
import {userBlock, userDetail, userUnblock} from "@/service/auth/users/userService.js";
import Modal from "@/components/Modal.vue";
import {BtnPrimary, BtnSecondary} from "@/components/buttons/index.js";
import {useStore} from "vuex";

const router = useRouter()
const route = useRoute()
const store = useStore()
const user = shallowRef({})
const cardKey = ref(0)
const dialogBlockConfirm = ref(false)
const dialogUnblockConfirm = ref(false)
const projectRoles = ref([])
const notion = ref(null)
const activeUser = computed(() => store.getters["auth/user"])

const handleBack = () => {
  router.go(-1)
}

const handleNavigate = () => {
  router.push(`/auth/user/update/${route.params.id}`)
}

const handleBlockConfirm = () => {
  if (activeUser.value.username === user.value.username) {
    notion.value = {
      status: "error",
      text: "Нельзя заблокировать пользователя!"
    }
  } else {
    dialogBlockConfirm.value = true;
  }
}

const handleUnblockConfirm = () => {
  dialogUnblockConfirm.value = true;
}

const handleBlock = () => {
  userBlock(route.params.id).then(res => {
    user.value = res.user
    dialogBlockConfirm.value = false
    cardKey.value++

  })
}

const handleUnblock = () => {
  userUnblock(route.params.id).then(res => {
    user.value = res.user
    dialogUnblockConfirm.value = false
    cardKey.value++
  })
}

const configActionsBlock = [
  {
    icon: "mdi-pencil",
    title: "Редактировать",
    handleFunc: handleNavigate
  },
  {
    icon: "mdi-shield-lock",
    title: "Заблокировать пользователя",
    handleFunc: handleBlockConfirm
  },
  {
    icon: "mdi-close",
    title: "Закрыть",
    handleFunc: handleBack
  }
]

const configActionsUnblock = [
  {
    icon: "mdi-pencil",
    title: "Редактировать",
    handleFunc: handleNavigate
  },
  {
    icon: "mdi-shield-check-outline",
    type: "danger",
    title: "Разблокировать пользователя",
    handleFunc: handleUnblockConfirm
  },
  {
    icon: "mdi-close",
    title: "Закрыть",
    handleFunc: handleBack
  }
]

const groupedRoles = computed(() => {
  return projectRoles.value.reduce((acc, role) => {
    const projectTitle = role.project.title;

    if (!acc[projectTitle]) {
      acc[projectTitle] = [];
    }

    acc[projectTitle].push(role);
    return acc;
  }, {});
});

onMounted(() => {
  userDetail(route.params.id).then(res => {
    user.value = res.user
    projectRoles.value = res.user.projectRoles
  })
})

</script>

<style scoped lang="scss">

</style>