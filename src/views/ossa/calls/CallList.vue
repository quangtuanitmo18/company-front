<template>
  <app-page-title iconClassname="mdi-phone" title="Список звонков"></app-page-title>
  <v-card class="px-4 py-4">
    <Tabs :configTabs="configTabs" />
  </v-card>
</template>
<script setup>
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import CallListAll from "@/views/ossa/calls/CallListAll.vue";
import CallListIncoming from "@/views/ossa/calls/CallListIncoming.vue";
import CallListOutgoing from "@/views/ossa/calls/CallListOutgoing.vue";
import Tabs from "@/components/Tabs.vue";

const configTabs = [
  {
    value: "calls-all",
    title: "Все звонки",
    component: CallListAll
  },
  {
    value: "calls-incoming",
    title: "Входящие звонки",
    component: CallListIncoming
  },
  {
    value: "calls-outgoing",
    title: "Исходящие звонки",
    component: CallListOutgoing
  },
]
</script>
