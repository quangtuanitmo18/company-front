<template>
  <app-page-title iconClassname="mdi-check-all" title="Список ролей"></app-page-title>
  <card-with-actions title="" subtitle="">
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
        <template #header-buttons>
          <v-btn @click="createRole" min-width="46" width="46" height="46" variant="flat" title="Создать" class="table-head-icon">
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
import {computed, ref, shallowRef, watch} from "vue";
import { useRouter, useRoute } from "vue-router";
import {useStore} from "vuex";
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import CardWithActions from "@/components/CardWithActions.vue";
import {TableWithFilter} from "@/components/index.js";
import {userRoleList, userRoleListByGroupForFilter} from "@/service/auth/users/userService.js";
import {
  FILTER_TYPE_EQ,
  FILTER_TYPE_EQ_BY_GROUP,
  FILTER_TYPE_EQ_CHECK,
  FILTER_USER_STATUS
} from "@/utils/dictionary.js";
import {projectListForFilter} from "@/service/auth/users/projectService.js";

const page = ref(1)
const search = ref("")
const filters = shallowRef({'enabled': 'true'})
const sort = shallowRef([])

const router = useRouter()
const detailsTo = '/auth/role/';
const store = useStore()
const list = shallowRef([])
const pagination = shallowRef({})
const loading = ref(true)

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
      filterByValue: 'enabled',
      filterType: FILTER_TYPE_EQ_CHECK,
      filterValues: FILTER_USER_STATUS,
      filterDefaultValue: true,
    },
  },
  {
    heading: 'Проект',
    value: 'project',
    subValue: 'title',
    sortOptions: {
      sortable: true,
      sortByValue: 'project',
    },
    filterOptions: {
      filterByValue: 'project',
      filterType: FILTER_TYPE_EQ,
      filterApi: projectListForFilter
    },
  },
  {
    heading: 'Роль',
    value: 'title',
    sortOptions: {
      sortable: true,
      sortByValue: 'role_id',
    },
    filterOptions: {
      filterByValue: 'role_id',
      filterType: FILTER_TYPE_EQ_BY_GROUP,
      filterApi: userRoleListByGroupForFilter
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

const createRole = () => handleRedirect("auth-user-role-create")

watch([page, sort, filters, search], () => {
  userRoleList({
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

</script>

<style scoped lang="scss">

</style>