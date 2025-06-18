<template>
  <div class="mx-2 mt-4">
    <div class="d-flex">
      <v-btn class="ml-auto" prepend-icon="mdi-account-plus" color="primary" variant="outlined" @click="handleOpenCreate">
        Должность
      </v-btn>
    </div>
    <div class="table-block">
      <table-comp
          :columns="columns"
          :items="posts"
          :sort="sort"
          :setSort="setSort"
      />
    </div>
    <modal v-model="isShowModal" :title="isCreatePost ? 'Создание должности' : 'Редактирование должности'">
      <template #content>
        <v-form ref="formPost" class="mt-4">
          <v-row>
            <v-col cols="12">
              <v-select
                  variant="underlined"
                  v-model="post.enabled"
                  :items="STATUS"
                  label="Активен"
                  hide-details
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="post.title"
                  label="Должность"
                  variant="underlined"
                  hide-details
                  :rules="[v =>  !!v || 'Это обязательное поле.']"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="post.description"
                  label="Описание"
                  variant="underlined"
                  hide-details
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template #actions>
        <btn-secondary @click="() => isShowModal = false">
          Закрыть
        </btn-secondary>
        <btn-primary :loading="isLoading" @click="handleSubmit">
          {{ isCreatePost ? "Создать" : "Подтвердить" }}
        </btn-primary>
      </template>
    </modal>
    <modal v-model="dialogDeleteConfirm" title="Подтверждение действия" text="Вы действительно хотите удалить должность?">
      <template #actions>
        <btn-secondary @click="dialogDeleteConfirm = false">
          Закрыть
        </btn-secondary>
        <btn-primary :loading="isLoading" @click="handleDelete">
          Удалить
        </btn-primary>
      </template>
    </modal>
    <snackbar-notification
        v-model="notification.value"
        :color="notification.color"
        :message="notification.message"
    />
  </div>
</template>

<script setup>
import {onMounted, ref, shallowRef, watch} from "vue";
import {BtnPrimary, BtnSecondary} from "@/components/buttons";
import Modal from "@/components/Modal.vue";
import {
  employeeDictionary,
  employeeDictionaryAdd,
  employeeDictionaryDelete,
  employeeDictionaryEdit
} from "@/service/employees/dictionaryService.js";
import TableComp from "@/components/table/TableComp.vue";
import {DICTIONARY_STATUS, FILTER_TYPE_EQ_CHECK, FILTER_TYPE_LIKE} from "@/utils/dictionary.js";
import SnackbarNotification from "@/components/notifications/SnackbarNotification.vue";

const STATUS = [
  {
    value: true,
    title: "Да"
  },
  {
    value: false,
    title: "Нет"
  }
]

const sort = shallowRef([])

const formPost = ref(null)
const isShowModal = ref(false)
const dialogDeleteConfirm = ref(false)
const isCreatePost = ref(false)

const post = ref(null)
const posts = ref([])
const isLoading = ref(false)
const notification = ref({
  value: false,
  color: '',
  message: ''
})

const setSort = (value) => {
  sort.value = value
}

const handleOpenCreate = () => {
  isShowModal.value = true;
  isCreatePost.value = true;
  post.value = {
    enabled: true
  };
}

const handleEdit = (item) => {
  isShowModal.value = true
  isCreatePost.value = false
  post.value = JSON.parse(JSON.stringify(item))
}

const handleOpenDelete = (item) => {
  post.value = item
  dialogDeleteConfirm.value = true
}

const handleDelete = async () => {
  isLoading.value = true

  await employeeDictionaryDelete("post", post.value.id).then((res) => {
    dialogDeleteConfirm.value = false
  }).catch(err => {
    notification.value = {
      value: true,
      color: "error",
      message: err
    }
  }).finally(() => {
    isLoading.value = false
  })

  employeeDictionary("post").then(res => {
    posts.value = res.items
  })
}


const handleSubmit = async () => {
  const {valid} = await formPost.value.validate()

  if(valid){
    isLoading.value = true

    if(isCreatePost.value){
      await employeeDictionaryAdd("post", post.value).then((res) => {
        isShowModal.value = false
      }).catch(err => {
        notification.value = {
          value: true,
          color: "error",
          message: err
        }
      }).finally(() => {
        isLoading.value = false
      })
    }else{
      await employeeDictionaryEdit("post", post.value.id, post.value).then(res => {
        isShowModal.value = false
      }).catch(err => {
        notification.value = {
          value: true,
          color: "error",
          message: err
        }
      }).finally(() => {
        isLoading.value = false
      })
    }

    employeeDictionary("post").then(res => {
      posts.value = res.items
    })
  }
}

const columns = [
  {
    heading: 'Статус',
    width: '100px',
    value: 'enabled',
    filterOptions: {
      filterType: FILTER_TYPE_EQ_CHECK,
      filterValues: DICTIONARY_STATUS
    },
  },
  {
    heading: 'Должность',
    value: 'title',
    align: 'text-left',
    sortOptions: {
      sortable: true,
      sortByValue: 'title',
    },
    filterOptions: {
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Описание',
    value: 'description',
    align: 'text-left',
    sortOptions: {
      sortable: true,
      sortByValue: 'description',
    },
    filterOptions: {
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
        handleFunc: (item) => handleOpenDelete(item)
      },
    ]
  }
]

watch([sort], () => {
  employeeDictionary("post", {
    sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
  }).then(res => {
    posts.value = res.items
  })
}, { immediate: true })
</script>
<style lang="scss" scoped>
.table-block{
  max-height: calc(100vh - 256px);
  overflow: auto;
}
.theme-list{
  max-height: 500px;
  overflow-y: scroll;
}
</style>
