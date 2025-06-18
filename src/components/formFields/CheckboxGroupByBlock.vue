<template>
  <div v-if="multiple">
    <v-row>
      <v-col cols="12" md="6">
        <div v-for="(group, groupIndex) in groupedFirstHalf" :key="'group-1-' + groupIndex">
          <h3>{{ group.blockTitle }}</h3>
          <v-checkbox
              v-for="(item, index) in group.items"
              :key="index"
              :label="item.title"
              :value="item.value ?? item.code"
              v-model="model"
              density="compact"
              @change="handleCheckboxState(item.value ?? item.code, $event)"
              hide-details
          >
            <template #label>
              {{ item.title }}
            </template>
          </v-checkbox>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <div v-for="(group, groupIndex) in groupedSecondHalf" :key="'group-2-' + groupIndex">
          <h3>{{ group.blockTitle }}</h3>
          <v-checkbox
              v-for="(item, index) in group.items"
              :key="index"
              :label="item.title"
              :value="item.value ?? item.code"
              v-model="model"
              density="compact"
              @change="handleCheckboxState(item.value ?? item.code, $event)"
              hide-details
          >
            <template #label>
              {{ item.title }}
            </template>
          </v-checkbox>
        </div>
      </v-col>
    </v-row>
  </div>

  <div v-else>
    <div v-for="(group, groupIndex) in groupedItems" :key="'group-' + groupIndex">
      <h3>{{ group.blockTitle }}</h3>
      <v-checkbox
          v-for="(item, index) in group.items"
          :key="index"
          :label="item.title"
          :value="item.value ?? item.code"
          v-model="model"
          density="compact"
          @change="handleCheckboxState(item.value ?? item.code, $event)"
          hide-details
      >
        <template #label>
          {{ item.title }}
        </template>
      </v-checkbox>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  }
});

const model = defineModel();
const emit = defineEmits(["checkboxState"]);


const groupItemsByBlockTitle = (items) => {

  return items.reduce((groups, item) => {
    if (item.project) {
      if (!groups[item.project]) {
        groups[item.project] = { blockTitle: item.project, items: [] };
      }
      groups[item.project].items.push(item);
    }

    return groups;
  }, {});
};

const groupedFirstHalf = computed(() => {
  const halfIndex = Math.ceil(props.items.length / 2);
  return Object.values(groupItemsByBlockTitle(props.items.slice(0, halfIndex + 1)));
});

const groupedSecondHalf = computed(() => {
  const halfIndex = Math.ceil(props.items.length / 2);
  return Object.values(groupItemsByBlockTitle(props.items.slice(halfIndex + 1)));
});

const groupedItems = computed(() => {
  return Object.values(groupItemsByBlockTitle(props.items));
});

const handleCheckboxState = (value, event) => {
  emit("checkboxState", value, event.target.checked);
}
</script>

<style scoped lang="scss">
h3 {
  margin: 20px 0;
}
</style>