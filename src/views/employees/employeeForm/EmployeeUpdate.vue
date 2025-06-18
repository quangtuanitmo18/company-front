<template>
  <app-page-title iconClassname="mdi-account-edit" title="Редактирование сотрудника"></app-page-title>
  <v-card class="pr-4 pb-4">
    <Tabs :vertical="true" :configTabs="configTabs" />
  </v-card>
</template>
<script setup>
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import Tabs from "@/components/Tabs.vue";
import EmployeeUpdateInfo from "@/views/employees/components/EmployeeUpdateInfo.vue";
import EmployeeUpdateVacations from "@/views/employees/components/EmployeeUpdateVacations.vue";

const configTabs = [
  {
    value: "employee-update-info",
    title: "Профиль",
    icon: "mdi-information",
    component: EmployeeUpdateInfo,
  },
  {
    value: "employee-update-vacations",
    title: "Отпуска",
    icon: "mdi-umbrella-beach",
    component: EmployeeUpdateVacations
  }
]
</script>