<template>
  <div>
    <div class="d-flex my-2">
      <v-btn class="ml-auto" prepend-icon="mdi-plus" color="primary" variant="outlined" @click="handleOpenCreate">
        Замечания
      </v-btn>
    </div>
    <template v-if="!loading">
      <table-comp
          v-if="insuranceNotes.length"
          :columns="columnsNote"
          :items="insuranceNotes"
          :sort="sort"
          :setSort="setSort"
      />
    </template>
    <template v-else>
      <div style="clear: both"></div>
      <div class="text-center pb-10">
        <v-progress-circular indeterminate class="color-primary" />
      </div>
    </template>
    <modal v-model="isShowModalAction" :title="isCreateNote ? 'Создание замечания' : 'Редактирование замечания'">
      <template #content>
        <v-form ref="formNote" class="mt-4">
          <v-row>
            <v-col cols="12">
              <div class="d-flex ga-10">
                <v-switch
                    v-model="currentNote.confirm"
                    label="Подтверждено"
                    hide-details
                    color="primary"
                >
                </v-switch>
              </div>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="currentNote.comment"
                  label="Комментарии"
                  variant="underlined"
                  hide-details
                  :rules="[v =>  !!v || 'Это обязательное поле.']"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template #actions>
        <btn-secondary @click="() => isShowModalAction = false">
          Закрыть
        </btn-secondary>
        <btn-primary :loading="isLoadingAction" @click="handleSubmit">
          {{ isCreateNote ? "Создать" : "Подтвердить" }}
        </btn-primary>
      </template>
    </modal>
    <modal v-model="isShowModalDelete" title="Подтверждение действия" text="Это действие невозможно отменить, вы хотите продолжить?">
      <template #actions>
        <btn-secondary @click="isShowModalDelete = false">
          Закрыть
        </btn-secondary>
        <btn-primary :loading="isLoadingAction" @click="handleRemoveNote">
          Подтвердить
        </btn-primary>
      </template>
    </modal>
  </div>
</template>
<script setup>
import {TableComp} from "@/components/index.js";
import {
  CONFIRM_MEMBER_DO_INSURANCES,
  FILTER_TYPE_DATE,
  FILTER_TYPE_EQ_CHECK,
  FILTER_TYPE_LIKE, FILTER_TYPE_LIKE_PRE
} from "@/utils/dictionary.js";
import {ref, watch} from "vue";
import {useRoute} from "vue-router";
import Modal from "@/components/Modal.vue";
import {BtnPrimary, BtnSecondary} from "@/components/buttons/index.js";
import {
  memberDoInsuranceNoteAdd,
  memberDoInsuranceNoteEdit,
  memberDoInsuranceNoteList, memberDoInsuranceNoteRemove
} from "@/service/ossa/sqlup/memberDoInsuranceNoteService.js";
import {memberDoInsuranceList, memberDoInsuranceRemove} from "@/service/ossa/sqlup/memberDoInsuranceService.js";

const { insuranceId } = defineProps(["insuranceId"])

const route = useRoute()
const sort = ref([])

const isCreateNote = ref(false)
const isShowModalAction = ref(false)
const isShowModalDelete = ref(false)
const isLoadingAction = ref(false)
const loading = ref(true)

const currentNote = ref({})
const insuranceNotes = ref([])
const formNote = ref(null)

const handleOpenCreate = () => {
  isShowModalAction.value = true
  isCreateNote.value = true
  currentNote.value = {}
}

const handleSubmit = async () => {
  const {valid} = await formNote.value.validate()

  if(valid) {
    if(isCreateNote.value){
      try{
        console.log("insuranceId add", insuranceId)

        isLoadingAction.value = true
        await memberDoInsuranceNoteAdd(route.params.id, insuranceId, {...currentNote.value})
        isShowModalAction.value = false
        loading.value = true
        const res = await memberDoInsuranceNoteList(route.params.id, insuranceId, {
          // convert sort to object
          sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
        })
        insuranceNotes.value = res.insuranceNotes
      }catch (err){
        console.log("err", err)
      }finally {
        isLoadingAction.value = false
        loading.value = false
      }
    }else{
      try{
        isLoadingAction.value = true
        await memberDoInsuranceNoteEdit(route.params.id, currentNote.value.id, {...currentNote.value})
        isShowModalAction.value = false
        loading.value = true
        const res = await memberDoInsuranceNoteList(route.params.id, insuranceId, {
          // convert sort to object
          sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
        })
        insuranceNotes.value = res.insuranceNotes
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
  isCreateNote.value = false
  currentNote.value = JSON.parse(JSON.stringify(item))
}

const handleRemove = (item) => {
  isShowModalDelete.value = true
  currentNote.value = JSON.parse(JSON.stringify(item))
}

const handleRemoveNote = async () => {
  try{
    isLoadingAction.value = true
    await memberDoInsuranceNoteRemove(route.params.id, currentNote.value.id)
    isShowModalDelete.value = false
    loading.value = true
    const res = await memberDoInsuranceNoteList(route.params.id, insuranceId, {
      // convert sort to object
      sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
    })
    insuranceNotes.value = res.insuranceNotes
  }catch (err){
    console.log("err", err)
  }finally {
    isLoadingAction.value = false
    loading.value = false
  }
}

const columnsNote = [
  {
    heading: 'Статус',
    value: 'confirm',
    sortOptions: {
      sortable: true,
      sortByValue: 'comment',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_EQ_CHECK,
      filterValues: CONFIRM_MEMBER_DO_INSURANCES
    },
  },
  {
    heading: 'Дата',
    value: 'dateAdd',
    sortOptions: {
      sortable: true,
      sortByValue: 'dateAdd',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_DATE,
    },
  },
  {
    heading: 'Автор',
    value: 'userAddDesc',
    sortOptions: {
      sortable: true,
      sortByValue: 'userAddDesc',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Дата устранения',
    value: 'dateConfirm',
    sortOptions: {
      sortable: true,
      sortByValue: 'dateConfirm',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_DATE,
    },
  },
  {
    heading: 'Устранил',
    value: 'userConfirmDesc',
    sortOptions: {
      sortable: true,
      sortByValue: 'userConfirmDesc',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Замечание',
    value: 'comment',
    sortOptions: {
      sortable: true,
      sortByValue: 'comment',
    },
    filterOptions: {
      filterByValue: '',
      filterType: FILTER_TYPE_LIKE_PRE,
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
  memberDoInsuranceNoteList(route.params.id, insuranceId, {
    // convert sort to object
    sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
  }).then(res => {
    insuranceNotes.value = res.insuranceNotes
  }).finally(() => {
    loading.value = false
  })
}, {immediate: true})
</script>