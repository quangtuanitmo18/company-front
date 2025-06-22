<template>
  <app-page-title iconClassname="mdi-email-multiple" title="Рассылка"></app-page-title>
  <v-card class="px-4 py-4">
    <v-row>
      <v-col cols="12" md="12" class="mb-6">
        <v-expansion-panels v-model="panel">
          <v-expansion-panel>
            <v-expansion-panel-title class="panel-header">
              <template v-slot:default="{ expanded }">
                <h4 class="panel-section-header">
                  <v-icon icon="mdi-menu-down"></v-icon>
                  <span class="panel-section-header-text">Данные для рассылки</span>
                </h4>
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row class="pt-2">
                <v-col cols="12" md="3">
                  <p class="mr-1 font-weight-bold">Тип:</p>
                </v-col>
                <v-col cols="12" md="3">
                  {{ headerInfo?.package?.packageType.typeName }}
                </v-col>
                <v-col cols="12" md="3">
                  <p class="mr-1 font-weight-bold">Статус:</p>
                </v-col>
                <v-col cols="12" md="3">
                  {{ headerInfo?.package?.packageStatus.statusName }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="3">
                  <p class="mr-1 font-weight-bold">CPO:</p>
                </v-col>
                <v-col cols="12" md="3">
                  {{ headerInfo?.package?.sroOrganization.title }}
                </v-col>
                <v-col cols="12" md="3">
                  <p class="mr-1 font-weight-bold">Дата создания:</p>
                </v-col>
                <v-col cols="12" md="3">
                  {{ shortDateFormat(headerInfo?.package?.dttmCreated) }}
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <Tabs :configTabs="configTabs" :data="{ headerInfo: headerInfo }" />

    <div class="card-footer d-flex justify-end mt-4">
      <v-btn color="primary" variant="outlined" @click="handleBack"> Назад </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import AppPageTitle from "@/layouts/AppPageTitle.vue"
import { packageDetails } from "@/service/mailer/packageService.js"
import { onMounted, ref } from "vue"

import Tabs from "@/components/Tabs.vue"
import { shortDateFormat } from "@/utils/format.js"
import { useRoute, useRouter } from "vue-router"
import PackageMembers from "./PackageMembers.vue"
import PackageStatusDelivery from "./PackageStatusDelivery.vue"
import PackageStatusMailing from "./PackageStatusMailing.vue"

const route = useRoute()
const router = useRouter()

const headerInfo = ref({})
const panel = ref([0])

const configTabs = [
  {
    value: "members",
    title: "Список участников",
    component: PackageMembers
  },
  {
    value: "mailStatus",
    title: "Статусы отправки писем",
    component: PackageStatusMailing
  },
  {
    value: "deliveryStatus",
    title: "Статусы отправки пакета",
    component: PackageStatusDelivery
  }
]
const handleBack = () => {
  router.go(-1)
}

onMounted(async () => {
  headerInfo.value = await packageDetails(route.params.id)
})
</script>
