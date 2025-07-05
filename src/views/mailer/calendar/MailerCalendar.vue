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
import { CalendarCustom, Filters } from "@/components"
import { tasksCalendar } from "@/service/mailer/packageScheduleService"
import { typePackageDictionaryFilterMailer } from "@/service/mailer/packageService.js"
import { sroOrgListForFilterMailer } from "@/service/ossa/clients/sroOrganizationService.js"
import { COLOR_SCHEME_CALENDAR, FILTER_TYPE_EQ_CHECK } from "@/utils/dictionary.js"
import { getDateNow, getFirstAndLastDayOfMonth } from "@/utils/format.js"
import { computed, ref, watch } from "vue"
import { useStore } from "vuex"

const store = useStore()

const defaultFilters = () => {
  return [
    {
      filterBy: "packageType",
      value: null,
      label: "Тип рассылки",
      type: FILTER_TYPE_EQ_CHECK,
      selectValues: "",
      api: typePackageDictionaryFilterMailer
    },
    {
      filterBy: "sroOrganization",
      value: null,
      label: "СРО",
      type: FILTER_TYPE_EQ_CHECK,
      selectValues: "",
      api: sroOrgListForFilterMailer
    }
  ]
}

const innerFilters = ref(defaultFilters())
const filters = ref({})
const selectedDate = ref(getDateNow())
const events = ref([])

const countFilters = computed(() => Object.keys(filters.value).length)
const calendars = computed(() => store.getters["settings/calendars"])

const dateRange = computed(() => getFirstAndLastDayOfMonth(selectedDate.value))

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
    tasksCalendar({
      filters: filters.value,
      parameters: { date_start: dateRange.value.startDate, date_end: dateRange.value.endDate }
    }).then(res => {
      events.value = res.calendar

      const newConfigCalendars = {}
      res.calendar.forEach(calendar => {
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
