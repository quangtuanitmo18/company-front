<template>
  <div class="mx-4 mt-4" v-if="data">
    <v-row>
      <v-col :lg="countColumn ? 12 / countColumn : 4" cols="12" v-for="(_, index) in result">
        <template v-for="(item, id) in result[index].items" >
          <v-card elevation="2" class="pa-2 position-relative" :class="{'mt-4': id !== 0}">
            <p class="card-title color-primary">{{item.heading}}</p>
            <v-icon class="card-status" v-if="item.status" :icon="data[item.status] ? 'mdi mdi-check-circle' : 'mdi-close-circle'" :color="data[item.status] ? '#73A839' : '#d8101c'" size="small"></v-icon>
            <div class="d-flex" v-for="i in item.items">
              <p :style="{'max-width': '240px'}" class="color-secondary">{{i.title}}</p>
              <p class="card-body-value">: <span v-html="handleKeyData(data, i)"></span></p>
            </div>
          </v-card>
        </template>
      </v-col>
    </v-row>
    <slot></slot>
  </div>
</template>
<script setup>
import {isObject} from "@/utils/object.js";
import {moneyFormat, shortDateFormat} from "@/utils/format.js";

const handleKeyData = (data, i) => {
  return isObject(data[i.key]) ? formatColumn(i, data[i.key][i.subKey]) : formatColumn(i, data[i.key])
}

const formatColumn = (item, value) => {
  if(value === "0.00") return

  if(item.type === "boolean"){
    return value ? "Да" : "Нет"
  }else if(value && item.type === "date"){
    return shortDateFormat(value)
  }else if(value && item.type === "money"){
    return moneyFormat(value)
  }else if(value && item.type === "list"){
    return value.replaceAll(",", "<br>")
  }

  return value
}
const props = defineProps(["data", "result", "countColumn"])
</script>

<style lang="scss" scoped>
.card-title{
  font-size: 20px;
}
.card-body-value{
  min-width: 10px;
}
.card-status{
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>