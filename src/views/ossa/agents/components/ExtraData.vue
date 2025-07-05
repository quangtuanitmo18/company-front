<template>
  <div class="ma-4">
    <template v-if="!loading">
      <detail-blocks :data="extraData" :result="result"></detail-blocks>
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
import {useRoute} from "vue-router";
import {memberDoExtraData} from "@/service/ossa/sqlup/memberDoExtraDataService.js";

const route = useRoute()

const extraData = ref({})
const loading = ref(true)

const result = [
  {
    items: [
      {
        heading: "Организация",
        items: [
          {
            title: "Краткое наименование",
            key: "shortname",
          },
          {
            title: "Полное наименование",
            key: "fullname",
          },
          {
            title: "ИНН",
            key: "inn",
          },
          {
            title: "ОГРН",
            key: "ogrn",
          },
          {
            title: "КПП",
            key: "kpp",
          },
          {
            title: "ОПФ",
            key: "agentRightFormShort",
          },
          {
            title: "Руководитель",
            key: "director",
          },
          {
            title: "Должность",
            key: "bossPosition",
          },
          {
            title: "Временная зона",
            key: "timezoneName",
          },
        ]
      },
      {
        heading: "Договор займа",
        items: [
          {
            title: "Тип договора займа",
            key: "dzType",
          },
          {
            title: "Договор займа",
            key: "izDz",
            type: "boolean"
          },
          {
            title: "Исполнен ДЗ",
            key: "isDzF",
            type: "boolean"
          },
          {
            title: "Дата окончания ДЗ",
            key: "dateDzFinish",
            type: "date"
          },
        ]
      },
      {
        heading: "Специалист СРО",
        items: [
          {
            title: "Страховой гр.",
            key: "userSg",
          },
          {
            title: "Пользователь ДО",
            key: "userDo",
          },
          {
            title: "Пользователь КИУ",
            key: "userKio",
          }
        ]
      },
      {
        heading: "ГП НРС",
        items: [
          {
            title: "Дата предоставления",
            key: "dateGpNrs",
            type: "date"
          },
          {
            title: "Исполнено",
            key: "isGpNrs",
            type: "boolean"
          },
          {
            title: "Замечания",
            key: "commentNrs",
          }
        ]
      },
    ],
  },
  {
    items: [
      {
        heading: "Реквизиты",
        items: [
          {
            title: "Регистрационный номер",
            key: "reestrNumber",
          },
          {
            title: "Факс",
            key: "fax",
          },
          {
            title: "Сайт",
            key: "www",
          },
          {
            title: "E-mail",
            key: "email",
            type: "list"
          },
          {
            title: "Дата гос. регистрации",
            key: "registrationDate",
            type: "date"
          },
          {
            title: "Дата ОГРН",
            key: "registrationNalogDate",
            type: "date"
          },
          {
            title: "Юридический адрес",
            key: "addressJuridical",
          },
          {
            title: "Фактический адрес",
            key: "addressFact",
          },
          {
            title: "Почтовый адрес",
            key: "addressPost",
          },
          {
            title: "Представитель",
            key: "agentResident",
          },
          {
            title: "Дата закрытия папки",
            key: "fileCloseDate",
            type: "date"
          },
          {
            title: "ID банка члена СРО",
            key: "idBank",
          },
          {
            title: "Банка члена СРО",
            key: "bankAccount",
          },
          {
            title: "БИК члена СРО",
            key: "bik",
          },
          {
            title: "Кор. счет члена СРО",
            key: "corrAcc",
          },
          {
            title: "Название банка члена СРО",
            key: "name",
          },
          {
            title: "Город члена СРО",
            key: "town",
          },
        ]
      },
    ]
  },
  {
    items: [
      {
        heading: "Членство",
        items: [
          {
            title: "Дата протокола вступления",
            key: "protocolIncomeDate",
            type: "date"
          },
          {
            title: "Номер протокола вступления",
            key: "protocolIncomeNumber",
          },
          {
            title: "Дата внесения в реестр",
            key: "reestrDate",
            type: "date"
          },
          {
            title: "Статус",
            key: "memberStatus",
          },
          {
            title: "Телефон",
            key: "phone",
            type: "list"
          },
          {
            title: "Дата протокола исключения",
            key: "protocolOutcomeDate",
            type: "date"
          },
          {
            title: "Номер протокола исключения",
            key: "protocolOutcomeNumber",
          },
          {
            title: "Причина исключения",
            key: "reasonOutcome",
          },
          {
            title: "Контрагент",
            key: "createByAgentName",
          },
          {
            title: "Комментарии",
            key: "comments",
          },
          {
            title: "Макс. стоимость работ, руб",
            key: "maxCostForContract",
            type: "money"
          },
          {
            title: "Представитель",
            key: "isResident",
            type: "boolean"
          },
          {
            title: "Личный кабинет",
            key: "lk",
            type: "boolean"
          },
          {
            title: "Дата последнего исключения",
            key: "outcomeDate",
            type: "date"
          },
          {
            title: "Головная компания",
            key: "shortnameMain",
          },
          {
            title: "Номер в реестре",
            key: "numReestr",
          },
          {
            title: "Дата последней выписки",
            key: "statementInDate",
            type: "date"
          },
        ]
      },
      {
        heading: "Льготный период",
        items: [
          {
            title: "Активен",
            key: "isEnable",
            type: "boolean"
          },
          {
            title: "Действует до",
            key: "discountDateTo",
            type: "date"
          },
          {
            title: "Скидка, руб",
            key: "discount",
            type: "money"
          },
        ]
      }
    ]
  }
]

onMounted(() => {
  memberDoExtraData(route.params.id).then(res => {
    extraData.value = res.extraData
  }).finally(() => {
    loading.value = false
  })
})

</script>