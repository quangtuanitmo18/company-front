<template>
  <btn-primary @click="isActive = true">
    <slot></slot>
    <modal v-model="isActive" :title="title" :text="text">
      <template #actions>
        <btn-secondary @click="isActive = false">
          Закрыть
        </btn-secondary>
        <btn-primary @click="handleSubmit">
          Подтвердить
        </btn-primary>
      </template>
    </modal>
  </btn-primary>
</template>

<script setup>
import Modal from "@/components/Modal.vue";
import {BtnPrimary, BtnSecondary} from "@/components/buttons";
import {ref} from "vue";

defineProps(["variant", "color", "title", "text"])
const emit = defineEmits(["submit"])
const isActive = ref(false)

const handleSubmit = () => {
  isActive.value = false
  emit("submit")
}
</script>