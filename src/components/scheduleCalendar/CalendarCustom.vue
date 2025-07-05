<template>
  <div class="calendar-container">
    <div v-if="canChangeViewMode" class="calendar-header">
      <v-select
        v-if="currentView === 'year'"
        label="Тип календаря"
        :model-value="currentView"
        :items="viewOptions"
        item-title="text"
        item-value="value"
        @update:model-value="handleViewChange"
        variant="outlined"
        hide-details
        density="comfortable"
        color="primary"
        class="select-view-year"
      >
      </v-select>
    </div>

    <!-- Schedule-X Calendar -->
    <ScheduleXCalendar v-if="currentView !== 'year'" :calendar-app="calendarApp">
      <template v-if="canChangeViewMode" #headerContentRightPrepend="{ $app }">
        <v-select
          label="Тип календаря"
          :model-value="currentView"
          :items="viewOptions"
          item-title="text"
          item-value="value"
          @update:model-value="handleViewChange"
          variant="outlined"
          hide-details
          density="comfortable"
          color="primary"
          class="mr-15"
          style="min-width: 150px"
        >
        </v-select>
      </template>
    </ScheduleXCalendar>

    <!-- Year View Calendar -->
    <YearlyCalendar
      v-else
      :events="events"
      :selected-date="selectedDate"
      @update-date="date => emit('updateDate', date)"
      @year-changed="handleYearChanged"
    />
  </div>
</template>
<script setup>
import YearlyCalendar from "@/components/scheduleCalendar/YearlyCalendar.vue"
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek
} from "@schedule-x/calendar"
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls"
import { createEventModalPlugin } from "@schedule-x/event-modal"
import { createEventsServicePlugin } from "@schedule-x/events-service"
import { ScheduleXCalendar } from "@schedule-x/vue"
import { endOfMonth, endOfYear, format, startOfMonth, startOfYear } from "date-fns"
import { computed, watch } from "vue"
import { useStore } from "vuex"

const store = useStore()

const eventsServicePlugin = createEventsServicePlugin()
const eventsModalPlugin = createEventModalPlugin()
const calendarControls = createCalendarControlsPlugin()

const emit = defineEmits(["updateDate", "fetchDateRange", "update:currentView"])
const { canChangeViewMode, selectedDate, currentView, events } = defineProps([
  "canChangeViewMode",
  "selectedDate",
  "currentView",
  "events"
])

const calendars = computed(() => store.getters["settings/calendars"])

// Create all view types
const viewMonthGrid = createViewMonthGrid()
const viewMonthAgenda = createViewMonthAgenda()
const viewWeek = createViewWeek()
const viewDay = createViewDay()

const viewOptions = [
  { text: "Год", value: "year" },

  { text: "Месяц", value: "month-grid" },
  { text: "Месяц с повесткой", value: "month-agenda" }
]

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  locale: "ru-RU",
  monthGridOptions: {
    nEventsPerDay: 12
  },
  views: [viewMonthGrid, viewMonthAgenda, viewWeek, viewDay],
  defaultView: viewMonthGrid.name,
  calendars: {
    birthday: {
      colorName: "personal",
      lightColors: {
        main: "#f9d71c",
        container: "#fff5aa",
        onContainer: "#594800"
      }
    },
    vacation: {
      colorName: "work",
      lightColors: {
        main: "#f91c45",
        container: "#ffd2dc",
        onContainer: "#59000d"
      }
    },
    personal: {
      colorName: "leisure",
      lightColors: {
        main: "#1cf9b0",
        container: "#dafff0",
        onContainer: "#004d3d"
      }
    },
    work: {
      colorName: "school",
      lightColors: {
        main: "#1c7df9",
        container: "#d2e7ff",
        onContainer: "#002859"
      }
    }
  },
  plugins: [eventsModalPlugin, eventsServicePlugin, calendarControls],
  callbacks: {
    /**
     * Is called when the selected date is updated
     * */
    onSelectedDateUpdate(date) {
      emit("updateDate", date)
    }
  }
})

const handleViewChange = viewName => {
  if (viewName === "year") {
    emit("update:currentView", viewName)
    // Year view is handled by separate component

    // Get the full year start and end dates based on the current selected date
    const startDate = startOfYear(new Date(selectedDate))
    const endDate = endOfYear(new Date(selectedDate))

    // Format dates as ISO strings (YYYY-MM-DD)
    const formattedStart = format(startDate, "yyyy-MM-dd")
    const formattedEnd = format(endDate, "yyyy-MM-dd")

    // Request the parent component to fetch data for the entire year
    emit("fetchDateRange", {
      start: formattedStart,
      end: formattedEnd,
      viewType: viewName
    })
  } else {
    // Get the current year from the selectedDate
    const currentYear = new Date(selectedDate).getFullYear()
    const currentMonth = new Date(selectedDate).getMonth()

    // Create a date for the same month but in the current year
    const currentYearDate = new Date()
    currentYearDate.setFullYear(currentYear)
    currentYearDate.setMonth(currentMonth)

    // Format it and emit it to update the parent's selectedDate
    const formattedDate = format(currentYearDate, "yyyy-MM-dd")
    emit("updateDate", formattedDate)

    // Get start/end of month for the current year/month
    const startDate = startOfMonth(currentYearDate)
    const endDate = endOfMonth(currentYearDate)

    // Format dates as ISO strings (YYYY-MM-DD)
    const formattedStart = format(startDate, "yyyy-MM-dd")
    const formattedEnd = format(endDate, "yyyy-MM-dd")

    // Schedule-X views - keep existing logic
    emit("update:currentView", viewName)

    // Request the parent component to fetch data for the selected month
    emit("fetchDateRange", {
      start: formattedStart,
      end: formattedEnd,
      viewType: viewName
    })

    calendarControls.setView(viewName)
  }
}
// Update the changeYear function in case you're handling year changes directly
const handleYearChanged = ({ year, startDate, endDate }) => {
  // Format dates as ISO strings (YYYY-MM-DD)
  const formattedStart = format(startDate, "yyyy-MM-dd")
  const formattedEnd = format(endDate, "yyyy-MM-dd")

  // Request the parent component to fetch data for the new year
  emit("fetchDateRange", {
    start: formattedStart,
    end: formattedEnd,
    viewType: "year"
  })
}

watch(
  () => events,

  newValue => {
    eventsServicePlugin.set(newValue)
  }
)

watch(
  () => calendars.value,
  newValue => {
    calendarControls.setCalendars(newValue)
  }
)
watch(
  () => selectedDate,
  newDate => {
    if (newDate && calendarApp) {
      try {
        // When selectedDate changes from year view, update Schedule-X calendar date
        calendarControls.setDate(newDate)
      } catch (err) {
        console.error("Error updating calendar date:", err)
      }
    }
  }
)
</script>

<style scoped lang="scss">
.select-view-year {
  min-width: 150px;
  max-width: fit-content;
  margin-left: auto;
  margin-right: 80px;
  margin-top: 8px;
}
</style>
