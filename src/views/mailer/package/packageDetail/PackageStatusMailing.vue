<template>
  <div class="mt-4">
    <template v-if="!loading">
      <table-with-filter
        :columns="columns"
        :items="list"
        :pagination="pagination"
        :countFilters="countFilters"
        :sort="sort"
        :setPage="setPage"
        :setSort="setSort"
        :setFilter="setFilter"
        @clear-all-settings="handleClearAllSettings"
      />
    </template>
    <template v-else>
      <div class="text-center py-10">
        <v-progress-circular indeterminate class="color-primary" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { TableWithFilter } from "@/components/index.js"
import { mailingStatusReport } from "@/service/mailer/reportService"
import { FILTER_TYPE_EQ } from "@/utils/dictionary"
import { computed, ref, shallowRef, watch } from "vue"
import { useRoute } from "vue-router"
import { useStore } from "vuex"

const page = ref(1)
const sort = shallowRef([])
const filters = shallowRef({})

const store = useStore()
const route = useRoute()

const list = shallowRef([])
const pagination = shallowRef({})
const loading = ref(true)

const size = computed(() => store.getters["settings/rowPage"])
const countFilters = computed(() => Object.keys(filters.value).length)

const columns = ref([
  {
    heading: "Наименование организации",
    value: "memberName",
    sortOptions: {
      sortable: false
    },
    filterOptions: {}
  },
  {
    heading: "ИНН",
    value: "inn",
    sortOptions: {
      sortable: false
    },
    filterOptions: {}
  },
  {
    heading: "Электронная почта",
    value: "email",
    sortOptions: {
      sortable: false
    },
    filterOptions: {}
  },
  {
    heading: "Статус письма",
    value: "status",
    sortOptions: {
      sortable: false
    },
    filterOptions: {
      filterByValue: "onlyFailed",
      filterType: FILTER_TYPE_EQ,
      filterValues: [
        {
          title: "Не успешно",
          value: true
        }
      ],
      filterDefaultValue: false
    }
  }
])

const setPage = value => {
  page.value = value
}

const setSort = value => {
  sort.value = value
}
const handleClearAllSettings = () => {
  page.value = 1
  filters.value = {}
  sort.value = []
}

const setFilter = dataFilters => {
  // dataFilters always is arr
  filters.value = dataFilters.reduce((acc, item) => {
    const type = typeof item.value
    if (
      (type === "object" && item.value?.length) ||
      (type === "string" && item.value) ||
      (type === "number" && item.value) ||
      type === "boolean"
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
  [page, sort, filters],
  () => {
    mailingStatusReport(route.params.id, {
      page: page.value,
      row_page: size.value,
      parameters: filters.value
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

<style scoped>
.color-primary {
  color: rgb(var(--color-primary));
}

.status-column {
  min-width: 120px;
}
</style>
