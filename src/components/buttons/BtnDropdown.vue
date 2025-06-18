<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary" :size="size" :style="{'text-transform': 'initial'}" variant="flat">
        <slot></slot>
        <template v-slot:append>
          <v-icon icon="mdi-menu-down"></v-icon>
        </template>
      </v-btn>
    </template>

    <v-list :size="size">
      <v-list-item
          v-for="(item, index) in items"
          :key="index"
          class="item-icon-small"
          @click="() => item.handleFunc(data)"
      >
        <template v-if="item.icon" v-slot:prepend>
          <v-icon size="small" :icon="item.icon"></v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
defineProps(["items", "size", "data"])
const emit = defineEmits(["handle-action"])
</script>