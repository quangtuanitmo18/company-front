<template>
  <app-page-title iconClassname="mdi-account-group" title="Список пользователей"></app-page-title>
  <card-with-actions title="" subtitle="">
    <template v-if="!loading">
      <table-with-filter
          :key="tableKey"
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
        <template #header-buttons>
          <v-btn @click="createUser" min-width="46" width="46" height="46" variant="flat" title="Создать" class="table-head-icon">
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
  </card-with-actions>
</template>

<script setup>
import {computed, onMounted, ref, shallowRef, watch} from "vue";
import { useRouter } from "vue-router";
import {useStore} from "vuex";
import {userList} from "@/service/auth/users/userService.js";
import {
  FILTER_TYPE_EQ_CHECK,
  FILTER_TYPE_LIKE,
  FILTER_USER_STATUS
} from "@/utils/dictionary.js";
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import {TableWithFilter} from "@/components/index.js";
import CardWithActions from "@/components/CardWithActions.vue";

const page = ref(1)
const search = ref("")
const filters = shallowRef({'enabled': 'true'})
const sort = shallowRef([])

const router = useRouter()
const detailsTo = '/auth/user/';
const store = useStore()
const list = shallowRef([])
const pagination = shallowRef({})
const loading = ref(true)
const tableKey = ref(1)

const size = computed(() => store.getters["settings/rowPage"])
const countFilters = computed(() => Object.keys(filters.value).length)

const columns = [
  {
    heading: 'Статус',
    value: 'enabled',
    sortOptions: {
      sortable: true,
      sortByValue: 'enabled',
    },
    filterOptions: {
      filterByValue: "enabled",
      filterType: FILTER_TYPE_EQ_CHECK,
      filterValues: FILTER_USER_STATUS,
      filterDefaultValue: true,
    },
  },
  {
    heading: 'ФИО',
    value: 'fio',
    sortOptions: {
      sortable: true,
      sortByValue: "fio",
    },
    filterOptions: {
      filterByValue: 'fio',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Логин',
    value: 'username',
    sortOptions: {
      sortable: true,
      sortByValue: "username",
    },
    filterOptions: {
      filterByValue: 'username',
      filterType: FILTER_TYPE_LIKE,
    },
  },
  {
    heading: 'Почта',
    value: 'email',
    sortOptions: {
      sortable: true,
      sortByValue: "email",
    },
    filterOptions: {
      filterByValue: 'email',
      filterType: FILTER_TYPE_LIKE,
    },
  },
]
const setPage = (value) => {
  page.value = value
}
const setSort = (value) => {
  sort.value = value
}
const setSearch = (value) => {
  search.value = value
}
const handleClearAllSettings = () => {
  page.value = 1
  filters.value = {}
  sort.value = []
  search.value = ""
}
const setFilter = (dataFilters) => {
  // dataFilters always is arr
  filters.value = dataFilters.reduce((acc, item) => {
    const type = typeof item.value
    if((type === "object" && item.value?.length) || (type === "string" && item.value) || (type === "number" && item.value) || (type === "boolean")){
      return {
        ...acc,
        [item.filterBy]: item.value
      }
    }

    return acc
  }, {})
}

const handleRedirect = (path) => {
  router.push({ name: path })
}

const createUser = () => handleRedirect("auth-user-create")

watch([page, sort, filters, search], () => {
  userList({
    page: page.value,
    row_page: size.value,
    filters: filters.value,
    // convert sort to object
    sort_by: sort.value.reduce((acc, i) => ({...acc, [i.sortBy]: i.sortType}), {}),
    search_string: search.value
  }).then(res => {
    list.value = res.items
    pagination.value = {
      count: res.data_header.count,
      pages: res.data_header.count_pages,
      page: res.data_header.page,
      size: res.data_header.row_page,
    }
  }).finally(() => {
    loading.value = false
  })
}, { immediate: true })

onMounted(() => {
  tableKey.value = tableKey.value + 1
})
</script>

<style scoped lang="scss">

</style>