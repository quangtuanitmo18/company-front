<template>
  <v-card class="py-4 px-4">
    <div class="d-flex justify-space-between">
      <div>
        <p v-if="title" class="card-title">
          {{ title }}
        </p>
        <p v-if="subtitle" class="card-subtitle">
          {{ subtitle }}
        </p>
      </div>
      <div v-if="actions?.length" class="actions-btn-pane">
        <template v-for="(action, index) in actions" :key="index">
          <btn-dropdown v-if="action.type && action.type === 'dropdown'" :items="action.items">
            {{ action.title }}
          </btn-dropdown>
          <v-btn
              v-else :title="action.title"
              @click="action.handleFunc"
              min-width="46"
              width="46"
              height="46"
              variant="flat"
              :class="action.type === 'danger' ? 'card-icon card-icon-danger' : 'card-icon card-icon-primary'">
            <v-icon :class="action.type === 'danger' ? 'card-icon-danger' : 'card-icon-primary'" size="x-large" :icon="action.icon"></v-icon>
          </v-btn>
        </template>
      </div>
    </div>
    <div>
      <slot></slot>
    </div>
    <div class="card-footer d-flex justify-end mt-4">
      <btn-secondary v-if="noBack !== false" @click="handleBack">
        Назад
      </btn-secondary>
      <slot name="action"></slot>
    </div>
  </v-card>
</template>

<script setup>
import {useRouter} from "vue-router";
import {BtnDropdown, BtnSecondary} from "@/components/buttons/index.js";

defineProps(["title", "subtitle", "header", "actions", "noBack"])

const router = useRouter()

const handleBack = () => {
  router.go(-1)
}
</script>

<style scoped lang="scss">
.card-title{
  font-size: 18px;
  color: var(--text-main);
}
.card-subtitle{
  padding-top: 2px;
  font-size: 14px;
  color: var(--text-secondary);
}
.actions-btn-pane{
  display: flex;
  gap: 8px;
  align-items: center;
}
.card-icon{
  border-radius: 4px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: 0.3s;
  background-color: #fff;
  color: rgb(var(--color-primary));

  &:hover{
    background-color: #f8f9fa;
  }

  & + &{
    margin-left: 8px;
  }
}

.card-icon-danger {
  color: darkred !important;
}

.card-footer:empty{
  display: none !important;
}
</style>