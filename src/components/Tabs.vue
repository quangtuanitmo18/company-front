<template>
  <div class="d-flex" :class="{'flex-row': vertical, 'flex-column': !vertical}">
    <v-tabs
        v-model="tab"
        class="color-primary mt-2"
        :direction="vertical ? 'vertical' : 'horizontal'"
    >
      <v-tab :prepend-icon="item.icon" v-for="(item, id) in configTabs" :disabled="disabled" :key="id" :class="{'ml-auto': split === id}" :value="item.value">
        <slot name="default">
          {{ item.title }}
          <span class="tab-notion" v-if="item.numberNotion">{{item.numberNotion}}</span>
        </slot>
      </v-tab>
    </v-tabs>
    <v-window class="w-100" v-model="tab">
      <v-window-item v-for="(item, id) in configTabs" :key="id" :value="item.value">
        <keep-alive>
          <component :is="item.component" @set-disabled="(e) => emit('set-disabled', e)" @custom-event="(e) => emit('custom-event',e)" :disabled="disabled" :data="data" />
        </keep-alive>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup>
  defineProps(["configTabs", "data", "disabled", "split", "vertical"]);
  const emit = defineEmits(["set-disabled", "custom-event"]);

  const tab = defineModel();
</script>

<style scoped lang="scss">
.tab-notion{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  font-size: 13px;
  border-radius: 50%;
  background: var(--text-warning);
  color: white;
  margin-left: 4px;
}

</style>