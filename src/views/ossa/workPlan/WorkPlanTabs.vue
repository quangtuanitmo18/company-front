<template>
  <app-page-title iconClassname="mdi-calendar-text-outline" title="План работы"></app-page-title>
  <v-card class="px-4 py-4">
    <Tabs :configTabs="configTabs" />
  </v-card>
</template>
<script setup>
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import Tabs from "@/components/Tabs.vue";
import WorkPlan from "@/views/ossa/workPlan/WorkPlan.vue";
import EventDoToday from "@/views/ossa/workPlan/EventDoList.vue";

const configTabs = [
  {
    value: "work-plan",
    title: "Рабочий план",
    component: WorkPlan
  },
  {
    value: "event-today",
    title: "Комментарии",
    component: EventDoToday
  }
]
</script>
