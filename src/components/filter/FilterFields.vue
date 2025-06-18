<template>
  <v-list-item class="pb-2" v-if="filter.type !== FILTER_TYPE_ACTION && filter.filterBy">
    <template v-if="filter.type === FILTER_TYPE_EQ || filter.type === FILTER_TYPE_EQ_CHECK">
      <v-select :menu-props="{width: '282'}" variant="underlined" v-model="filter.value" :items="filter.selectValues" :label="filter.label" clearable hide-details=true />
    </template>
    <template v-else-if="filter.type === FILTER_TYPE_LIKE">
      <v-text-field v-if="!filter.component" :label="filter.label" variant="underlined" v-model="filter.value" hide-details=true />
      <component v-else :is="filter.component" variant="underlined" v-model="filter.value" hide-details=true />
    </template>
    <template v-else-if="filter.type === FILTER_TYPE_DATE || filter.type === FILTER_TYPE_DATE_TIME ">
      <date-picker :hideDetails="true" :range="true" v-model="filter.value" :label="filter.label"></date-picker>
    </template>
    <template v-else-if="filter.type === FILTER_TYPE_EQ_MULTI">
      <v-select :menu-props="{width: '282'}" variant="underlined" v-model="filter.value" :items="filter.selectValues" :label="filter.label" chips closable-chips multiple hide-details=true />
    </template>
    <template v-else-if="filter.type === FILTER_TYPE_EQ_WITH_SEARCH">
      <select-with-search
          :menu-props="{width: '282'}"
          attach
          v-model="filter.value"
          :items="filter.selectValues"
          :label="filter.label"
          hide-details=true
      ></select-with-search>
    </template>
    <template v-else-if="filter.type === FILTER_TYPE_EQ_BY_GROUP">
      <select-by-group
          :menu-props="{width: '282'}"
          v-model="filter.value"
          :items="filter.selectValues"
          :label="filter.label"
          hide-details=true
      >
      </select-by-group>
    </template>
    <template v-else-if="filter.type === FILTER_TYPE_EQ_MULTI_WITH_SEARCH">
      <select-with-search
          :menu-props="{width: '282'}"
          attach
          v-model="filter.value"
          :items="filter.selectValues"
          :label="filter.label"
          chips closable-chips
          :multiple="true"
          hide-details=true
      >
      </select-with-search>
      <!--
      <v-select  no-data-text="Ничего не найдено" variant="underlined" v-model="filter.value" :items="filter.selectFilteredValues" :label="filter.label" chips closable-chips multiple  hide-details=true >
        <template v-slot:prepend-item>
          <v-text-field variant="underlined" v-model="filter.search" placeholder="Поиск" @update:focused="(e) => handleBlur(e, filter)" @input="() => handleSearch(filter)"></v-text-field>
        </template>
      </v-select>
      -->
    </template>
    <template v-if="filter.type === FILTER_TYPE_BETWEEN">
      <v-label class="mb-8 text-caption">{{ filter.label }}</v-label>
      <v-range-slider
          v-model="filter.value"
          :min="0"
          :max="filter.filterOptions.filterMaxValue"
          :step="filter.filterOptions.filterStep"
          density="compact"
          hide-details
          thumb-label="always"
      ></v-range-slider>
    </template>
  </v-list-item>
</template>

<script setup>
import {
  FILTER_TYPE_EQ,
  FILTER_TYPE_LIKE,
  FILTER_TYPE_DATE,
  FILTER_TYPE_ACTION,
  FILTER_TYPE_EQ_MULTI,
  FILTER_TYPE_EQ_CHECK,
  FILTER_TYPE_EQ_MULTI_WITH_SEARCH,
  FILTER_TYPE_EQ_WITH_SEARCH,
  FILTER_TYPE_BETWEEN,
  FILTER_TYPE_DATE_TIME, FILTER_TYPE_EQ_BY_GROUP,
} from "@/utils/dictionary.js";
import {onMounted} from "vue";
import {DatePicker} from "@/components";
import {SelectWithSearch, SelectByGroup} from "@/components/formFields";

  const { filter } = defineProps(["filter"])

  onMounted(async () => {
    if(filter.api && !filter.selectValues.length){
      await filter.api().then(res => {
        filter.selectValues = res
      })
    }
    if(filter.type === FILTER_TYPE_EQ_MULTI_WITH_SEARCH || filter.type === FILTER_TYPE_EQ_WITH_SEARCH){
      filter.selectFilteredValues = filter.selectValues
    }
  })
</script>