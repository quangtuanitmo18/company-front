<template>
  <ScheduleXCalendar :calendar-app="calendarApp"> </ScheduleXCalendar>
</template>

<script setup>
import { ScheduleXCalendar } from "@schedule-x/vue";
import { createCalendar, createViewMonthAgenda, createViewMonthGrid, createViewDay, createViewWeek } from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import {computed, onMounted, watch} from "vue";
import {useStore} from "vuex";

const store = useStore()

const eventsServicePlugin = createEventsServicePlugin();
const eventsModalPlugin = createEventModalPlugin();
const calendarControls = createCalendarControlsPlugin()

const emit = defineEmits(["updateDate"]);
const props = defineProps(["events"]);

const calendars = computed(() => store.getters["settings/calendars"])

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  locale: "ru-RU",
  monthGridOptions: {
    nEventsPerDay: 12,
  },
  views: [createViewMonthGrid(), createViewMonthAgenda()],
  calendars: {
    birthday: {
      colorName: "personal",
      lightColors: {
        main: "#f9d71c",
        container: "#fff5aa",
        onContainer: "#594800",
      },
    },
    vacation: {
      colorName: "work",
      lightColors: {
        main: "#f91c45",
        container: "#ffd2dc",
        onContainer: "#59000d",
      },
    },
    personal: {
      colorName: "leisure",
      lightColors: {
        main: "#1cf9b0",
        container: "#dafff0",
        onContainer: "#004d3d",
      },
    },
    work: {
      colorName: "school",
      lightColors: {
        main: "#1c7df9",
        container: "#d2e7ff",
        onContainer: "#002859",
      },
    },
  },
  plugins: [eventsModalPlugin, eventsServicePlugin, calendarControls],
  callbacks: {
    /**
     * Is called when the selected date is updated
     * */
    onSelectedDateUpdate(date) {
      emit("updateDate", date);
    },
  },
});

watch(() => props.events, (newValue) => {
    eventsServicePlugin.set(newValue);
  }
);

watch(() => calendars.value, (newValue) => {
  calendarControls.setCalendars(newValue)
})
</script>
