<template>
  <p class="text-h6">{{title}}</p>
  <graphic :animation="true" :data="data"/>
</template>
<script setup>
import {Graphic} from "@/components/index.js";

const {data} = defineProps(["data", "title"])
</script>