<template>
  <div v-if="data.length">
    <v-tooltip close-on-content-click max-width="600" offset="4" location="top">
      <template v-slot:activator="{ props }">
        <div v-bind="props">{{data[0]?.shortname}}
          <span class="text-no-wrap">({{data[0]?.inn}}) <span v-if="data.length > 1" class="tag">+{{data.length - 1}}</span></span>
        </div>
      </template>
      <div>
        <div class="item-detail" v-for="member in data">
          <p>Организация: {{member.shortname }}</p>
          <p>ИНН: {{ member.inn }}</p>
          <p>СРО: {{member.sro.shortName}}</p>
        </div>
      </div>
    </v-tooltip>
  </div>
  <div v-else>
    - не найдено -
  </div>
</template>
<script setup>
defineProps(["data"])
</script>

<style lang="scss" scoped>
.item-detail:not(:last-child){
  border-bottom: 1px solid white;
}
.tag{
  padding: 4px 4px 2px;
  border-radius: 4px;
  background: var(--text-warning);
  color: white;
  font-size: 12px;
}
</style>