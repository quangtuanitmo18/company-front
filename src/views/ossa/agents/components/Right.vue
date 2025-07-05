<template>
  <div class="ma-4">
    <template v-if="!loading">
      <detail-blocks :data="right" :count-column="2" :result="result"></detail-blocks>
    </template>
    <template v-else>
      <div style="clear: both"></div>
      <div class="text-center pb-10">
        <v-progress-circular indeterminate class="color-primary" />
      </div>
    </template>
  </div>
</template>
<script setup>
import {DetailBlocks} from "@/components";
import {onMounted, ref} from "vue";
import {memberDoRight} from "@/service/ossa/sqlup/memberDoRightService.js";
import {useRoute} from "vue-router";

const route = useRoute()

const right = ref({})
const loading = ref(true)

const result = [
  {
    items: [
      {
        heading: "Права ВВ",
        status: "isVV",
        items: [
          {
            title: "Статус (текущий)",
            key: "vvStatus",
          },
          {
            title: "Уровень  (текущий)",
            key: "vvLevel",
          },
          {
            title: "№ протокола (выдан)",
            key: "vvProtocolNumber",
          },
          {
            title: "Дата протокола",
            key: "vvProtocolDate",
            type: "date"
          },
          {
            title: "Дата регистрации заявления",
            key: "vvApplicationRegDate",
            type: "date"
          },
          {
            title: "Свидетельство",
            key: "evidence",
          },
        ]
      },
      {
        heading: "Виды работ (текущие)",
        items: [
          {
            title: "Атомные",
            key: "isCurrentWorkTypeNuclear",
            type: "boolean"
          },
          {
            title: "ООпО",
            key: "isCurrentWorkTypeDangerous",
            type: "boolean"
          },
          {
            title: "Обычные",
            key: "isCurrentWorkTypeUsual",
            type: "boolean"
          },
        ]
      },
    ],
  },
  {
    items: [
      {
        heading: "Права ОДО",
        status: "isODO",
        items: [
          {
            title: "Статус (текущий)",
            key: "odoStatus",
          },
          {
            title: "Уровень  (текущий)",
            key: "odoLevel",
          },
          {
            title: "№ протокола (выдан)",
            key: "odoProtocolNumber",
          },
          {
            title: "Дата протокола",
            key: "odoProtocolDate",
            type: "date"
          },
        ]
      },
      {
        heading: "Виды работ (запланируемые)",
        items: [
          {
            title: "Атомные",
            key: "isPlannedWorkTypeNuclear",
            type: "boolean"
          },
          {
            title: "ООпО",
            key: "isPlannedWorkTypeDangerous",
            type: "boolean"
          },
          {
            title: "Обычные",
            key: "isPlannedWorkTypeUsual",
            type: "boolean"
          },
        ]
      },
      {
        heading: "",
        items: [
          {
            title: "Представитель",
            key: "agentResident",
          },
        ]
      }
    ]
  },
]

onMounted(() => {
  memberDoRight(route.params.id).then(res => {
    right.value = res.right
  }).finally(() => {
    loading.value = false
  })
})

</script>