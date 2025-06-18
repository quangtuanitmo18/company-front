<template>
  <template v-if="!action.btnHandleClick">
    <router-link @click.stop :to="btnToDetail" class="table-column-action">
      <button :title="action.btnTitle">
        <v-icon size="small" :icon="action.btnIcon" class="color-primary" :class="{'btn-icon-wrapper': action.btnLabel}" />
        {{ action.btnLabel }}
      </button>
    </router-link>
  </template>
  <template v-else>
    <div @click.stop="() => action.btnHandleClick(item)" class="table-column-action">
      <button :title="action.btnTitle">
        <v-icon size="small" :icon="action.btnIcon" class="color-primary" :class="{'btn-icon-wrapper': action.btnLabel}" />
        {{ action.btnLabel }}
      </button>
    </div>
  </template>
</template>

<script setup>
import { computed } from "vue"
const { action, item } = defineProps(["action", "item"])

const btnToDetail =  computed(() => `${action.btnTo}${item.id}`)
</script>

<style lang="scss">
.table-column-action{
  padding: 4px;
  border-radius: 4px;
  display: inline-block;
  transition: background-color 0.3s;
  width: 28px;
  height: 28px;
  margin-left: 4px;

  &:hover{
    background-color: rgb(var(--color-primary));

    i {
      color: white !important;
    }
  }
}
</style>