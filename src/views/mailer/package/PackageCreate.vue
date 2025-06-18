<template>
  <app-page-title iconClassname="mdi-account-plus-outline" title="Создать новый пакет"></app-page-title>
  <card-with-actions title="" :actions="configActions">
    <v-form ref="form" class="mt-4">
      <v-row>
        <v-col cols="12" md="12">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                  variant="underlined"
                  v-model="mailerPackageSro"
                  :items="mailerPackageSroList"
                  :rules="[(v) => !!v || 'Это обязательное поле.']"
                  label="СРО"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                  variant="underlined"
                  v-model="mailerPackage.type"
                  :items="mailerPackageTypeList"
                  :rules="[(v) => !!v || 'Это обязательное поле.']"
                  label="Тип пакета"
              ></v-select>

            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-checkbox
                  v-model="mailerPackage.autoGenerate"
                  label="Запустить автоматическую генерацию документов в фоне, после создания нового пакета рассылки"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-checkbox
                  v-model="mailerPackage.autoSend"
                  label="Запустить автоматическую рассылку в фоне, после генерации документов"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div v-if="notion" class="form-notion mt-4">
        <p class="form-notion-text" :class="{[notion.status]: true}">{{ notion.text }}</p>
      </div>
    </v-form>
    <template v-slot:action>
      <btn-primary :loading="loading" class="ml-2" @click="handleSubmit">
        Создать
      </btn-primary>
    </template>
  </card-with-actions>
</template>

<script setup>
import CardWithActions from "@/components/CardWithActions.vue";
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {sroOrgListForFilterMailer} from "@/service/ossa/clients/sroOrganizationService.js";
import BtnPrimary from "../../../components/buttons/BtnPrimary.vue";
import {packageAdd, typePackageDictionaryFilterMailer} from "@/service/mailer/packageService.js";

const router = useRouter()

const form = ref(null)
const notion = ref(null)
const loading = ref(false)
const mailerPackageSro = ref(null)
const mailerPackageSroList = ref()
const mailerPackageTypeList = ref()
const mailerPackage = ref({
  "type": null,
  "autoGenerate": false,
  "autoSend": false

})

const handleBack = () => {
  router.go(-1)
}

const handleSubmit = async () => {
  const {valid} = await form.value.validate()

  if (!valid) return

  loading.value = true

  const data = {
    ...mailerPackage.value,
  }

  packageAdd(mailerPackageSro.value, data).then(res => {
    location.replace('/mailer')
  }).catch(err => {
    notion.value = {
      status: "error",
      text: err
    }
  }).finally(() => {
    loading.value = false
  })

  loading.value = false
}

const configActions = [
  {
    icon: "mdi-close",
    handleFunc: handleBack
  }
]

onMounted(() => {
  sroOrgListForFilterMailer().then(res => {
    mailerPackageSroList.value = res
  })

  typePackageDictionaryFilterMailer().then(res => {
    mailerPackageTypeList.value = res
  })
})
</script>

<style scoped lang="scss">

</style>