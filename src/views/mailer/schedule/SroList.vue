<template>
  <app-page-title iconClassname="mdi-send-clock" title="Расписания"></app-page-title>
  <template v-if="!isLoading">
    <v-card class="px-4 py-4">
      <sro-schedule :sro-list="sroList" />
    </v-card>
  </template>
  <template v-else>
    <div style="clear: both"></div>
    <div class="text-center pb-10">
      <v-progress-circular indeterminate class="color-primary" />
    </div>
  </template>
</template>

<script setup>
import AppPageTitle from '@/layouts/AppPageTitle.vue'
import { sroOrgListMailer } from '@/service/ossa/clients/sroOrganizationService.js'
import SroSchedule from '@/views/mailer/schedule/components/SroSchedule.vue'
import { onMounted, ref } from 'vue'

const sroList = ref([])
const isLoading = ref(true)

onMounted(() => {
  sroOrgListMailer().then(res => {
    sroList.value = res.items
    isLoading.value = false
  })
})
</script>

<style scoped lang="scss"></style>
