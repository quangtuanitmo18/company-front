<template>
  <div class="mx-4 mt-4" v-if="data">
    <v-row>
      <v-col cols="4" v-for="(_, index) in result">
        <template v-for="(item, id) in result[index].items" >
          <v-card elevation="2" class="pa-2" :class="{'mt-4': id !== 0}">
            <p class="card-title color-primary">{{item.heading}}</p>
            <div class="d-flex" v-for="i in item.items">
              <p :style="{'max-width': '240px'}" class="color-secondary">{{i.title}}</p>
              <p class="card-body-value ml-1">{{isObject(data[i.key]) ? formatColumn(i, data[i.key][i.subKey]) : formatColumn(i, data[i.key])}}</p>
            </div>
          </v-card>
        </template>
      </v-col>
    </v-row>
    <events-do :short="true" @update-info="emit('updateInfo')" :data="props.data"></events-do>
  </div>
</template>
<script setup>
import {ref,} from "vue";
import {isObject} from "@/utils/object.js";
import {moneyFormat, shortDateFormat} from "@/utils/format.js";
import EventsDo from "@/views/ossa/agents/components/EventsDo.vue";

const formatColumn = (item, value) => {
  if(value === "0.00") return

  if(item.type === "boolean"){
    return value ? "Да" : "Нет"
  }else if(value && item.type === "date"){
    return shortDateFormat(value)
  }else if(value && item.type === "money"){
    return moneyFormat(value)
  }

  return value
}

const props = defineProps(["data"])
const emit = defineEmits(["updateInfo"])

const result = ref([
  {
    items: [
      {
        heading: "Плановая проверка",
        items: [
          {
            title: "Статус",
            key: "checkPlanStatus"
          },
          {
            title: "Дата",
            key: "checkPlanDate",
            type: "date"
          },
        ]
      },
      {
        heading: "Льготный период",
        items: [
          {
            title: "Активен",
            key: "payDiscountIsActive",
            type: "boolean"
          },
          {
            title: "Действует до",
            key: "payDiscountDate",
            type: "date"
          },
        ]
      },
      {
        heading: "Договор страхования",
        items: [
          {
            title: "Корректность",
            key: "insuranceContractCorrect",
            type: "boolean"
          },
          {
            title: "Действует до",
            key: "insuranceContractDate",
            type: "date"
          },
        ]
      },
    ]
  },
  {
    items: [
      {
        heading: "Прием в члены",
        items: [
          {
            title: "Дата регистрации в реестре",
            key: "dateRegistered",
            type: "date"
          },
          {
            title: "Дата пол. выписки",
            key: "dateLastStatement",
            type: "date"
          },
        ]
      },
      {
        heading: "Платежи",
        items: [
          {
            title: "ЧВ Начислено",
            key: "paymentChvAccrued",
            type: "money"
          },
          {
            title: "ЧВ Долг",
            key: "paymentChvDebt",
            type: "money"
          },
          {
            title: "Количество месяцев просрочки (ЧВ Долг)",
            key: "chvMonth",
          },
          {
            title: "ЦВ Начислено",
            key: "paymentShvAccrued",
            type: "money"
          },
          {
            title: "ЦВ Долг",
            key: "paymentShvDebt",
            type: "money"
          },
          {
            title: "КФ ОДО Начислено",
            key: "paymentOdoAccrued",
            type: "money"
          },
          {
            title: "КФ ОДО Долг",
            key: "paymentOdoDebt",
            type: "money"
          },
          {
            title: "КФ ВВ Начислено",
            key: "paymentVvAccrued",
            type: "money"
          },
          {
            title: "КФ ВВ Долг",
            key: "paymentVvDebt",
            type: "money"
          },
        ]
      },
    ]
  },
  {
    items: [
      {
        heading: "Мера",
        items: [
          {
            title: "Отчёт о деятельности",
            key: "sanctionActivityReport"
          },
          {
            title: "О заключённых контрактах",
            key: "sanctionConcludedContracts"
          },
          {
            title: "Долги",
            key: "sanctionDebts",
            type: "money"
          },
          {
            title: "Cтрахование ГО",
            key: "sanctionInsuranceGo"
          },
        ]
      },
      {
        heading: "",
        items: [
          {
            title: "Ответственный",
            key: "operator",
            subKey: "username"
          },
          {
            title: "Разница во времени",
            key: "timeDiff"
          },
          {
            title: "Основание приостановки",
            key: "violations",
          },
          {
            title: "Представитель",
            key: "delegatePerson"
          },
          {
            title: "Претензия (№ и дата)",
            key: "claim",
          },
        ]
      },
    ]
  }
])
</script>

<style lang="scss" scoped>
.card-title{
  font-size: 20px;
}
.card-body-value{
  min-width: 10px;
}
.card-body-value::before{
  content: ":";
  margin-left: -4px;
  margin-right: 4px;
}
</style>