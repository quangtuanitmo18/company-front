<template>
  <template v-if="!data.value">
    <div class="image-disabled">
      <img width="52px" height="41px" :alt="alt" :src="src"/>
    </div>
  </template>
  <template v-else-if="data.id">
    <router-link :to="'/ossa/agent/view/' + data.id" class="image-disabled" :class="{'image-active': data.value, 'image-current-link': data.id === parseInt(route.params.id)}">
      <img width="52px" height="41px" :alt="alt" :src="src"/>
    </router-link>
  </template>
  <template v-else>
    <div class="image-disabled" :class="{'image-active': data.value}">
      <v-tooltip text="Страница СРО не найдена" location="top" offset="4">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" class="image-alert color-primary" >mdi-alert-decagram</v-icon>
        </template>
      </v-tooltip>
      <img width="52px" height="41px" :alt="alt" :src="src"/>
    </div>
  </template>
</template>
<script setup>
import {useRoute} from "vue-router";

defineProps(["data", "alt", "src"])

const route = useRoute()
</script>
<style scoped lang="scss">
.image-disabled{
  display: inline-flex;
  pointer-events: none;
  position: relative;
}
.image-disabled:not(.image-active){
  filter: grayscale(1);
  opacity: 0.3;
}
.image-current-link{
  border: 1px solid rgb(var(--color-primary));
  box-shadow: 0 0 3px black;
}
.image-disabled.image-active:not(.image-current-link){
  pointer-events: unset;
}
.image-alert{
  position: absolute;
  top: -8px;
  right: -8px;
}
</style>