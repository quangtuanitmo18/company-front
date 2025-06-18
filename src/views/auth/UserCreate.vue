<template>
  <app-page-title iconClassname="mdi-account-plus-outline" title="Создать пользователя"></app-page-title>
  <card-with-actions title="" :actions="configActions">
    <v-form ref="form" class="mt-4">
      <v-row>
        <v-col cols="12" md="5">
          <v-row>
            <v-col cols="12" md="11">
              <v-row>
                <v-col cols="12" md="12">
                  <h4>Логин</h4>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <username-field
                      v-model="user.username"
                      :rules = "[
                        v => /^\w+$/.test(v) || 'Допустимы только буквы, цифры и подчёркивание'
                      ]"
                  ></username-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <password-field
                      variant="underlined"
                      v-model="user.pass"
                      :rules="[
                (v) => !!v || 'Это обязательное поле.',
                (v) => v.length >= 8 || 'Пароль не может быть короче 8-ми символов.',
              ]"
                      label="Пароль *"
                  ></password-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <password-confirm-field
                      variant="underlined"
                      v-model="passwordConfirm"
                      :password="user.pass"
                      label="Пароль *"
                  ></password-confirm-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="12" md="7">
          <v-row class="justify-end">
            <v-col cols="12" md="11">
              <v-row>
                <v-col cols="12" md="12">
                  <h4>Данные пользователя</h4>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                      variant="underlined"
                      v-model="user.email"
                      :rules="[
                v =>  !!v || 'Это обязательное поле.',
                v => !!(/.+@.+\..+/.test(v)) || 'Email не правильный.'
              ]"
                      label="Email *"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                      variant="underlined"
                      v-model="user.surname"
                      :rules="[v =>  !!v || 'Это обязательное поле.']"
                      label="Фамилия *"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      variant="underlined"
                      v-model="user.firstname"
                      :rules="[v =>  !!v || 'Это обязательное поле.']"
                      label="Имя *"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      variant="underlined"
                      v-model="user.lastname"
                      label="Отчество"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <p>* - обязательное поле</p>
        </v-col>
      </v-row>
      <div v-if="notion" class="form-notion mt-4">
        <p class="form-notion-text" :class="{[notion.status]: true}">{{ notion.text }}</p>
        <error-list :errors="errors" />
      </div>
    </v-form>
    <template v-slot:action>
      <btn-primary class="ml-2" :loading="loadingSave" @click="handleSubmit">
        Создать
      </btn-primary>
    </template>
  </card-with-actions>
</template>

<script setup>

import AppPageTitle from "@/layouts/AppPageTitle.vue";
import CardWithActions from "@/components/CardWithActions.vue";
import { useRouter, useRoute } from "vue-router";
import {onMounted, ref, watch} from "vue";
import {DEPARTMENTS_LIST, FILTER_USER_STATUS, OPERATOR_STATUS} from "@/utils/dictionary.js";
import {BtnPrimary} from "@/components/buttons/index.js";
import {userCreate, userRoleList, userRoleListByGroupForFilter} from "@/service/auth/users/userService.js";
import {
  PasswordConfirmField,
  PasswordField,
  PhoneField,
  SelectByGroup, SelectByGroupField,
  UsernameField
} from "@/components/formFields/index.js";
import ErrorList from "@/components/notifications/ErrorList.vue";
import {printErrors} from "@/utils/handleErrors.js";

const router = useRouter()
const route = useRoute()
const errors = ref([])
const user = ref({
  username: "",
  email: "",
  pass: "",
  surname: "",
  firstname: "",
  lastname: ""
})
const passwordConfirm = ref("")
const form = ref(null)
const notion = ref(null)
const loadingSave = ref(false)
const roleSelect = ref([])

const handleBack = () => {
  router.go(-1)
}

const handleSubmit = async () => {
  const { valid } = await form.value.validate()

  if(!valid) return

  loadingSave.value = true
  userCreate(user.value).then(res => {
    window.location.href = "/auth"
  }).then(res => {
    notion.value = {
      status: "success",
      text: "Пользователь успешно создан."
    }
    user.value = res.user
  }).catch(err => {
    if (err.validationErrors) {
      errors.value = printErrors(err.validationErrors)
    } else {
      errors.value.push(err)
    }

  }).finally(() => {
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
  userRoleListByGroupForFilter().then(res => {
    roleSelect.value = res
  })
})

</script>

<style scoped>
  .justify-end {
    display: flex;
    justify-content: flex-end;
  }
</style>