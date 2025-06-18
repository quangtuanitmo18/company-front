<template>
  <app-page-title iconClassname="mdi-book-alphabet" title="Список словарей"></app-page-title>
  <card-with-actions :noBack="false">
    <div class="d-flex flex-row dict-content">
      <v-tabs
          v-model="tab"
          class="color-primary mt-2 mb-3"
          direction="vertical"
      >
        <v-tab :prepend-icon="item.icon" v-for="(item, id) in configTabs" :key="id">
          <slot name="default">
            {{ item.title }}
          </slot>
        </v-tab>
      </v-tabs>
      <v-window class="w-100" v-model="tab">
        <v-window-item v-for="(item, id) in configTabs" :key="id" :value="item.value">
          <keep-alive>
            <component :is="item.component" />
          </keep-alive>
        </v-window-item>
      </v-window>
    </div>
  </card-with-actions>
</template>
<script setup>
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import CardWithActions from "@/components/CardWithActions.vue";
import EmployeePositions from "@/views/employees/employeeDict/EmployeePositions.vue";
import EmployeeDepartment from "@/views/employees/employeeDict/EmployeeDepartments.vue";
import {ref} from "vue";

const tab = ref("employee-departments")

const configTabs = [
  {
    value: "employee-departments",
    title: "Отделы",
    icon: "mdi-office-building",
    component: EmployeeDepartment
  },
  {
    value: "employee-positions",
    title: "Должности",
    icon: "mdi-clipboard-account",
    component: EmployeePositions
  },
]
</script>
<style scoped lang="scss">
.dict-content{
  margin-top: -16px;
  margin-left: -16px;
  margin-right: -8px;
}
</style>