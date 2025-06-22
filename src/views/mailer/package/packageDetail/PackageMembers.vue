<template>
  <div class="mt-4">
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
        <template #header-buttons v-if="canEdit">
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
      <div class="text-center py-10">
        <v-progress-circular indeterminate class="color-primary" />
      </div>
    </template>
  </div>
  <div v-if="notion" class="form-notion mt-4">
    <p class="form-notion-text" :class="{ [notion.status]: true }">{{ notion.text }}</p>
  </div>

  <package-member-detail-modal
    v-model="isShowModal"
    :member-data="currentInfo"
    :loading="loadingModal"
    @download-document="handleDocumentDownloadFile"
  />
</template>

<script setup>
import { TableWithFilter } from "@/components/index.js"
import {
  archiveDownload,
  linkDownload,
  membersInPackage,
  memberStatusPackageDictionaryFilterMailer,
  packageGenerate,
  packageMemberDetails,
  packageSend
} from "@/service/mailer/packageService"
import { FILTER_TYPE_DATE, FILTER_TYPE_EQ_WITH_SEARCH, FILTER_TYPE_LIKE } from "@/utils/dictionary"
import { downloadFile } from "@/utils/files"
import { computed, ref, shallowRef, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "vuex"
import PackageMemberDetailModal from "./PackageMemberDetailModal.vue"
import { hasPermission, PERMISSIONS } from "@/utils/Permission"

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
const headerInfo = computed(() => props.data.headerInfo)

const canEdit = hasPermission(PERMISSIONS.MAILER.EDIT)

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

const handlePackageGenerate = () => {
  packageGenerate(route.params.id)
    .then(res => {
      location.replace("/mailer/members-in-package/" + route.params.id)
    })
    .catch(err => {
      notion.value = {
        status: "error",
        text: err
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
        text: err
      }
    })
}

const columns = [
  {
    heading: "ИНН",
    value: "memberInn",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: "inn",
      filterType: FILTER_TYPE_LIKE
    }
  },
  {
    heading: "Статус",
    value: "packageMemberStatus",
    subValue: "statusName",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: "packageMemberStatus",
      filterType: FILTER_TYPE_EQ_WITH_SEARCH,
      filterApi: memberStatusPackageDictionaryFilterMailer
    }
  },
  {
    heading: "Дата создания",
    value: "dttmCreated",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: "dttmCreated",
      filterType: FILTER_TYPE_DATE
    }
  },
  {
    heading: "Дата генерации документов",
    value: "dttmGenerate",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: "dttmGenerate",
      filterType: FILTER_TYPE_DATE
    }
  },
  {
    heading: "Дата отправки писем",
    value: "dttmSendEmail",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: "dttmSendEmail",
      filterType: FILTER_TYPE_DATE
    }
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
            equal: true
          }
        ],
        type: "icon",
        icon: "mdi-download-box-outline",
        title: "Cкачать",
        handleFunc: item => handleDownloadFile(item)
      }
    ]
  }
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
        [item.filterBy]: item.value
      }
    }

    return acc
  }, {})
}

watch(
  [page, sort, filters, search],
  () => {
    membersInPackage(route.params.id, {
      page: page.value,
      row_page: size.value,
      filters: filters.value,
      // convert sort to object
      sort_by: sort.value.reduce((acc, i) => ({ ...acc, [i.sortBy]: i.sortType }), {}),
      search_string: search.value
    })
      .then(res => {
        list.value = res.items
        pagination.value = {
          count: res.data_header.count,
          pages: res.data_header.count_pages,
          page: res.data_header.page,
          size: res.data_header.row_page
        }
      })
      .finally(() => {
        loading.value = false
      })
  },
  { immediate: true }
)
</script>
