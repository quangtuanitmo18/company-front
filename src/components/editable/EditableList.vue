<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" :class="options.buttonClass" :style="{'text-transform': 'initial'}">
        <template v-slot:prepend>
          <v-icon icon="mdi-circle" :color="iconColor"></v-icon>
        </template>
        <slot>{{ title }}</slot>
        <template v-slot:append>
          <v-icon icon="mdi-menu-down"></v-icon>
        </template>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
          v-for="(item, index) in items"
          :key="index"
          class="item-icon-small"
          @click="handleEdit(data.id, item.value)"
      >
        <template v-slot:prepend>
          <v-icon size="small" icon="mdi-circle" :color="item.color"></v-icon>
        </template>

        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import {ref} from "vue";

  const { options, title, items, data, handle, iconColor } = defineProps(["options", "title", "items", "data", "handle", "iconColor"]);
  const emit = defineEmits(["handleEdit"]);
  const color = ref();

  const handleEdit = (id, key) => {
    emit('handleEdit', {id: id, key: key});
  }
</script>

<style lang="scss">

</style>