<template>
  <app-page-title iconClassname="mdi-email-multiple" title="Список рассылок"></app-page-title>
  <v-card class="px-4 py-4">
    <template v-if="!loading">
      <table-with-filter
        :columns="columns"
        :detailsTo="detailsTo"
        :items="list"
        :pagination="pagination"
        :sort="sort"
        :countFilters="countFilters"
        :setPage="setPage"
        :setSort="setSort"
        :setFilter="setFilter"
        @clear-all-settings="handleClearAllSettings"
      >
        <template #header-buttons v-if="canEdit">
          <v-btn
            @click="createPackage"
            min-width="46"
            width="46"
            height="46"
            variant="flat"
            title="Создать"
            class="table-head-icon"
          >
            <v-icon class="color-primary" size="x-large" icon="mdi-plus"></v-icon>
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
  </v-card>
</template>

<script setup>
import { TableWithFilter } from "@/components/index.js"
import AppPageTitle from "@/layouts/AppPageTitle.vue"
import { packageList, typePackageDictionaryFilterMailer } from "@/service/mailer/packageService.js"
import { sroOrgListForFilterMailer } from "@/service/ossa/clients/sroOrganizationService.js"
import {
  FILTER_TYPE_DATE,
  FILTER_TYPE_EQ_MULTI_WITH_SEARCH,
  FILTER_TYPE_EQ_WITH_SEARCH
} from "@/utils/dictionary.js"
import { hasPermission, PERMISSIONS } from "@/utils/permission.js"
import { computed, ref, shallowRef, watch } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

const router = useRouter()
const page = ref(1)
const search = ref("")
const filters = shallowRef({})
const sort = shallowRef([])
// Example sort
// const sort = [{
//   sortBy: "id",
//   sortType: "asc"
// }]

const canEdit = hasPermission(PERMISSIONS.MAILER.EDIT)

const detailsTo = "/mailer/members-in-package/"

const store = useStore()

const list = shallowRef([])
const pagination = shallowRef({})
const loading = ref(true)

const size = computed(() => store.getters["settings/rowPage"])
const countFilters = computed(() => Object.keys(filters.value).length)

const columns = [
  {
    heading: "",
    value: "",
    sortOptions: {
      sortable: false
    },
    filterOptions: {}
  },
  {
    heading: "Организация",
    value: "sroOrganization",
    subValue: "title",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: "sro",
      filterType: FILTER_TYPE_EQ_MULTI_WITH_SEARCH,
      filterApi: sroOrgListForFilterMailer
    },
    align: "left"
  },
  {
    heading: "Тип",
    value: "packageType",
    subValue: "typeName",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: "packageType",
      filterType: FILTER_TYPE_EQ_WITH_SEARCH,
      filterApi: typePackageDictionaryFilterMailer
    },
    align: "left"
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
    heading: "Статус",
    value: "packageStatus",
    subValue: "statusName",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      // filterByValue: 'package_status',
      // filterType: FILTER_TYPE_EQ_WITH_SEARCH,
      // filterApi: statusPackageDictionaryFilterMailer
    }
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

const handleRedirect = path => {
  router.push({ name: path })
}

const createPackage = () => handleRedirect("mailer-package-create")

watch(
  [page, sort, filters, search],
  () => {
    packageList({
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
