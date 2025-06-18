<template>
  <div class="container">
    <app-sidebar />
    <div class="content">
      <app-header />
      <div class="main">
        <router-view v-slot="{ Component }">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="route.fullPath"/>
          </keep-alive>
        </router-view>
      </div>
    </div>
    <audio-custom></audio-custom>
  </div>
</template>

<script setup>
import AppHeader from "./AppHeader.vue";
import { useRoute } from "vue-router";
import AudioCustom from "@/components/AudioCustom.vue";
import AppSidebar from "@/layouts/AppSidebar.vue";

const route = useRoute();

// Cached all list for table
const cachedViews = [
    // AUTH
    "UserList",
    "RoleList",

    // EMPLOYEES
    "EmployeeList",

    // OSSA
    "PanelMain",
    "WorkPlanTabs",
    "CallList",
    "AgentList",
    "EventDoGraphic",
    "CallGraphic",
]
</script>

<style lang="scss">
.container{
  display: flex;
}
.content{
  position: relative;
  flex: 1;
}
.main{
  background-color: #f1f4f6;
  padding: 20px;
  min-height: calc(100vh - 60px);
}
</style>