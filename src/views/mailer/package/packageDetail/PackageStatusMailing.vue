<template>
  <template v-if="!loading">
    <table-comp
      :columns="columns"
      :items="list"
      :pagination="pagination"
      :sort="sort"
      :setPage="setPage"
      :setSort="setSort"
    />
  </template>
  <template v-else>
    <div class="text-center py-10">
      <v-progress-circular indeterminate class="color-primary" />
    </div>
  </template>
</template>

<script setup>
import { TableComp } from "@/components/index.js"
import { mailingStatusReport } from "@/service/mailer/reportService"
import { computed, ref, shallowRef, watch } from "vue"
import { useRoute } from "vue-router"
import { useStore } from "vuex"

const page = ref(1)
const sort = shallowRef([])

const store = useStore()
const route = useRoute()

const list = shallowRef([])
const pagination = shallowRef({})
const loading = ref(true)

const size = computed(() => store.getters["settings/rowPage"])

const columns = ref([
  {
    heading: "Наименование организации",
    value: "memberName",
    sortOptions: {
      sortable: false,
    },
    filterOptions: {},
  },
  {
    heading: "ИНН",
    value: "inn",
    sortOptions: {
      sortable: false,
    },
    filterOptions: {},
  },
  {
    heading: "Электронная почта",
    value: "email",
    sortOptions: {
      sortable: false,
    },
    filterOptions: {},
  },
  {
    heading: "Статус письма",
    value: "status",
    sortOptions: {
      sortable: false,
    },
    filterOptions: {},
  },
])

const setPage = value => {
  page.value = value
}

const setSort = value => {
  sort.value = value
}

watch(
  [page, sort],
  () => {
    mailingStatusReport(route.params.id, {
      page: page.value,
      row_page: size.value,
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

<style scoped>
.color-primary {
  color: rgb(var(--color-primary));
}

.status-column {
  min-width: 120px;
}
</style>
