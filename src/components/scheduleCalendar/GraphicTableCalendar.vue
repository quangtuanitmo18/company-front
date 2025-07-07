<template>
  <div class="schedule-container">
    <div class="year-navigation">
      <v-btn icon="mdi-chevron-left" @click="changeYear(-1)" variant="text"></v-btn>
      <h2 class="year-title">{{ currentYear }}</h2>
      <v-btn icon="mdi-chevron-right" @click="changeYear(1)" variant="text"></v-btn>
    </div>
    <v-table v-if="!isYearChanging" density="compact" class="schedule-table">
      <thead>
        <tr>
          <th class="text-left schedule-column">ФИО</th>
          <th v-for="(month, index) in months" :key="index" :class="['text-center']">
            {{ month }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="GraphicTableData.length > 0 && !isLoadingEvents">
          <tr v-for="data in GraphicTableData" :key="data.id">
            <td class="text-left schedule-column font-weight-regular">{{ data.name }}</td>
            <td
              v-for="(monthData, index) in data.months"
              :key="index"
              class="month-cell"
              :class="{ 'has-events': monthData.hasEvents }"
            >
              <v-tooltip location="top" content-class="birthday-tooltip">
                <template v-slot:activator="{ props }">
                  <div v-if="monthData.birthday" class="birthday-marker" v-bind="props">
                    {{ monthData.birthday }}
                  </div>
                </template>
                <div class="custom-tooltip-content">
                  <div class="tooltip-title">День рождения {{ data.name }}</div>
                  <div class="tooltip-date">
                    <v-icon class="date-icon">mdi-clock-outline</v-icon>

                    {{ formatDate(monthData.birthdayDate) }}
                  </div>
                </div>
              </v-tooltip>

              <v-tooltip
                v-for="(vacation, vIndex) in monthData.vacations"
                :key="`vac-${vIndex}`"
                location="top"
                content-class="vacation-tooltip"
              >
                <template v-slot:activator="{ props }">
                  <div
                    class="vacation-marker"
                    :style="getVacationStyle(vacation, index)"
                    v-bind="props"
                  >
                    <span class="vacation-text"> </span>
                  </div>
                </template>
                <div class="custom-tooltip-content">
                  <div class="tooltip-title">Отпуск {{ data.name }}</div>
                  <div class="tooltip-date">
                    <v-icon class="date-icon">mdi-clock-outline</v-icon>
                    {{ formatDateRangeForTooltip(vacation.start, vacation.end) }}
                  </div>
                </div>
              </v-tooltip>
            </td>
          </tr>
        </template>
        <template v-else-if="!isLoadingEvents && GraphicTableData.length === 0">
          <tr>
            <td class="text-center py-10" :colspan="13">
              Записи, удовлетворяющие критериям поиска отсутствуют
            </td>
          </tr>
        </template>
      </tbody>
    </v-table>
    <template v-if="isYearChanging || isLoadingEvents">
      <div class="text-center py-10">
        <v-progress-circular indeterminate color="primary" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { format, parseISO } from "date-fns"
import { ru } from "date-fns/locale"
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
const currentDate = ref(props.selectedDate ? new Date(props.selectedDate) : new Date())

// Array of month names in Russian
const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь"
]

// Get current year from selectedDate
const currentYear = computed(() => {
  return new Date(props.selectedDate).getFullYear()
})

const changeYear = increment => {
  isYearChanging.value = true

  //calculate new date by incrementing the year
  const newDate = new Date(currentDate.value)
  newDate.setFullYear(currentDate.value.getFullYear() + increment)
  currentDate.value = newDate

  // Format the new date to YYYY-MM-DD
  const formattedDate = format(newDate, "yyyy-MM-dd")

  // Emit the new year and date range
  emit("year-changed", {
    year: newDate.getFullYear(),
    startDate: `${newDate.getFullYear()}-01-01`,
    endDate: `${newDate.getFullYear()}-12-31`
  })

  // Emit the formatted date to update parent's selectedDate
  emit("update-date", formattedDate)
}

// Format date for display in tooltip
const formatDate = dateString => {
  if (!dateString) return ""

  const date = parseISO(dateString)
  return format(date, "d MMMM yyyy", { locale: ru })
}

// Format date range for display in tooltip

const formatDateRangeForTooltip = (start, end) => {
  if (!start || !end) return ""

  const startDate = parseISO(start)
  const endDate = parseISO(end)

  const formattedStart = format(startDate, "d MMMM yyyy г.", { locale: ru })
  const formattedEnd = format(endDate, "d MMMM yyyy г.", { locale: ru })

  return `${formattedStart} - ${formattedEnd}`
}

// Generate employee data structure for the table
const GraphicTableData = computed(() => {
  // Group events by employee
  const GraphicTableDataMap = new Map()
  const nameRegex = /(?:День рождения|Отпуск)\s+(.+)$/

  // Process each event
  props.events.forEach(event => {
    const match = event.title.match(nameRegex)
    if (!match) return

    const name = match[1]
    const id = event.calendarId
    const eventType = event.title.includes("День рождения") ? "birthday" : "vacation"

    // Create employee entry if not exists
    if (!GraphicTableDataMap.has(id)) {
      GraphicTableDataMap.set(id, {
        id: id,
        name: name,
        months: Array(12)
          .fill()
          .map(() => ({
            vacations: [],
            birthday: null,
            birthdayDate: null,
            hasEvents: false
          }))
      })
    }

    const rowData = GraphicTableDataMap.get(id)

    // Process event based on type
    if (eventType === "birthday") {
      const date = new Date(event.start)
      const month = date.getMonth()
      const day = date.getDate()

      rowData.months[month].birthday = day
      rowData.months[month].birthdayDate = event.start
      rowData.months[month].hasEvents = true
    } else {
      // Process vacation - need to handle multi-month spans
      const startDate = new Date(event.start)
      const endDate = new Date(event.end)

      const startMonth = startDate.getMonth()
      const startYear = startDate.getFullYear()

      const endMonth = endDate.getMonth()
      const endYear = endDate.getFullYear()

      // Only process dates in the current year
      if (startYear === currentYear.value || endYear === currentYear.value) {
        // Calculate which months this vacation spans
        const firstMonth = startYear < currentYear.value ? 0 : startMonth
        const lastMonth = endYear > currentYear.value ? 11 : endMonth

        for (let month = firstMonth; month <= lastMonth; month++) {
          rowData.months[month].vacations.push({
            start: event.start,
            end: event.end,
            isStart: month == startMonth && startYear == currentYear.value,
            isEnd: month == endMonth && endYear == currentYear.value,
            isMiddle: !(
              (month == startMonth && startYear == currentYear.value) ||
              (month == endMonth && endYear == currentYear.value)
            ),
            daysInMonth: getDaysInMonth(month, currentYear.value),
            startDay:
              month == startMonth && startYear == currentYear.value ? startDate.getDate() : 1,
            endDay:
              month == endMonth && endYear == currentYear.value
                ? endDate.getDate()
                : getDaysInMonth(month, currentYear.value)
          })
          rowData.months[month].hasEvents = true
        }
      }
    }
  })

  return Array.from(GraphicTableDataMap.values())
})

// Helper function to get days in a month
const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate()
}

// Calculate vacation display style based on span within month
const getVacationStyle = (vacation, monthIndex) => {
  const daysInMonth = vacation.daysInMonth
  const startPercent = ((vacation.startDay - 1) / daysInMonth) * 100
  const width = ((vacation.endDay - vacation.startDay + 1) / daysInMonth) * 100

  return {
    position: "absolute",
    left: `${startPercent}%`,
    width: `${width}%`,
    backgroundColor: "#d2e7ff",
    borderRadius:
      vacation.isStart && vacation.isEnd
        ? "4px"
        : vacation.isStart
        ? "4px 0 0 4px"
        : vacation.isEnd
        ? "0 4px 4px 0"
        : "0",
    borderLeft: vacation.isStart ? "1px solid #1c7df9" : "none",
    borderRight: vacation.isEnd ? "1px solid #1c7df9" : "none",
    borderTop: "1px solid #1a73e8",
    borderBottom: "1px solid #1a73e8",
    height: "20px",
    zIndex: 1,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: "#1a73e8"
  }
}

watch(
  () => props.events,
  newEvents => {
    if (newEvents) {
      const firstEventWithDate = newEvents.find(e => e.start)
      if (firstEventWithDate) {
        const eventYear = new Date(firstEventWithDate.start.split("T")[0]).getFullYear()
        eventsYear.value = eventYear
      }
      isYearChanging.value = false
    }
  },
  { deep: true }
)

watch(currentYear, newYear => {
  if (eventsYear.value !== null && eventsYear.value !== newYear) {
    isYearChanging.value = true
  }
})
</script>

<style scoped>
.schedule-container {
  width: 100%;
  overflow-x: auto;
}

.schedule-table {
  min-width: 100%;
  table-layout: fixed;
}

.schedule-column {
  width: 180px;
  position: sticky;
  left: 0;
  background: #f5f5f5;
  z-index: 2;
}

.month-cell {
  position: relative;
  height: 50px;
  border: 1px solid #e0e0e0;
  padding: 4px;
}

.has-events {
  background-color: rgba(0, 0, 0, 0.01);
}
.date-icon {
  opacity: 0.7;
  font-size: 14px;
}
.birthday-marker {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ffd2dc;
  color: #f91c45;
  border: 1px solid #f91c45;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 12px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  cursor: pointer;
}

.vacation-marker {
  position: relative;
  z-index: 1;
  font-size: 11px;
  padding-left: 4px;
  cursor: pointer;
  margin-bottom: 1px;
}

.vacation-text {
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 4px;
  line-height: 18px;
}

.highlighted-month {
  background-color: #fff8e1;
}
/* Thêm style cho tooltip */
:deep(.v-tooltip) {
  --v-theme-surface: white !important;
  --v-theme-on-surface: rgba(0, 0, 0, 0.87) !important;
}

:deep(.vacation-tooltip),
:deep(.birthday-tooltip) {
  background-color: white !important;
  color: rgba(0, 0, 0, 0.87) !important;
  border-radius: 4px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  max-width: none !important;
}

.custom-tooltip-content {
  padding: 12px 16px;
  min-width: 200px;
}

.tooltip-title {
  font-size: 18px;
  margin-bottom: 8px;
}

.tooltip-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.year-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.year-title {
  font-size: 24px;
  font-weight: 500;
  margin: 0;
}
</style>
