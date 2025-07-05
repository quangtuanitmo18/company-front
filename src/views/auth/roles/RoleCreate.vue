<template>
  <app-page-title iconClassname="mdi-check" title="Создать роль"></app-page-title>
  <card-with-actions title="" :actions="configActions">
    <v-form ref="form" class="mt-4">
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            variant="underlined"
            v-model="role.project"
            :rules="[v => !!v || 'Это обязательное поле.']"
            :items="projectSelect"
            label="Проект"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            variant="underlined"
            v-model="role.title"
            :rules="[v => !!v || 'Это обязательное поле.']"
            label="Роль"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
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

      <div v-if="notion" class="form-notion mt-4">
        <p class="form-notion-text" :class="{ [notion.status]: true }">{{ notion.text }}</p>
      </div>
    </v-form>
    <template v-slot:action>
      <btn-primary class="ml-2" :loading="loadingSave" @click="handleSubmit"> Создать </btn-primary>
    </template>
  </card-with-actions>
</template>

<script setup>
import { BtnPrimary } from "@/components/buttons/index.js"
import CardWithActions from "@/components/CardWithActions.vue"
import AppPageTitle from "@/layouts/AppPageTitle.vue"
import { projectList } from "@/service/auth/users/projectService.js"
import { userRoleCreate } from "@/service/auth/users/userService.js"
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()

const role = ref({
  project: null,
  title: "",
  description: "",
  enabled: false,
  isDefault: true
})

const form = ref(null)
const notion = ref(null)
const loadingSave = ref(false)
const projectSelect = ref([])

const handleBack = () => {
  router.go(-1)
}

const handleSubmit = async () => {
  const { valid } = await form.value.validate()

  if (!valid) return

  loadingSave.value = true
  userRoleCreate(role.value)
    .then(res => {
      role.value = res.role
      router.push("/auth/role/update/" + res.role.id)
    })
    .then(res => {
      notion.value = {
        status: "success",
        text: "Роль успешно создан."
      }
      role.value = res.role
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

const configActions = [
  {
    icon: "mdi-close",
    handleFunc: handleBack
  }
]

onMounted(() => {
  projectList().then(res => {
    projectSelect.value = res.items.map(item => ({
      value: item.id,
      title: item.title
    }))
  })
})
</script>

<style scoped lang="scss"></style>
