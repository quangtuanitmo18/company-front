<template>
  <app-page-title
    iconClassname="mdi-account"
    title="Профиль пользователя"
    subtitle="Редактировать"
  ></app-page-title>
  <card-with-actions
    :title="`${user.surname} ${user.firstname} ${user.lastname}`"
    :actions="configActions"
  >
    <v-form ref="form" class="mt-4">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            variant="underlined"
            v-model="user.surname"
            :rules="[v => !!v || 'Это обязательное поле.']"
            label="Фамилия"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            variant="underlined"
            v-model="user.firstname"
            :rules="[v => !!v || 'Это обязательное поле.']"
            label="Имя"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            variant="underlined"
            v-model="user.lastname"
            label="Отчество"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field
            variant="underlined"
            v-model="user.email"
            :rules="[
              v => !!v || 'Это обязательное поле.',
              v => !!/.+@.+\..+/.test(v) || 'Почта не правильная.'
            ]"
            label="Почта"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <checkbox-group-by-block
            :key="checkBoxGroupId"
            v-model="user.projectRoles"
            @checkbox-state="handleCheckBox"
            :items="projectRolesList"
            :multiple="true"
          />
        </v-col>
      </v-row>
      <v-row v-if="isOssa">
        <v-col cols="12" md="12" class="mt-6">
          <v-expansion-panels v-model="panel">
            <v-expansion-panel>
              <v-expansion-panel-title class="panel-header">
                <template v-slot:default="{ expanded }">
                  <h4 class="panel-section-header">
                    <v-icon icon="mdi-menu-down"></v-icon>
                    <span class="panel-section-header-text">Данные для пользователя OSSA</span>
                  </h4>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <ossa-phone-field
                      v-model="user.ossaProjectData.telephoneNumber"
                      :rules="[v => !!v || 'Это обязательное поле.']"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <ossa-phone-field
                      v-model="user.ossaProjectData.mobileNumber"
                      :rules="[v => !!v || 'Это обязательное поле.']"
                      :type="'mobile'"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      variant="underlined"
                      v-model="user.ossaProjectData.sqlupUserIdIgs"
                      :rules="[v => !!v || 'Это обязательное поле.']"
                      label="ID IGS *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      variant="underlined"
                      v-model="user.ossaProjectData.sqlupUserIdCso"
                      :rules="[v => !!v || 'Это обязательное поле.']"
                      label="ID CSO *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      variant="underlined"
                      v-model="user.ossaProjectData.sqlupUserIdSsp"
                      :rules="[v => !!v || 'Это обязательное поле.']"
                      label="ID SSP *"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      variant="underlined"
                      v-model="user.ossaProjectData.isOperator"
                      :rules="[v => (v !== null && v !== undefined) || 'Это обязательное поле.']"
                      :items="OPERATOR_STATUS"
                      item-text="title"
                      item-value="value"
                      label="Является специалистом *"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      variant="underlined"
                      v-model="user.ossaProjectData.operatorDepartment"
                      :rules="[v => !!v || 'Это обязательное поле.']"
                      :items="DEPARTMENTS_LIST"
                      label="Отдел *"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <p>* - обязательное поле</p>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <div v-if="notion || errors.length" class="form-notion mt-4">
        <p v-if="notion" class="form-notion-text" :class="{ [notion.status]: true }">
          {{ notion.text }}
        </p>
        <error-list v-if="errors" :errors="errors" />
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
import CheckboxGroupByBlock from "@/components/formFields/CheckboxGroupByBlock.vue"
import OssaPhoneField from "@/components/formFields/OssaPhoneField.vue"
import ErrorList from "@/components/notifications/ErrorList.vue"
import {
  userDetail,
  userRoleListByGroupForFilter,
  userUpdate
} from "@/service/auth/users/userService.js"
import { DEPARTMENTS_LIST, OPERATOR_STATUS } from "@/utils/dictionary.js"
import { printErrors } from "@/utils/handleErrors.js"
import { onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()
const user = ref({})
const form = ref(null)
const notion = ref(null)
const errors = ref([])
const loadingSave = ref(false)
const projectRoles = ref([])
const projectRolesList = ref([])
const checkBoxGroupId = ref(1)
const projectRoleCheckbox = ref([])
const ossaRoles = ref([])
const isOssa = ref()
const panel = ref([0])

const handleBack = () => {
  router.go(-1)
}

const configActions = [
  {
    icon: "mdi-close",
    handleFunc: handleBack
  }
]

const handleCheckBox = (checkboxValue, checkboxState) => {
  const index = projectRoleCheckbox.value.findIndex(item => item === checkboxValue)

  if (checkboxState) {
    if (index < 0) {
      projectRoleCheckbox.value.push(checkboxValue)
    }
  } else {
    if (index >= 0) {
      projectRoleCheckbox.value.splice(index, 1)
    }
  }
}

const handleSubmit = async () => {
  const { valid } = await form.value.validate()

  if (!valid) return
  loadingSave.value = true

  userUpdate(route.params.id, {
    surname: user.value.surname,
    firstname: user.value.firstname,
    lastname: user.value.lastname,
    email: user.value.email,
    enabled: user.value.enabled,
    projectRoles: user.value.projectRoles,
    ossaProjectData: {
      telephoneNumber: user.value.ossaProjectData.telephoneNumber,
      mobileNumber: user.value.ossaProjectData.mobileNumber,
      sqlupUserIdIgs: user.value.ossaProjectData.sqlupUserIdIgs,
      sqlupUserIdCso: user.value.ossaProjectData.sqlupUserIdCso,
      sqlupUserIdSsp: user.value.ossaProjectData.sqlupUserIdSsp,
      isOperator: user.value.ossaProjectData.isOperator,
      operatorDepartment: user.value.ossaProjectData.operatorDepartment
    }
  })
    .then(res => {
      errors.value = []
      notion.value = {
        status: "success",
        text: "Данные пользователя успешно обновлены."
      }

      userDetail(route.params.id).then(res => {
        projectRoles.value = []

        res.user.projectRoles.forEach(item => {
          projectRoles.value.push(item.id)
        })

        user.value = {
          ...res.user,
          firstname: res.user.firstname || "",
          lastname: res.user.lastname || "",
          surname: res.user.surname || "",
          email: res.user.email || "",
          projectRoles: projectRoles.value || [],
          ossaProjectData: {
            telephoneNumber:
              (res.user.ossaProjectData && res.user.ossaProjectData.telephoneNumber) || "",
            mobileNumber: (res.user.ossaProjectData && res.user.ossaProjectData.mobileNumber) || "",
            sqlupUserIdIgs:
              (res.user.ossaProjectData && res.user.ossaProjectData.sqlupUserIdIgs) || "",
            sqlupUserIdCso:
              (res.user.ossaProjectData && res.user.ossaProjectData.sqlupUserIdCso) || "",
            sqlupUserIdSsp:
              (res.user.ossaProjectData && res.user.ossaProjectData.sqlupUserIdSsp) || "",
            isOperator: (res.user.ossaProjectData && res.user.ossaProjectData.isOperator) || 0,
            operatorDepartment:
              (res.user.ossaProjectData && res.user.ossaProjectData.operatorDepartment) || null
          }
        }

        checkBoxGroupId.value = checkBoxGroupId.value + 1
      })
    })
    .catch(err => {
      notion.value = null
      console.log(err)
      if (err.ossaDuplicateErrors) {
        errors.value = printErrors(err.ossaDuplicateErrors)
      } else {
        errors.value.push(err)
      }
    })
    .finally(() => {
      loadingSave.value = false
    })
}

onMounted(async () => {
  const roleResponse = await userRoleListByGroupForFilter()

  roleResponse.forEach(item => {
    if (!item.props) {
      projectRoleCheckbox.value.push(item.value)
      projectRolesList.value.push({
        code: item.value,
        title: item.title,
        project: item.project
      })

      if (item.project === "ОССА") {
        ossaRoles.value.push(item.value)
      }
    } else {
      projectRolesList.value.push({
        blockTitle: item.props.header
      })
    }
  })

  const userResponse = await userDetail(route.params.id)
  projectRoles.value = userResponse.user.projectRoles.map(role => role.id)

  user.value = {
    ...userResponse.user,
    firstname: userResponse.user.firstname || "",
    lastname: userResponse.user.lastname || "",
    surname: userResponse.user.surname || "",
    email: userResponse.user.email || "",
    projectRoles: projectRoles.value, // Directly assign the mapped roles
    ossaProjectData: {
      telephoneNumber: userResponse.user.ossaProjectData?.telephoneNumber || "",
      mobileNumber: userResponse.user.ossaProjectData?.mobileNumber || "",
      sqlupUserIdIgs: userResponse.user.ossaProjectData?.sqlupUserIdIgs || "",
      sqlupUserIdCso: userResponse.user.ossaProjectData?.sqlupUserIdCso || "",
      sqlupUserIdSsp: userResponse.user.ossaProjectData?.sqlupUserIdSsp || "",
      isOperator: userResponse.user.ossaProjectData?.isOperator || 0,
      operatorDepartment: userResponse.user.ossaProjectData?.operatorDepartment || null
    }
  }
})

watch(
  () => user.value.projectRoles,
  newRoles => {
    isOssa.value = Array.isArray(newRoles) && newRoles.some(role => ossaRoles.value.includes(role))
  }
)
</script>

<style scoped lang="scss"></style>
