<template>
  <div class="card-block">
    <div class="card-block-header">
      <slot name="header"></slot>
    </div>
    <div class="card-block-body">
      <v-row>
        <template v-for="(item, index) in items" :key="index">
          <slot :item="item"></slot>
          <v-col cols="1" md="1">
            <div @click="() => removeInfo(index)" class="action-icon">
              <button type="button" title="Удалить">
                <v-icon size="small" icon="mdi-delete" class="color-primary" />
              </button>
            </div>
          </v-col>
        </template>
        <v-col cols="12" md="12">
          <v-btn class="pull-right icon-color-primary" @click="handleAddInfo" size="small" icon="mdi-plus"></v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script setup>
const { defaultValues } = defineProps(["defaultValues"])
const items = defineModel()
const emit = defineEmits(["update:items"])

const removeInfo = (id) => {
  items.value.splice(id, 1)
  emit("update:items")
}

const handleAddInfo = () => {
  items.value.push({...defaultValues})
  emit("update:items")
}
</script>
<style lang="scss" scoped>
.action-icon{
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: inline-block;
  transition: background-color 0.3s;
  width: 28px;
  margin-top: 16px;

  &:hover{
    background-color: rgb(var(--color-primary));

    i {
      color: white !important;
    }
  }
}
</style>