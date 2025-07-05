<template>
  <app-page-title iconClassname="mdi-account-group" title="Список сотрудников"></app-page-title>
  <v-card class="px-4 py-4">
    <router-link v-if="canEdit" :to="createEmployee">
      <v-btn
        min-width="46"
        width="46"
        height="46"
        variant="flat"
        title="Создать пользователя"
        class="table-head-icon"
      >
        <v-icon class="color-primary" size="x-large" icon="mdi-account-plus"></v-icon>
      </v-btn>
    </router-link>
    <template v-if="!loading">
      <table-with-filter
        :columns="columns"
        :detailsTo="detailsTo"
        :items="list"
        :search="search"
        :searchHint="searchHint"
        :pagination="pagination"
        :sort="sort"
        :countFilters="countFilters"
        :setPage="setPage"
        :setSort="setSort"
        :setSearch="setSearch"
        :setFilter="setFilter"
        @clear-all-settings="handleClearAllSettings"
      />
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
import {
  employeeDepartmentForFilter,
  employeePostForFilter
} from "@/service/employees/dictionaryService.js"
import { employeeList } from "@/service/employees/employeeService.js"
import {
  FILTER_TYPE_EQ_MULTI,
  FILTER_TYPE_EQ_MULTI_WITH_SEARCH,
  FILTER_TYPE_LIKE
} from "@/utils/dictionary.js"
import { computed, ref, shallowRef, watch } from "vue"
import { useStore } from "vuex"

const page = ref(1)
const search = ref("")
const filters = shallowRef({})
const sort = shallowRef([])
// Example sort
// const sort = [{
//   sortBy: "id",
//   sortType: "asc"
// }]

const detailsTo = "/employee/view/"
const createEmployee = "/employee/create"
const searchHint = "Поиск по фамилии, имени, отчеству или номеру телефона"

const store = useStore()

const list = shallowRef([])
const pagination = shallowRef({})
const loading = ref(true)

const size = computed(() => store.getters["settings/rowPage"])
const countFilters = computed(() => Object.keys(filters.value).length)
const canEdit = computed(() => store.getters["auth/userRoles"].includes("ROLE_EMPLOYEES_EDIT"))

const columns = [
  {
    heading: "",
    width: "80px",
    value: "photo",
    type: "image",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: ""
    }
  },
  {
    heading: "ФИО",
    value: "fio",
    sortOptions: {
      sortable: true,
      sortByValue: "fio"
    },
    filterOptions: {
      filterByValue: "",
      filterType: FILTER_TYPE_LIKE
    }
  },
  {
    heading: "Подразделение",
    value: "department",
    subValue: "title",
    sortOptions: {
      sortable: true,
      sortByValue: "department"
    },
    filterOptions: {
      filterByValue: "department",
      filterType: FILTER_TYPE_EQ_MULTI,
      filterApi: employeeDepartmentForFilter
    }
  },
  {
    heading: "Должность",
    value: "post",
    tooltipValue: "functionality",
    subValue: "title",
    sortOptions: {
      sortable: true,
      sortByValue: "post"
    },
    filterOptions: {
      filterByValue: "post",
      filterType: FILTER_TYPE_EQ_MULTI_WITH_SEARCH,
      filterApi: employeePostForFilter
    }
  },
  {
    heading: "Добавочный номер",
    value: "innerPhone",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: "innerPhone",
      filterType: FILTER_TYPE_LIKE
    }
  },
  {
    heading: "Внутренний номер",
    value: "internalPhone",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: "internalPhone",
      filterType: FILTER_TYPE_LIKE
    }
  },
  {
    heading: "Номер телефона",
    value: "mobilePhone",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: "mobilePhone",
      filterType: FILTER_TYPE_LIKE
    }
  },
  {
    heading: "Почта",
    value: "emails",
    type: "format-list",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: "emails",
      filterType: FILTER_TYPE_LIKE
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

watch(
  [page, sort, filters, search],
  () => {
    employeeList({
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
