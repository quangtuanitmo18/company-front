<template>
  <div class="yearly-calendar-container">
    <div class="year-navigation">
      <v-btn icon="mdi-chevron-left" @click="changeYear(-1)" variant="text"></v-btn>
      <h2 class="year-title">{{ currentYear }}</h2>
      <v-btn icon="mdi-chevron-right" @click="changeYear(1)" variant="text"></v-btn>
    </div>

    <Calendar
      v-if="!isYearChanging && !props.isLoadingEvents"
      locale="ru"
      :key="currentYear"
      :attributes="calendarEvents"
      :min-date="`${currentYear}-01-01`"
      :max-date="`${currentYear}-12-31`"
      :rows="3"
      :columns="4"
      is-expanded
      :theme-styles="themeStyles"
      :masks="masks"
      trim-weeks
      :disable-page-swipe="true"
    >
      <!-- Add this custom day-popover slot -->
      <template #day-popover="{ dayTitle, attributes: calendarEvents, hide }">
        <div v-for="attribute in calendarEvents" :key="attribute.key" class="event-item">
          <div class="d-flex ga-2 align-center">
            <div
              class="event-color-indicator"
              :style="{ backgroundColor: getEventColor(attribute.customData) }"
            ></div>
            <div class="font-weight-regular text-lg mt-1">{{ attribute.customData.title }}</div>
          </div>

          <div class="d-flex ga-2 align-center mt-2">
            <v-icon class="date-icon">mdi-clock-outline</v-icon>
            <span
              class="font-weight-regular text-sm mt-1"
              v-if="isRangeEvent(attribute.customData)"
            >
              {{ formatDateRange(attribute.customData) }}
            </span>
            <span v-else class="font-weight-regular text-sm mt-1">
              {{ formatSingleDate(attribute.customData.start) }}
            </span>
          </div>
        </div>
        <div v-if="calendarEvents.length == 0 && !props.isLoadingEvents" class="no-events">
          Нет событий
        </div>
      </template>
    </Calendar>
    <template v-if="isYearChanging || props.isLoadingEvents">
      <div style="clear: both"></div>
      <div class="text-center pb-10">
        <v-progress-circular indeterminate class="color-primary" />
      </div>
    </template>
  </div>
</template>

<script setup>
import store from "@/store"
import { mapHexToNamedColor } from "@/utils/format"
import { endOfYear, format, startOfYear } from "date-fns"
import ru from "date-fns/locale/ru"
import { Calendar } from "v-calendar"
import "v-calendar/style.css"
import { computed, ref, watch } from "vue"

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  selectedDate: {
    type: String,
    default: () => new Date().toISOString().split("T")[0]
  },
  isLoadingEvents: {
    type: Boolean
  }
})

const emit = defineEmits(["year-changed", "update-date"])

const isYearChanging = ref(false)
const eventsYear = ref(null)

// Date handling
const currentDate = ref(props.selectedDate ? new Date(props.selectedDate) : new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const yearStart = computed(() => startOfYear(currentDate.value))
const yearEnd = computed(() => endOfYear(currentDate.value))
const calendars = computed(() => store.getters["settings/calendars"])

// Format masks for the calendar
const masks = {
  title: "MMMM",
  weekdays: "WW"
}

// Helper to check if an event is a range event
const isRangeEvent = event => {
  return (
    event.end && event.end !== event.start && event.start.split("T")[0] !== event.end.split("T")[0]
  )
}
const formatSingleDate = dateString => {
  if (!dateString) return ""
  const date = new Date(dateString.split("T")[0])
  return format(date, "d MMMM yyyy г.", { locale: ru })
}
// Helper to format date range for display
const formatDateRange = event => {
  if (!event.start || !event.end) return ""

  const startDate = event.start.split("T")[0]
  const endDate = event.end.split("T")[0]

  const formattedStart = format(new Date(startDate), "d MMMM yyyy г.", { locale: ru })
  const formattedEnd = format(new Date(endDate), "d MMMM yyyy г.", { locale: ru })

  return `${formattedStart} - ${formattedEnd}`
}

// Helper to get the actual color for an event
const getEventColor = event => {
  if (!event || !event.calendarId) return "#d2e7ff"

  try {
    return calendars.value[event.calendarId].lightColors.main || "#d2e7ff"
  } catch (e) {
    return "#d2e7ff"
  }
}
const themeStyles = {
  wrapper: {
    backgroundColor: "white",
    border: "1px solid rgba(0, 0, 0, 0.12)",
    maxWidth: "100%",
    height: "auto"
  },
  dayCell: {
    height: "42px",
    width: "42px"
  },
  dots: {
    sm: {
      width: "8px",
      height: "8px",
      borderRadius: "100%",
      margin: "3px 0 0 0"
    }
  }
}

const calendarEvents = computed(() => {
  if (!props.events || props.events.length === 0 || isYearChanging.value) {
    return []
  }

  // Check if events match the current year
  if (eventsYear.value !== null && eventsYear.value !== currentYear.value) {
    return [] // Don't display events from wrong year
  }

  // Create array to hold attributes
  const attributes = []

  // Process each event directly into attributes with proper keys
  props.events.forEach((event, index) => {
    if (!event.start) return

    try {
      // Get the color for this event
      const eventColor = calendars.value[event.calendarId]?.lightColors.main
      const namedColor = mapHexToNamedColor(eventColor)

      // Format dates consistently
      const startDate = event.start.split("T")[0]
      const endDate = event.end ? event.end.split("T")[0] : startDate
      const isRange = event.end && event.end !== event.start && startDate !== endDate

      const eventKey = `event-${event.id}-${index}`

      if (isRange) {
        attributes.push({
          key: `range-${eventKey}`,
          dates: {
            start: new Date(startDate),
            end: new Date(endDate)
          },
          highlight: {
            color: namedColor,
            fillMode: "light"
          },
          popover: {
            visibility: "click",
            hideDelay: 300
          },
          customData: event
        })
      } else {
        attributes.push({
          key: `dot-${eventKey}`,
          dates: new Date(startDate),
          dot: {
            color: namedColor,
            fillMode: "light"
          },
          popover: {
            visibility: "click",
            hideDelay: 300
          },
          customData: event
        })
      }
    } catch (error) {
      console.error(`Error processing event ${event.title}:`, error)
    }
  })

  return attributes
})

const changeYear = increment => {
  // Set loading state to prevent showing wrong events
  isYearChanging.value = true

  const newDate = new Date(currentDate.value)
  newDate.setFullYear(currentDate.value.getFullYear() + increment)
  currentDate.value = newDate

  // Format the date as YYYY-MM-DD string before emitting
  const formattedDate = format(newDate, "yyyy-MM-dd")

  // Emit an event to notify parent that the year has changed
  emit("year-changed", {
    year: newDate.getFullYear(),
    startDate: format(yearStart.value, "yyyy-MM-dd"),
    endDate: format(yearEnd.value, "yyyy-MM-dd")
  })
  // Emit the formatted date string to update parent's selectedDate
  emit("update-date", formattedDate)
}
// Watch for events changes and update eventsYear
watch(
  () => props.events,
  newEvents => {
    if (newEvents) {
      // When we receive events, determine what year they belong to
      const firstEventWithDate = newEvents.find(e => e.start)
      if (firstEventWithDate) {
        const eventYear = new Date(firstEventWithDate.start.split("T")[0]).getFullYear()
        eventsYear.value = eventYear
      }
      // End the loading state
      isYearChanging.value = false
    }
  },
  { deep: true }
)

// Watch for year changes
watch(currentYear, newYear => {
  // If the events year doesn't match the new current year, we're in transition
  if (eventsYear.value !== null && eventsYear.value !== newYear) {
    isYearChanging.value = true
  }
})
</script>

<style scoped>
/* Add these styles to ensure hover works properly */
:deep(.vc-day) {
  position: relative;
  z-index: 1;
}

:deep(.vc-day-content) {
  position: relative;
  z-index: 2;
  cursor: pointer; /* Add cursor to indicate interactivity */
}

/* Updated popover styling */
:deep(.vc-popover-content-wrapper) {
  z-index: 100 !important;
  --popover-horizontal-content-offset: 8px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
}

:deep(.vc-popover-content) {
  padding: 0;
  border-radius: 8px;
  background: white;
  border: none;
  overflow: hidden;
  min-width: 280px;
  max-width: 320px;
}

:deep(.event-item) {
  display: flex;
  padding: 12px 16px;
  align-items: start;
  flex-direction: column;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

:deep(.event-item:last-child) {
  border-bottom: none;
}

:deep(.event-color-indicator) {
  width: 12px;
  height: 12px;
  margin-right: 12px;
  border-radius: 2px;
  border-radius: 2px;
}

:deep(.event-details) {
  flex: 1;
}

:deep(.event-date) {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.date-icon) {
  opacity: 0.7;
  font-size: 14px;
}

:deep(.no-events) {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  padding: 16px;
}

/* Hide the default popover arrow */
:deep(.vc-popover-caret) {
  display: none !important;
}

/* Calendar container and navigation */
.yearly-calendar-container {
  height: 100%;
  padding-inline: 16px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.year-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  gap: 16px;
}

.year-title {
  font-size: 24px;
  font-weight: 500;
  margin: 0;
}

/* Legend styling */
.event-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-text {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.87);
}

/* Calendar layout */
:deep(.vc-container) {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background-color: white;
}

:deep(.vc-pane-container) {
  width: 100%;
}

/* Month headers */
:deep(.vc-title) {
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
}

:deep(.vc-weekday) {
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
}

:deep(.vc-day-content) {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
}

:deep(.vc-day.is-not-in-month .vc-day-content) {
  color: rgba(0, 0, 0, 0.38);
}

:deep(.vc-day.is-today) {
  background-color: rgba(25, 118, 210, 0.08);
}

:deep(.vc-day.is-today .vc-day-content) {
  color: #1976d2;
  font-weight: 700;
}

/* Simple dot styling - no circles */
:deep(.vc-dot) {
  width: 8px;
  height: 8px;
  margin: 2px auto 0;
  border: none;
  opacity: 1;
}

/* Make start and end dates of ranges darker */
:deep(.vc-highlight-base-start),
:deep(.vc-highlight-base-end) {
  opacity: 0.3 !important;
}

/* Make the middle of ranges lighter */
:deep(.vc-highlight-base-middle) {
  opacity: 0.3 !important;
}

:deep(.vc-highlight) {
  z-index: 1;
}

/* Disable clicking on month titles */
:deep(.vc-header .vc-title) {
  pointer-events: none;
  cursor: default;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .yearly-calendar-container {
    padding: 8px;
  }

  :deep(.vc-title) {
    font-size: 16px;
  }

  :deep(.vc-day-content) {
    font-size: 12px;
  }
}
</style>
