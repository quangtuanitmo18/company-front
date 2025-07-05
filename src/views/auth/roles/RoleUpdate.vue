<template>
  <app-page-title iconClassname="mdi-check" title="Роль" subtitle="Редактировать"></app-page-title>
  <card-with-actions :title="role.project ? role.project.title : ''" :actions="configActions">
    <v-form ref="form" class="mt-4">
      <v-row>
        <v-col cols="12" md="2">
          <v-select
            variant="underlined"
            v-model="role.enabled"
            :items="STATUS"
            label="Активна"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            variant="underlined"
            v-model="role.title"
            :rules="[v => !!v || 'Это обязательное поле.']"
            label="Роль"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            variant="underlined"
            v-model="role.description"
            label="Описание"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <v-checkbox v-model="role.isDefault" label="По умолчанию"></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="actions" cols="12" md="12">
          <checkbox-group-expanded
            :key="checkBoxGroupId"
            v-model="actionsCheckbox"
            @checkbox-state="handleCheckBox"
            :items="actions"
          />
        </v-col>
      </v-row>
      <div v-if="notion" class="form-notion mt-4">
        <p class="form-notion-text" :class="{ [notion.status]: true }">{{ notion.text }}</p>
      </div>
    </v-form>
    <template v-slot:action>
      <btn-primary class="ml-2" :loading="loadingSave" @click="handleSubmit">
        Применить
      </btn-primary>
    </template>
  </card-with-actions>
</template>

<script setup>
import AppPageTitle from "@/layouts/AppPageTitle.vue"

import { BtnPrimary } from "@/components/buttons/index.js"
import CardWithActions from "@/components/CardWithActions.vue"
import CheckboxGroupExpanded from "@/components/formFields/CheckboxGroupExpanded.vue"
import { actionsList } from "@/service/auth/users/actionsService.js"
import { userRoleDetail, userRoleUpdate } from "@/service/auth/users/userService.js"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()
const role = ref({})
const actions = ref([])
const roleActionsList = ref([])
const form = ref(null)
const notion = ref(null)
const loadingSave = ref(false)
const checkBoxGroupId = ref(1)
const actionsCheckbox = ref([])

const STATUS = [
  {
    value: true,
    title: "Да"
  },
  {
    value: false,
    title: "Нет"
  }
]

const handleBack = () => {
  router.go(-1)
}

const configActions = [
  {
    icon: "mdi-close",
    handleFunc: handleBack
  }
]

const handleSubmit = async () => {
  const { valid } = await form.value.validate()

  if (!valid) return
  loadingSave.value = true

  userRoleUpdate(route.params.id, {
    project: role.value.project.id,
    title: role.value.title,
    description: role.value.description,
    enabled: role.value.enabled,
    actions: actionsCheckbox.value
  })
    .then(res => {
      notion.value = {
        status: "success",
        text: "Данные пользователя успешно обновлены."
      }
      role.value = res.role

      // Update checkbox
      if (res.role && res.role.actions) {
        res.role.actions.forEach(item => {
          actionsCheckbox.value.push(item.id)
        })

        actionsList(role.value.project.id).then(res => {
          roleActionsList.value = [...res.items]
          actions.value = []

          roleActionsList.value.forEach(item => {
            actions.value.push({
              code: item.id,
              title: item.title,
              description: item.description
            })
          })
        })
      }
      location.href = "/auth/roles"
    })
    .catch(err => {
      notion.value = {
        status: "error",
        text: err
      }
    })
    .finally(() => {
      loadingSave.value = false
    })
}

const handleCheckBox = (checkboxValue, checkboxState) => {
  const index = actionsCheckbox.value.findIndex(item => item === checkboxValue)

  if (checkboxState) {
    if (index < 0) {
      actionsCheckbox.value.push(checkboxValue)
    }
  } else {
    if (index >= 0) {
      actionsCheckbox.value.splice(index, 1)
    }
  }
}

onMounted(() => {
  userRoleDetail(route.params.id).then(res => {
    role.value = {
      ...res.role
    }

    // Update checkbox
    if (res.role && res.role.actions) {
      res.role.actions.forEach(item => {
        actionsCheckbox.value.push(item.id)
      })

      actionsList(role.value.project.id).then(res => {
        roleActionsList.value = [...res.items]
        actions.value = []

        roleActionsList.value.forEach(item => {
          actions.value.push({
            code: item.id,
            title: item.title,
            description: item.description
          })
        })
      })
    }
  })
})
</script>

<style scoped lang="scss"></style>
