<template>
  <div class="calendar-container">
    <div v-if="canChangeViewMode" class="calendar-header">
      <v-select
        v-if="currentView === 'year' || currentView === 'graphic'"
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
    <ScheduleXCalendar
      v-if="currentView !== 'year' && currentView !== 'graphic'"
      :events="events"
      :calendar-app="calendarApp"
    >
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
      v-else-if="currentView === 'year'"
      :events="events"
      :selected-date="selectedDate"
      :isLoadingEvents="isLoadingEvents"
      @update-date="date => emit('updateDate', date)"
      @year-changed="handleYearChanged"
    />

    <!-- Graphic View Calendar -->
    <GraphicTableCalendar
      v-else-if="currentView === 'graphic'"
      :events="events"
      :selectedDate="selectedDate"
      :isLoadingEvents="isLoadingEvents"
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
import GraphicTableCalendar from "./GraphicTableCalendar.vue"

const store = useStore()

const eventsServicePlugin = createEventsServicePlugin()
const eventsModalPlugin = createEventModalPlugin()
const calendarControls = createCalendarControlsPlugin()

const emit = defineEmits(["updateDate", "fetchDateRange", "update:currentView"])
const { canChangeViewMode, selectedDate, currentView, events, isLoadingEvents } = defineProps([
  "canChangeViewMode",
  "selectedDate",
  "currentView",
  "events",
  "isLoadingEvents"
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
  { text: "Месяц с повесткой", value: "month-agenda" },
  { text: "График", value: "graphic" }
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
  // Chỉ emit sự kiện update:currentView, không gọi trực tiếp calendarControls.setView
  emit("update:currentView", viewName)

  // Tính toán range để fetch data
  if (viewName === "year" || viewName === "graphic") {
    // Logic hiện tại cho year và graphic
    const startDate = startOfYear(new Date(selectedDate))
    const endDate = endOfYear(new Date(selectedDate))
    const formattedStart = format(startDate, "yyyy-MM-dd")
    const formattedEnd = format(endDate, "yyyy-MM-dd")

    emit("fetchDateRange", {
      start: formattedStart,
      end: formattedEnd,
      viewType: viewName
    })
  } else {
    // Logic hiện tại cho các view khác
    const currentYear = new Date(selectedDate).getFullYear()
    const currentMonth = new Date(selectedDate).getMonth()
    const currentYearDate = new Date()
    currentYearDate.setFullYear(currentYear)
    currentYearDate.setMonth(currentMonth)

    // Chỉ emit updateDate và fetchDateRange, không gọi calendarControls.setView
    const formattedDate = format(currentYearDate, "yyyy-MM-dd")
    emit("updateDate", formattedDate)

    const startDate = startOfMonth(currentYearDate)
    const endDate = endOfMonth(currentYearDate)
    const formattedStart = format(startDate, "yyyy-MM-dd")
    const formattedEnd = format(endDate, "yyyy-MM-dd")

    emit("fetchDateRange", {
      start: formattedStart,
      end: formattedEnd,
      viewType: viewName
    })
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
    viewType: currentView
  })
}

// schedule-x
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

// Tách thành hai watcher riêng biệt để dễ theo dõi
watch(
  () => currentView,
  newView => {
    if (newView && calendarApp && newView !== "year" && newView !== "graphic") {
      try {
        calendarControls.setDate(selectedDate)

        calendarControls.setView(newView)
      } catch (err) {
        console.error("Error setting view:", err)
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
