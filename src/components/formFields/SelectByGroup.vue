<template>
  <v-select variant="underlined" chips closable-chips multiple v-model="model">
    <template #item="data">
      <v-list-subheader color="black" v-if="data.props.header">
        <p class="font-weight-medium" style="font-size: 16px">
          {{ data.props.header }}
        </p>
      </v-list-subheader>
      <v-divider v-else-if="data.props.divider" />
      <v-list-item v-else v-bind="data.props">
        <template v-slot:prepend="{ isSelected }">
          <v-checkbox-btn :model-value="isSelected"></v-checkbox-btn>
        </template>
        <template v-slot:title>
          <div v-html="data.item.title"></div>
        </template>
        <template v-if="data.item.raw.subtitle" v-slot:subtitle>
          <div v-html="data.item.raw.subtitle"></div>
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>
<script setup>
const model = defineModel()

// const example = [
//   {
//     props: {
//       header: "Раздел 1"
//     }
//   },
//   {
//     subtitle: "Name",
//     title: "Number",
//     value: 1,
//   },
//   {
//     props: {
//       header: "Раздел 2"
//     }
//   },
//   {
//     subtitle: "Name 2",
//     title: "Number 2",
//     value: 2
//   },
//   {
//     subtitle: "Name 3",
//     title: "Number 3",
//     value: 2
//   },
// ]

</script>