<template>
  <div v-if="multiple">
    <v-row>
      <v-col cols="12" md="6">
        <v-checkbox
            v-for="(item, index) in firstHalf"
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
      </v-col>
      <v-col cols="12" md="6">
        <v-checkbox
            v-for="(item, index) in secondHalf"
            :key="index"
            :label="item.title"
            :value="item.value ?? item.code"
            v-model="model"
            density="compact"
            @change="handleCheckboxState(item.value ?? item.code, $event)"
            hide-details
        />
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <v-col cols="12">
      <v-table class="table-view">
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td style="width: 5%;">
              <v-checkbox
                  hide-details="true"
                  :value="item.value ?? item.code"
                  v-model="model"
                  @change="handleCheckboxState(item.value ?? item.code, $event)"
              />
            </td>
            <td>{{ item.code }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.description }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </div>
</template>

<script setup>
import { computed } from 'vue';

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

const halfIndex = computed(() => Math.round(props.items.length / 2));
const firstHalf = computed(() => props.items.slice(0, halfIndex.value));
const secondHalf = computed(() => props.items.slice(halfIndex.value));

const handleCheckboxState = (value, event) => {
  emit("checkboxState", value, event.target.checked);
}
</script>

<style scoped lang="scss">

</style>