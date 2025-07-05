<template>
  <v-card class="px-4 py-4">
    <calendar-custom
      :selectedDate="selectedDate"
      @update-date="date => (selectedDate = date)"
      @fetchDateRange="fetchEventsForRange"
      :events="events"
      :currentView="currentView"
      @updateCurrentView="currentView = $event"
      :canChangeViewMode
    ></calendar-custom>
    <div :class="['filter-absolute', { 'filter-absolute--year': currentView === 'year' }]">
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
import { CalendarCustom } from "@/components"
import Filters from "@/components/filter/Filters.vue"
import { calendarList } from "@/service/employees/calendarService.js"
import { employeeDepartmentForFilter } from "@/service/employees/dictionaryService.js"
import { COLOR_SCHEME_CALENDAR, FILTER_TYPE_EQ_MULTI } from "@/utils/dictionary.js"
import { getDateNow, getFirstAndLastDayOfMonth } from "@/utils/format.js"
import { endOfYear, format, startOfYear } from "date-fns"
import { computed, ref, watch } from "vue"
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
const currentView = ref("month-grid") // Track the current view type

const canChangeViewMode = ref(true)

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

// Add this new function to handle fetching events for a date range
const fetchEventsForRange = async ({ start = null, end = null, viewType = currentView.value }) => {
  // If start/end not provided, calculate them based on the current view and selected date
  if (!start || !end) {
    if (viewType === "year") {
      const startDate = startOfYear(new Date(selectedDate.value))
      const endDate = endOfYear(new Date(selectedDate.value))
      start = format(startDate, "yyyy-MM-dd")
      end = format(endDate, "yyyy-MM-dd")
    } else {
      const { startDate, endDate } = getFirstAndLastDayOfMonth(selectedDate.value)
      start = startDate
      end = endDate
    }
  }

  // Clear events immediately when switching view types to prevent showing incorrect data
  if (currentView.value !== viewType) {
    events.value = [] // Clear events when view type changes
    currentView.value = viewType // Store the current view type
  }

  try {
    // Make API call with the specified date range
    const res = await calendarList({
      filters: filters.value,
      parameters: {
        startDate: start,
        endDate: end
      }
    })

    // Update events with the new data
    events.value = res

    // Update calendars config as before
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
  } catch (error) {
    console.error("Error fetching events for range:", error)
  }
}

// Replace the existing watch with this simplified version
watch(
  [selectedDate, filters, currentView],
  () => {
    console.log("watch selectedDate, selectedDate", selectedDate.value)
    // No need to check the view type - the fetchEventsForRange function handles that
    fetchEventsForRange({})
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
.filter-absolute--year {
  right: 35px;
}
</style>
