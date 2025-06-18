<template>
  <div class="mx-2 mt-4" v-if="data.eventsDo">
    <div class="d-flex mb-2">
      <v-btn class="ml-auto" prepend-icon="mdi-chat-plus" color="primary" variant="outlined" @click="handleOpenCreate">
        Комметарий
      </v-btn>
    </div>
    <div class="table-block">
      <table-comp
          :columns="columns"
          :items="short ? data.eventsDo.slice(0, 4) : data.eventsDo"
      />
    </div>
    <modal width="1000" v-model="isShowModal" :title="isCreateComment ? 'Создание комметария' : 'Редактирование комметария'">
      <template #content>
        <v-form ref="formComment" class="mt-4">
          <v-row>
            <v-col cols="5">
              <div class="theme-list">
                <v-list v-for="group in remarkThemes">
                  <v-list-subheader>{{ group.title }}</v-list-subheader>

                  <v-list-item
                      v-for="(theme, i) in group.remarkThemes"
                      :key="i"
                  >
                    <template #prepend>
                      <v-checkbox-btn :disabled="!isCreateComment" class="color-primary" v-model="theme.active"></v-checkbox-btn>
                    </template>
                    <v-list-item-title>{{ theme.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
            </v-col>
            <v-col cols="7">
              <v-row>
                <v-col cols="12">
                  <v-textarea
                      rows="6"
                      v-model="comment.comment"
                      label="Комментарий"
                      variant="underlined"
                      hide-details
                      :rules="[v =>  !!v || 'Это обязательное поле.']"
                  >
                  </v-textarea>
                </v-col>
                <v-col cols="4">
                  <v-select
                      variant="underlined"
                      v-model="comment.contactDo"
                      :items="getContacts(data.contactsDo)"
                      label="Контакт"
                      hide-details
                      no-data-text="Нет контактов"
                  >
                    <template v-slot:item="{props, item}">
                      <v-list-item v-bind="props">
                        <template v-slot:title>
                          <div>{{item.raw.title}}</div>
                        </template>
                        <template v-if="item.raw.subtitle" v-slot:subtitle>
                          <div>{{item.raw.subtitle}}</div>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="4">
                  <v-select
                      variant="underlined"
                      v-model="comment.ringStatus"
                      :items="DO_RING_STATUS"
                      label="Статус"
                      hide-details
                  >
                  </v-select>
                </v-col>
                <v-col cols="4">
                  <date-picker
                      :teleport="true"
                      :hideDetails="true"
                      v-model="comment.controlDate"
                      label="Дата контроля"
                  ></date-picker>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template #actions>
        <btn-secondary @click="() => isShowModal = false">
          Закрыть
        </btn-secondary>
        <btn-primary :loading="isLoading" @click="handleSubmit">
          {{ isCreateComment ? "Создать" : "Подтвердить" }}
        </btn-primary>
      </template>
    </modal>
  </div>
</template>

<script setup>
import {onMounted, ref, shallowRef} from "vue";
import TableComp from "@/components/table/TableComp.vue";
import {
  DO_RING_STATUS,
  FILTER_TYPE_DATE, FILTER_TYPE_DATE_TIME,
  FILTER_TYPE_EQ_CHECK,
  FILTER_TYPE_LIKE,
  TYPE_PHONE
} from "@/utils/dictionary.js";
import {BtnPrimary, BtnSecondary} from "@/components/buttons";
import Modal from "@/components/Modal.vue";
import {eventDoAdd, eventDoEdit, eventDoRemarkThemes} from "@/service/ossa/sqlup/eventDoService.js";
import {useRoute} from "vue-router";
import DatePicker from "@/components/date/DatePicker.vue";

const {data} = defineProps(["data", "short"])
const emit = defineEmits(["updateInfo"])

const route = useRoute()
const comment = ref({
  memberDo: +route.params.id
})
const formComment = ref(null)
const isShowModal = ref(false)
const isCreateComment = ref(false)
const currentComment = ref(null)
const themes = shallowRef([])
const remarkThemes = ref([])
const isLoading = ref(false)

const handleOpenCreate = () => {
  isShowModal.value = true;
  isCreateComment.value = true;
  comment.value = {memberDo: +route.params.id};
  for(let group of remarkThemes.value){
    for(let theme of group.remarkThemes){
      theme.active = false
    }
  }
}

const handleEdit = (item) => {
  isShowModal.value = true
  isCreateComment.value = false
  currentComment.value = item

  comment.value.comment = item.comment
  comment.value.ringStatus = item.ringStatus?.id
  comment.value.controlDate = item.controlDate
  comment.value.contactDo = item.contactDo?.id

  for(let group of remarkThemes.value){
    for(let theme of group.remarkThemes){
      if(item.remarkThemes.some(i => i.id === theme.id)){
        theme.active = true
      }else{
        theme.active = false
      }
    }
  }
}

const columns = [
  {
    heading: 'Статус',
    value: 'ringStatus',
    subValue: 'id',
    transcript: true,
    filterOptions: {
      filterType: FILTER_TYPE_EQ_CHECK,
      filterValues: DO_RING_STATUS
    },
  },
  {
    heading: 'Дата контроля',
    value: 'controlDate',
    filterOptions: {
      filterType: FILTER_TYPE_DATE,
    },
  },
  {
    heading: 'Дата',
    value: 'activateDate',
    filterOptions: {
      filterType: FILTER_TYPE_DATE_TIME,
    },
  },
  {
    heading: 'Автор',
    value: 'sqlupUserAdd',
    filterOptions: {
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Тел. номер абонента',
    value: 'contactDo',
    subValue: 'contact',
    filterOptions: {
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Комментарий',
    width: '600px',
    align: 'text-left',
    value: 'comment',
    tooltipValue: 'comment',
    filterOptions: {
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Тема',
    value: 'activateDate',
    type: 'themes',
  },
  {
    heading: '',
    value: '',
    type: "custom-buttons",
    buttons: [
      {
        conditions: [
          {
            title: "isEdited",
            value: true,
            equal: true
          },
        ],
        type: "icon",
        icon: "mdi-square-edit-outline",
        title: "Редактировать",
        handleFunc: (item) => handleEdit(item)
      },
    ]
  }
]

const getContacts = (contacts) => {
  return contacts.filter(contact => contact.contactType.id === TYPE_PHONE && contact.isActive).map((contact => ({value: contact.id, title: contact.contact, subtitle: contact.contactPerson})))
}

const handleSubmit = async () => {
  const {valid} = await formComment.value.validate()

  if(valid){
    isLoading.value = true
    const activeThemes = []

    for(let group of remarkThemes.value){
      for(let theme of group.remarkThemes){
        if(theme.active){
          activeThemes.push(theme.id)
        }
      }
    }

    if(isCreateComment.value){
      eventDoAdd({
        ...comment.value,
        remarkThemes: activeThemes
      }).then(res => {
        isShowModal.value = false
        emit("updateInfo")
        comment.value = {
          memberDo: +route.params.id
        }
      }).finally(() => {
        isLoading.value = false
      })
    }else{
      eventDoEdit(currentComment.value.id, {
        ...comment.value,
      }).then(res => {
        isShowModal.value = false
        emit("updateInfo")
        comment.value = {
          memberDo: +route.params.id
        }
      }).finally(() => {
        isLoading.value = false
      })
    }


  }
}

onMounted(() => {
  eventDoRemarkThemes(data.sro.id).then(res => {
    remarkThemes.value = res.items.filter(item => item.remarkThemes.length)
    themes.value = res.items.filter(item => item.remarkThemes.length)
  })
})
</script>
<style lang="scss" scoped>
.table-block{
  max-height: calc(100vh - 308px);
  overflow: auto;
}
.theme-list{
  max-height: 500px;
  overflow-y: scroll;
}
</style>
