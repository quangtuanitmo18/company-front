<template>
  <div class="mx-4 mt-4">
    <div class="d-flex mb-2">
      <v-btn class="ml-auto" prepend-icon="mdi-plus" color="primary" variant="outlined" @click="handleOpenCreate">
        Страховка
      </v-btn>
    </div>
    <template v-if="!loading">
      <table-comp
          :columns="columns"
          :items="list"
          :sort="sort"
          :setSort="setSort"
          :handleClickRow="handleShowModal"
      />
    </template>
    <template v-else>
      <div style="clear: both"></div>
      <div class="text-center pb-10">
        <v-progress-circular indeterminate class="color-primary" />
      </div>
    </template>
    <modal width="1200px" v-model="isShowModal">
      <template #title>
        <template v-if="!loadingModal">
          <div class="d-flex flex-column">
            <div class="d-flex">
              <p class="mr-1 ">Наименование:</p>
              <p class="mr-4">{{data?.shortname}}</p>
            </div>
            <div class="d-flex">
              <p class="mr-1">ИНН:</p>
              <p class="mr-4">{{data?.inn}}</p>
              <p class="mr-1" v-if="data?.memberDoStatus">Статус:</p>
              <p class="mr-4" v-if="data?.memberDoStatus">{{data?.memberDoStatus?.title}}</p>
              <p class="mr-1">СРО:</p>
              <p class="mr-4">{{data?.sro?.shortName}}</p>
            </div>
          </div>
        </template>
        <template v-else>
          Загрузка данных...
        </template>
      </template>
      <template #content>
        <div>
          <template v-if="!loadingModal">
            <p class="text-center text-h6">Страховщик: {{currentInsurance.insureAgentName}}</p>
            <detail-blocks :data="currentInsurance" :result="result">
              <insurance-notes :insuranceId="currentInsurance.id"></insurance-notes>
            </detail-blocks>
          </template>
          <template v-else>
            <div style="clear: both"></div>
            <div class="text-center pb-10">
              <v-progress-circular indeterminate class="color-primary" />
            </div>
          </template>
        </div>
      </template>
      <template #actions>
        <btn-secondary @click="() => isShowModal = false">
          Закрыть
        </btn-secondary>
      </template>
    </modal>
    <modal width="1200px" v-model="isShowModalAction" :title="isCreateInsurance ? 'Создание страховки' : 'Редактирование страховки'">
      <template #content>
        <v-form ref="formInsurance" class="mt-4">
          <v-row>
            <v-col cols="12">
              <div class="d-flex ga-10">
                <v-switch
                    v-model="currentInsurance.isAdditional"
                    label="Доп соглашение"
                    hide-details
                    color="primary"
                >
                </v-switch>
                <v-switch
                    v-model="currentInsurance.rsIsOrderedInSk"
                    label="Заказан в СК"
                    hide-details
                    color="primary"
                >
                </v-switch>
                <v-switch
                    v-model="currentInsurance.rsIsRetroPeriod"
                    label="Ретроактивный период"
                    hide-details
                    color="primary"
                >
                </v-switch>
              </div>
            </v-col>
            <v-col cols="4">
              <v-select
                  variant="underlined"
                  v-model="currentInsurance.idAgentInsure"
                  :items="agentInsureDict"
                  label="Страховая компания"
                  :rules="[v =>  !!v || 'Это обязательное поле.']"
                  hide-details
              >
              </v-select>
            </v-col>
            <v-col cols="4">
              <v-text-field
                  v-model="currentInsurance.insuranceNum"
                  label="Номер страховки"
                  variant="underlined"
                  hide-details
                  :rules="[v =>  !!v || 'Это обязательное поле.']"
              >
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <date-picker
                  :teleport="true"
                  :hideDetails="true"
                  v-model="currentInsurance.dateFrom"
                  label="Дата начала"
              ></date-picker>
            </v-col>
            <v-col cols="4">
              <date-picker
                  :teleport="true"
                  :hideDetails="true"
                  v-model="currentInsurance.dateTo"
                  label="Дата окончания"
              ></date-picker>
            </v-col>
            <v-col cols="4">
              <money-field
                  v-model="currentInsurance.summa"
                  label="Страховая сумма, руб"
                  hide-details
              >
              </money-field>
            </v-col>
            <v-col cols="4">
              <money-field
                  v-model="currentInsurance.insurancePremium"
                  label="Страховая премия, руб"
                  hide-details
              >
              </money-field>
            </v-col>
            <v-col cols="4">
              <v-select
                  variant="underlined"
                  v-model="currentInsurance.idWorkType"
                  :items="workTypeDict"
                  label="Тип работы"
                  hide-details
              >
              </v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                  variant="underlined"
                  v-model="currentInsurance.idDocsPassedType"
                  :items="docsTypeDict"
                  label="Тип документа"
                  hide-details
              >
              </v-select>
            </v-col>
            <v-col cols="4">
              <date-picker
                  :teleport="true"
                  :hideDetails="true"
                  v-model="currentInsurance.dateDocsPassed"
                  label="Дата принятия документов"
              ></date-picker>
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template #actions>
        <btn-secondary @click="() => isShowModalAction = false">
          Закрыть
        </btn-secondary>
        <btn-primary :loading="isLoadingAction" @click="handleSubmit">
          {{ isCreateInsurance ? "Создать" : "Подтвердить" }}
        </btn-primary>
      </template>
    </modal>
    <modal v-model="isShowModalDelete" title="Подтверждение действия" text="Это действие невозможно отменить, вы хотите продолжить?">
      <template #actions>
        <btn-secondary @click="isShowModalDelete = false">
          Закрыть
        </btn-secondary>
        <btn-primary :loading="isLoadingAction" @click="handleRemoveInsurance">
          Подтвердить
        </btn-primary>
      </template>
    </modal>
  </div>
</template>
<script setup>
import {onMounted, ref, watch} from "vue";
import {
  memberDoInsuranceAdd, memberDoInsuranceEdit,
  memberDoInsuranceGetData,
  memberDoInsuranceList, memberDoInsuranceRemove
} from "@/service/ossa/sqlup/memberDoInsuranceService.js";
import {useRoute} from "vue-router";
import TableComp from "@/components/table/TableComp.vue";
import {BtnPrimary, BtnSecondary} from "@/components/buttons/index.js";
import Modal from "@/components/Modal.vue";
import {
  CORRECT_INSURANCES,
  FILTER_TYPE_DATE,
  FILTER_TYPE_EQ_CHECK,
  FILTER_TYPE_LIKE,
  FILTER_TYPE_MONEY
} from "@/utils/dictionary.js";
import {memberDoInsuranceNoteList} from "@/service/ossa/sqlup/memberDoInsuranceNoteService.js";
import {DetailBlocks} from "@/components/index.js";
import DatePicker from "../../../../components/date/DatePicker.vue";
import {MoneyField} from "@/components/formFields/index.js";
import InsuranceNotes from "@/views/ossa/agents/components/InsuranceNotes.vue";

defineProps(["data"])
const route = useRoute()

const sort = ref([])
// Example sort
// const sort = [{
//   sortBy: "id",
//   sortType: "asc"
// }]

const list = ref([])
const loading = ref(true)
const loadingModal = ref(false)
const isShowModal = ref(false)
const currentInsurance = ref({})

const isShowModalAction = ref(false)
const isShowModalDelete = ref(false)
const isLoadingAction = ref(false)
const isCreateInsurance = ref(false)

const formInsurance = ref(null)
const agentInsureDict = ref([])
const docsTypeDict = ref([])
const workTypeDict = ref([])

const handleOpenCreate = () => {
  isShowModalAction.value = true
  isCreateInsurance.value = true
  currentInsurance.value = {}
}

const handleSubmit = async () => {
  const {valid} = await formInsurance.value.validate()

  if(valid) {
    if(isCreateInsurance.value){
      try{
        isLoadingAction.value = true
        await memberDoInsuranceAdd(route.params.id, {
          ...currentInsurance.value,
          insurancePremium: Number(currentInsurance.value.insurancePremium?.replace(/\s/g, "")) || null,
          summa: Number(currentInsurance.value.summa?.replace(/\s/g, "")) || null
        })
        isShowModalAction.value = false
        loading.value = true
        const res = await memberDoInsuranceList(route.params.id,{
          // convert sort to object
          sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
        })
        list.value = res.insurances.map(insurance => ({...insurance, disabled: insurance.statusName === "Недействителен"}))
      }catch (err){
        console.log("err", err)
      }finally {
        isLoadingAction.value = false
        loading.value = false
      }
    }else{
      try{
        isLoadingAction.value = true
        await memberDoInsuranceEdit(route.params.id, currentInsurance.value.id, {
          ...currentInsurance.value,
          insurancePremium: Number(currentInsurance.value.insurancePremium?.replace(/\s/g, "")) || null,
          summa: Number(currentInsurance.value.summa?.replace(/\s/g, "")) || null
        })
        isShowModalAction.value = false
        loading.value = true
        const res = await memberDoInsuranceList(route.params.id,{
          // convert sort to object
          sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
        })
        list.value = res.insurances.map(insurance => ({...insurance, disabled: insurance.statusName === "Недействителен"}))

      }catch (err){
        console.log("err", err)
      }finally {
        isLoadingAction.value = false
        loading.value = false
      }
    }
  }
}

const handleEdit = (item) => {
  isShowModalAction.value = true
  isCreateInsurance.value = false
  currentInsurance.value = JSON.parse(JSON.stringify(item))
}

const handleRemove = (item) => {
  isShowModalDelete.value = true
  currentInsurance.value = JSON.parse(JSON.stringify(item))
}

const handleRemoveInsurance = async () => {
  try{
    isLoadingAction.value = true
    await memberDoInsuranceRemove(route.params.id, currentInsurance.value.id)
    isShowModalDelete.value = false
    loading.value = true
    const res = await memberDoInsuranceList(route.params.id,{
      // convert sort to object
      sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
    })
    list.value = res.insurances.map(insurance => ({...insurance, disabled: insurance.statusName === "Недействителен"}))
  }catch (err){
    console.log("err", err)
  }finally {
    isLoadingAction.value = false
    loading.value = false
  }
}

const handleShowModal = async (item) => {
  isShowModal.value = true
  currentInsurance.value = item
}

const result = [
  {
    items: [
      {
        heading: "Основные сведения",
        items: [
          {
            title: "Номер договора",
            key: "insuranceNum",
          },
          {
            title: "Корректна",
            key: "correctInsure",
            type: "boolean"
          },
          {
            title: "Доп соглашение",
            key: "isAdditional",
            type: "boolean"
          },
          {
            title: "Страховая сумма, руб",
            key: "summa",
            type: "money"
          },
          {
            title: "Страховая премия, руб",
            key: "insurancePremium",
            type: "money"
          },
        ]
      }
    ],
  },
  {
    items: [
      {
        heading: "Документы отданы",
        items: [
          {
            title: "Отметка",
            key: "isDocsPassed",
            type: "boolean"
          },
          {
            title: "Дата",
            key: "dateDocsPassed",
            type: "date"
          },
          {
            title: "Тип",
            key: "docsPassedTypeTitle",
          },
        ]
      },
      {
        heading: "Срок действия договора",
        items: [
          {
            title: "Действует c",
            key: "dateFrom",
            type: "date"
          },
          {
            title: "Действует по",
            key: "dateTo",
            type: "date"
          },
        ]
      },
    ]
  },
  {
    items: [
      {
        heading: "Автор",
        items: [
          {
            title: "Пользователь",
            key: "userAddDesc",
          },
          {
            title: "Дата",
            key: "dateAdd",
            type: "date"
          },
        ]
      },
      {
        heading: "",
        items: [
          {
            title: "Статус договора",
            key: "statusName",
          },
          {
            title: "Заказан в СК",
            key: "rsIsOrderedInSk",
            type: "boolean"
          },
          {
            title: "Ретроактивный период",
            key: "rsIsRetroPeriod",
            type: "boolean"
          },
        ]
      }
    ]
  }
]

const columns = [
  {
    heading: 'Корректна',
    width: "50px",
    value: 'correctInsure',
    sortOptions: {
      sortable: true,
      sortByValue: 'correctInsure',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_EQ_CHECK,
      filterValues: CORRECT_INSURANCES
    },
  },
  {
    heading: 'Страховщик',
    value: 'insureAgentName',
    sortOptions: {
      sortable: true,
      sortByValue: 'insureAgentName',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Номер довогора',
    value: 'insuranceNum',
    sortOptions: {
      sortable: true,
      sortByValue: 'insuranceNum',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Срок действия договора',
    type: 'time-range',
    value: 'dateFrom',
    valueSecond: 'dateTo',
    sortOptions: {
      sortable: true,
      sortByValue: 'dateTo',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_DATE,
    },
  },
  {
    heading: 'Страховая сумма, руб',
    value: 'summa',
    sortOptions: {
      sortable: true,
      sortByValue: 'summa',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_MONEY,
    },
  },
  {
    heading: 'Страховая премия, руб',
    value: 'insurancePremium',
    sortOptions: {
      sortable: true,
      sortByValue: 'insurancePremium',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_MONEY,
    },
  },
  {
    heading: 'Статус договора',
    value: 'statusName',
    sortOptions: {
      sortable: true,
      sortByValue: 'statusName',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: '',
    value: '',
    type: "custom-buttons",
    buttons: [
      {
        conditions: [],
        type: "icon",
        icon: "mdi-square-edit-outline",
        title: "Редактировать",
        handleFunc: (item) => handleEdit(item)
      },
      {
        conditions: [],
        type: "icon",
        icon: "mdi-delete",
        title: "Удалить",
        handleFunc: (item) => handleRemove(item)
      },
    ]
  }
]

const setSort = (value) => {
  sort.value = value
}

watch([sort], () => {
  memberDoInsuranceList(route.params.id,{
    // convert sort to object
    sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
  }).then(res => {
    list.value = res.insurances.map(insurance => ({...insurance, disabled: insurance.statusName === "Недействителен"}))
    loading.value = false
  })
}, { immediate: true })

onMounted(() => {
  memberDoInsuranceGetData(route.params.id).then(res => {
    agentInsureDict.value = res.formData.insurers.map(item => ({...item, value: item.id}))
    workTypeDict.value = res.formData.workTypes.map(item => ({...item, value: item.id}))
    docsTypeDict.value = res.formData.docTypes.map(item => ({...item, value: item.id}))
  })
})
</script>