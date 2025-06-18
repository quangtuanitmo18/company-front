<template>
  <div v-if="pagination" class="text-center d-flex justify-space-between align-end mt-4">
    <div class="d-flex align-center">
      <p class="text-sm">
        {{ showInfoPage(pagination) }}
      </p>
    </div>
    <v-pagination
        v-model="pagination.page"
        v-if="pagination.pages > 1"
        :length="pagination.pages"
        :total-visible="9"
        @update:modelValue="handleChangePage"
    ></v-pagination>
  </div>
</template>

<script setup>
const { setPage } = defineProps(["pagination", "setPage"])

const handleChangePage = (newPage) => {
  setPage(newPage)

  // Scroll to Top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

const showInfoPage = (pagination) => {
  const countAll = pagination.count
  const page = pagination.page
  const size = pagination.size

  const countEnd = page * size < countAll ? page * size : countAll
  const countStart = (page - 1) * size + 1

  return `Отображено ${countStart} - ${countEnd} из ${countAll}`
}
</script>