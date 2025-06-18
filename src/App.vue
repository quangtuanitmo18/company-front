<template>
  <global-styles>
    <component :is="layouts[currentLayout]" />
  </global-styles>
</template>

<script setup>
import { GlobalStyles } from "@/components";
import AppLayout from "@/layouts/AppLayout.vue";
import SimpleLayout from "@/layouts/SimpleLayout.vue";
import ProjectLayout from "@/layouts/ProjectLayout.vue";

import {computed} from "vue";
import { useRoute } from "vue-router";

const layouts = {
  "app-layout": AppLayout,
  "simple-layout": SimpleLayout,
  "project-layout": ProjectLayout
}

const route = useRoute()

const currentLayout = computed(() => route.meta.layout)
</script>
