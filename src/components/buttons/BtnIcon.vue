<template>
  <v-btn v-if="!small" @click.stop="(e) => emit('click', e)" min-width="46" width="46" height="46" color="primary" variant="outlined" :title="title">
    <v-icon class="color-primary" size="x-large" :icon="icon"></v-icon>
  </v-btn>
  <div v-else @click="(e) => emit('click', e)" class="icon-block"  >
    <button type="button" :title="title">
      <v-icon size="small" :icon="icon" class="color-primary" />
    </button>
  </div>
</template>

<script setup>
defineProps(["title", "icon", "small"])
const emit = defineEmits(["click"])
</script>

<style scoped lang="scss">
.icon-block{
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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