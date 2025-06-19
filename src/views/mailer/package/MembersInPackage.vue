<template>
  <app-page-title iconClassname="mdi-email-multiple" title="Рассылка"></app-page-title>
  <v-card class="px-4 py-4">
    <v-row>
      <v-col cols="12" md="12" class="mb-6">
        <v-expansion-panels v-model="panel">
          <v-expansion-panel>
            <v-expansion-panel-title class="panel-header">
              <template v-slot:default="{ expanded }">
                <h4 class="panel-section-header">
                  <v-icon icon="mdi-menu-down"></v-icon>
                  <span class="panel-section-header-text">Данные для рассылки</span>
                </h4>
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row class="pt-2">
                <v-col cols="12" md="3">
                  <p class="mr-1 font-weight-bold">Тип:</p>
                </v-col>
                <v-col cols="12" md="3">
                  {{ headerInfo?.package?.packageType.typeName }}
                </v-col>
                <v-col cols="12" md="3">
                  <p class="mr-1 font-weight-bold">Статус:</p>
                </v-col>
                <v-col cols="12" md="3">
                  {{ headerInfo?.package?.packageStatus.statusName }}
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="3">
                  <p class="mr-1 font-weight-bold">CPO:</p>
                </v-col>
                <v-col cols="12" md="3">
                  {{ headerInfo?.package?.sroOrganization.title }}
                </v-col>
                <v-col cols="12" md="3">
                  <p class="mr-1 font-weight-bold">Дата создания:</p>
                </v-col>
                <v-col cols="12" md="3">
                  {{ shortDateFormat(headerInfo?.package?.dttmCreated) }}
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <template v-if="!loading">
      <table-with-filter
        :columns="columns"
        :items="list"
        :pagination="pagination"
        :sort="sort"
        :countFilters="countFilters"
        :setPage="setPage"
        :setSort="setSort"
        :setFilter="setFilter"
        :handleClickRow="handleClickRow"
        @clear-all-settings="handleClearAllSettings"
      >
        <template #header-buttons>
          <v-btn
            v-if="headerInfo?.package?.packageStatus.status === 'created'"
            @click="handlePackageGenerate"
            min-width="46"
            width="46"
            height="46"
            variant="flat"
            title="Генерация документов"
            class="table-head-icon"
          >
            <v-icon class="color-primary" size="x-large" icon="mdi-file-sign"></v-icon>
          </v-btn>
          <v-btn
            v-if="headerInfo?.package?.packageStatus.status === 'generated'"
            @click="handlePackageSend"
            min-width="46"
            width="46"
            height="46"
            variant="flat"
            title="Рассылка писем"
            class="table-head-icon"
          >
            <v-icon
              class="color-primary"
              size="x-large"
              icon="mdi-invoice-text-send-outline"
            ></v-icon>
          </v-btn>
        </template>
      </table-with-filter>
    </template>
    <template v-else>
      <div style="clear: both"></div>
      <div class="text-center pb-10">
        <v-progress-circular indeterminate class="color-primary" />
      </div>
    </template>
    <div v-if="notion" class="form-notion mt-4">
      <p class="form-notion-text" :class="{ [notion.status]: true }">{{ notion.text }}</p>
    </div>
    <div class="card-footer d-flex justify-end mt-4">
      <v-btn color="primary" variant="outlined" @click="handleBack"> Назад </v-btn>
    </div>
  </v-card>

  <package-member-detail-modal
    v-model="isShowModal"
    :member-data="currentInfo"
    :loading="loadingModal"
    :organization-title="headerInfo?.package?.sroOrganization.title"
    @download-document="handleDocumentDownloadFile"
  />
</template>

<script setup>
import { computed, onMounted, ref, shallowRef, watch } from "vue"
import {
  archiveDownload,
  linkDownload,
  membersInPackage,
  memberStatusPackageDictionaryFilterMailer,
  packageAdd,
  packageDetails,
  packageGenerate,
  packageMemberDetails,
  packageSend,
} from "@/service/mailer/packageService.js"
import AppPageTitle from "@/layouts/AppPageTitle.vue"
import { TableWithFilter } from "@/components/index.js"
import {
  FILTER_TYPE_DATE,
  FILTER_TYPE_EQ_WITH_SEARCH,
  FILTER_TYPE_LIKE,
} from "@/utils/dictionary.js"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import { downloadFile } from "@/utils/files.js"
import { shortDateFormat } from "@/utils/format.js"
import PackageMemberDetailModal from "./packageMemberDetailModal.vue"

const page = ref(1)
const search = ref("")
const filters = shallowRef({})
const sort = shallowRef([])

const isShowModal = ref(false)
const currentInfo = ref(null)
const loadingModal = ref(true)

const store = useStore()
const route = useRoute()
const router = useRouter()

const list = shallowRef([])
const pagination = shallowRef({})
const loading = ref(true)

const size = computed(() => store.getters["settings/rowPage"])
const countFilters = computed(() => Object.keys(filters.value).length)

const notion = ref(null)
const panel = ref([0])
const headerInfo = ref({})

const handleClickRow = item => {
  handleShowModal(item)
}
const handleShowModal = async item => {
  isShowModal.value = true
  loadingModal.value = true

  try {
    currentInfo.value = await packageMemberDetails(item.id)

    // currentInfo.value = packageDetail.value
    loadingModal.value = false
  } catch (err) {
    console.log("err", err)
  }
}

const handleDownloadFile = async item => {
  const res = await archiveDownload(item.id)
  const fileName =
    item.packageType.type + "_" + item.memberInn + "_" + item.dttmCreated.split(" ")[0]
  downloadFile(res, fileName)
}

const handleDocumentDownloadFile = async (link, document, member) => {
  const res = await linkDownload(link)
  const fileName = document.id + "_" + member.memberInn + "_" + member.dttmCreated.split(" ")[0]
  downloadFile(res, fileName)
}

const handleBack = () => {
  router.go(-1)
}

const handlePackageGenerate = () => {
  packageGenerate(route.params.id)
    .then(res => {
      location.replace("/mailer/members-in-package/" + route.params.id)
    })
    .catch(err => {
      notion.value = {
        status: "error",
        text: err,
      }
    })
}

const handlePackageSend = () => {
  packageSend(route.params.id)
    .then(res => {
      location.replace("/mailer/members-in-package/" + route.params.id)
    })
    .catch(err => {
      notion.value = {
        status: "error",
        text: err,
      }
    })
}

const configActions = [
  {
    icon: "mdi-close",
    handleFunc: handleBack,
  },
]

const columns = [
  {
    heading: "ИНН",
    value: "memberInn",
    sortOptions: {
      sortable: false,
    },
    filterOptions: {
      filterByValue: "inn",
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: "Статус",
    value: "packageMemberStatus",
    subValue: "statusName",
    sortOptions: {
      sortable: false,
    },
    filterOptions: {
      filterByValue: "packageMemberStatus",
      filterType: FILTER_TYPE_EQ_WITH_SEARCH,
      filterApi: memberStatusPackageDictionaryFilterMailer,
    },
  },
  {
    heading: "Дата создания",
    value: "dttmCreated",
    sortOptions: {
      sortable: false,
    },
    filterOptions: {
      filterByValue: "dttmCreated",
      filterType: FILTER_TYPE_DATE,
    },
  },
  {
    heading: "Дата генерации документов",
    value: "dttmGenerate",
    sortOptions: {
      sortable: false,
    },
    filterOptions: {
      filterByValue: "dttmGenerate",
      filterType: FILTER_TYPE_DATE,
    },
  },
  {
    heading: "Дата отправки писем",
    value: "dttmSendEmail",
    sortOptions: {
      sortable: false,
    },
    filterOptions: {
      filterByValue: "dttmSendEmail",
      filterType: FILTER_TYPE_DATE,
    },
  },
  {
    heading: "",
    value: "",
    type: "custom-buttons",
    buttons: [
      {
        conditions: [
          {
            title: "isDocsGenerated",
            value: true,
            equal: true,
          },
        ],
        type: "icon",
        icon: "mdi-download-box-outline",
        title: "Cкачать",
        handleFunc: item => handleDownloadFile(item),
      },
    ],
  },
]

const setPage = value => {
  page.value = value
}

const setSort = value => {
  sort.value = value
}

const setSearch = value => {
  search.value = value
}

const handleClearAllSettings = () => {
  page.value = 1
  filters.value = {}
  sort.value = []
  search.value = ""
}

const setFilter = dataFilters => {
  // dataFilters always is arr
  filters.value = dataFilters.reduce((acc, item) => {
    const type = typeof item.value
    if (
      (type === "object" && item.value?.length) ||
      (type === "string" && item.value) ||
      (type === "number" && item.value) ||
      (type === "boolean" && item.value === false)
    ) {
      return {
        ...acc,
        [item.filterBy]: item.value,
      }
    }

    return acc
  }, {})
}

onMounted(async () => {
  headerInfo.value = await packageDetails(route.params.id)
})

watch(
  [page, sort, filters, search],
  () => {
    membersInPackage(route.params.id, {
      page: page.value,
      row_page: size.value,
      filters: filters.value,
      // convert sort to object
      sort_by: sort.value.reduce((acc, i) => ({ ...acc, [i.sortBy]: i.sortType }), {}),
      search_string: search.value,
    })
      .then(res => {
        list.value = res.items
        pagination.value = {
          count: res.data_header.count,
          pages: res.data_header.count_pages,
          page: res.data_header.page,
          size: res.data_header.row_page,
        }
      })
      .finally(() => {
        loading.value = false
      })
  },
  { immediate: true }
)
</script>
