<template>
  <v-card class="px-4 py-4">
    <calendar-custom
      @update-date="date => (selectedDate = date)"
      :events="events"
    ></calendar-custom>
    <div class="filter-absolute">
      <Filters
        :countFilters="countFilters"
        :filters="innerFilters"
        :setFilter="handleFilter"
        :clearFilter="handleClearFilter"
      ></Filters>
    </div>
  </v-card>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { calendarList } from "@/service/employees/calendarService.js"
import { getDateNow, getFirstAndLastDayOfMonth } from "@/utils/format.js"
import { CalendarCustom, Filters } from "@/components"
import { COLOR_SCHEME_CALENDAR, FILTER_TYPE_EQ_MULTI } from "@/utils/dictionary.js"
import { employeeDepartmentForFilter } from "@/service/employees/dictionaryService.js"
import { useStore } from "vuex"

const store = useStore()

const defaultFilters = () => {
  return [
    {
      filterBy: "department",
      value: null,
      label: "Отдел",
      type: FILTER_TYPE_EQ_MULTI,
      selectValues: [],
      api: employeeDepartmentForFilter
    }
  ]
}

const innerFilters = ref(defaultFilters())
const filters = ref({})
const selectedDate = ref(getDateNow())
const events = ref([])

const countFilters = computed(() => Object.keys(filters.value).length)
const calendars = computed(() => store.getters["settings/calendars"])

const handleFilter = () => {
  filters.value = innerFilters.value.reduce((acc, item) => {
    const type = typeof item.value
    if (
      (type === "object" && item.value?.length) ||
      (type === "string" && item.value) ||
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

const handleClearFilter = () => {
  filters.value = {}
  innerFilters.value = defaultFilters()
}

watch(
  [selectedDate, filters],
  () => {
    calendarList({
      filters: filters.value,
      parameters: getFirstAndLastDayOfMonth(selectedDate.value)
    }).then(res => {
      events.value = res

      console.log("events", res)

      const newConfigCalendars = {}
      res.forEach(calendar => {
        if (!calendars.value[calendar.calendarId]) {
          newConfigCalendars[calendar.calendarId] = {
            colorName: calendar.calendarId,
            lightColors:
              COLOR_SCHEME_CALENDAR[Math.floor(Math.random() * COLOR_SCHEME_CALENDAR.length)]
          }
        }
      })

      store.commit("settings/setCalendars", {
        ...calendars.value,
        ...newConfigCalendars
      })
    })
  },
  { immediate: true }
)
</script>
<style lang="scss">
.filter-absolute {
  position: absolute;
  top: 24px;
  right: 250px;

  & button {
    height: 47px !important;
    width: 47px !important;
    border: var(--sx-border);
  }
}
</style>
