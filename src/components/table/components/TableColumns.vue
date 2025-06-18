<template>
  <tr @click="handleDetailsTo(item)" :class="{'readonly': !detailsTo && !detailsTo, 'warning': item.warning, 'error': item.error, 'success': item.success, 'font-weight-medium': item.bold, 'playing': item.isPlaying}" v-for="item in items" :key="item.id">
    <td class="text-center py-1" v-for="(column, index) in columns" :style="{width: column.width}" :key="index">
<!--  For buttons with action in table -->
      <template v-if="column?.filterOptions?.filterType === FILTER_TYPE_ACTION">
        <table-action-buttons v-for="action in column.buttonInfo" :key="item.id" :item="item" :action="action" />
      </template>
<!--      For buttons that can be disable or enable based on a given condition -->
      <div class="d-flex ga-1" v-else-if="column?.type === 'custom-buttons'">
        <template v-for="btn in column.buttons">
          <template v-if="btn.conditions.every(cond => cond.equal ? item[cond.title] === cond.value : item[cond.title] !== cond.value)">
            <btn-dropdown size="small" v-if="btn.type === 'dropdown'" :data="item" :items="btn.items">
              {{ btn.title }}
            </btn-dropdown>
            <btn-primary size="small" v-else-if="btn.type === 'primary'" @click.stop="() => btn.handleFunc(item)">
              {{ btn.title }}
            </btn-primary>
            <div v-else-if="btn.type === 'icon'" @click.stop="() => btn.handleFunc(item)" class="table-column-action">
              <button :title="btn.title" >
                <v-icon :icon="btn.icon" class="color-primary" />
              </button>
            </div>
          </template>
        </template>
      </div>
<!--      For interactive checkboxes in tables -->
      <template v-else-if="column?.type === 'checkbox'">
        <v-checkbox @update:modelValue="(newValue) => emit('update-checkbox', {isChecked: newValue, id: item.id})" hide-details="true" v-model="item.isChecked"></v-checkbox>
      </template>
<!--      For duration (special type). Example: "120/80" -->
      <template v-else-if="column?.type === 'duration'">
        <v-tooltip v-if="item.callType === 'outgoing'" close-on-content-click max-width="600" offset="4" location="top">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="text-ellipsis" :class="{[column.align]: column.align }"><span style="color: var(--color-secondary); font-size: 12px; font-weight: 700">({{item[column.value] - item[column.valueSecond]}}) </span>{{item[column.valueSecond]}}</div>
          </template>
          <div>
            <p>Длительность дозвона: {{item[column.value] - item[column.valueSecond]}}</p>
            <p>Длительность разговора: {{item[column.valueSecond]}}</p>
          </div>
        </v-tooltip>
        <v-tooltip v-if="item.callType === 'incoming'" close-on-content-click max-width="600" offset="4" location="top">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="text-ellipsis" :class="{[column.align]: column.align }">{{item[column.value]}}</div>
          </template>
          <div>
            <p>Длительность звонка: {{item[column.valueSecond]}}</p>
          </div>
        </v-tooltip>
      </template>
<!--      For employee (special type). Example: "Иван И. И. (2882)" -->
      <template v-else-if="column?.type === 'employee'">
        <div>{{handleFormatColumn(item, column, search)}} ({{item[column.valueSecond]}})</div>
      </template>
<!--      For dropdown menu, that can edit state of table -->
      <template v-else-if="column?.filterOptions?.filterType === FILTER_TYPE_EDITABLE">
        <editable-list
            :key="editableListId"
            :options="column?.options"
            :icon-color="iconColor(item, column)"
            :title="handleFormatColumn(item, column, search)"
            :items="column?.filterOptions?.filterValues"
            :data="item"
            @handle-edit="(args) => { emit('handleEdit', args); editableListId++ }"
        >
        </editable-list>
      </template>
      <!-- For tooltip label -->
      <template v-else-if="column?.tooltipValue">
        <v-tooltip close-on-content-click max-width="600" offset="4" location="top" :text="handleTextTooltip(item, column)">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="text-ellipsis" :class="{[column.align]: column.align }" v-html="handleFormatColumn(item, column, search)"></div>
          </template>
        </v-tooltip>
<!--        <div class="position-relative tooltip-custom-wrap">-->
<!--          <div class="tooltip-custom" v-html="handleTextTooltip(item, column)"></div>-->
<!--          <div class="text-ellipsis" :class="{[column.align]: column.align }" v-html="handleFormatColumn(item, column, search)"></div>-->
<!--        </div>-->
      </template>
      <!-- For Local Time -->
      <template v-else-if="column?.type === 'local-time'">
        <div>{{getLocalTime(item[column.value])}}</div>
      </template>
      <!-- For Themes -->
      <template v-else-if="column?.type === 'themes'">
        <div class="text-left" v-for="theme in item.remarkThemes">
          <v-icon size="x-small" class="color-primary" icon="mdi-check-bold"></v-icon>
          {{theme.title}}
        </div>
      </template>
      <!-- For time with range -->
      <template v-else-if="column?.type === 'time-range'">
        <div>
          <p><span class="ml-2"></span>с {{shortDateFormat(item[column.value])}}</p>
          <p>по {{shortDateFormat(item[column.valueSecond])}}</p>
        </div>
      </template>
      <!-- For the special row with a tooltip about the organization and the inn -->
      <template v-else-if="column?.type === 'members-do'">
        <member-do-field-table :data="item[column.value]"></member-do-field-table>
      </template>
      <!--   For the list (array)   -->
      <template v-else-if="column?.type === 'format-list'">
        <p v-for="i in item[column.value]">{{ i }}</p>
      </template>
      <!-- For image -->
      <template v-else-if="column?.type === 'image'">
        <div class="my-1"><avatar :avatar="item[column.value]"></avatar></div>
      </template>
      <!-- For icons that depend on many fields (special type) -->
      <template v-else-if="column?.type === 'icons-type-call'">
        <icons-type-call :disposition="item[column.value]" :callType="item[column.valueSecond]"></icons-type-call>
      </template>
      <!-- Everything else -->
      <template v-else>
        <div :class="{[column.align]: column.align }" v-html="handleFormatColumn(item, column, search)"></div>
      </template>
    </td>
  </tr>
</template>

<script setup>
import {useRouter} from "vue-router"
import TableActionButtons from "./TableActionButtons.vue";
import {isObject} from "@/utils/object.js";
import {
  FILTER_TYPE_ACTION,
  FILTER_TYPE_DATE,
  FILTER_TYPE_DATE_TIME,
  FILTER_TYPE_EDITABLE,
  FILTER_TYPE_EQ_CHECK, FILTER_TYPE_MONEY,
} from "@/utils/dictionary.js";
import {highlightedText, moneyFormat, shortDateFormat} from "@/utils/format.js";
import {BtnDropdown, BtnPrimary} from "@/components/buttons/index.js";
import EditableList from "@/components/editable/EditableList.vue";
import {ref} from "vue";
import MemberDoFieldTable from "@/components/table/components/MemberDoFieldTable.vue";
import {Avatar} from "@/components/index.js";
import IconsTypeCall from "@/components/table/components/IconsTypeCall.vue";

const editableListId = ref(1);

const { detailsTo, handleClickRow } = defineProps(["columns", "items", "detailsTo", "search", "handleClickRow"]);
const emit = defineEmits(["update-checkbox", "handleEdit"])
const router = useRouter();

// const columnTitleInfo = (column, item) => {
//   return column.heading === 'Пользователь' ? item.createUser.fio + "\n" + item.createUser.userRole.title : '';
// }

const handleDetailsTo = (item) => {
  if(handleClickRow){
    handleClickRow(item)
  }

  if(!detailsTo) return

  router.push(detailsTo + item.id)
}

const iconColor = (item, column) => {
  return column.options.items.find(option => option.value === item[column.value]).color;
}

const formatColumn = (value, filterOptions, search, transcript) => {
  const { filterType, filterValues } = filterOptions

  if (value && filterType && filterType === FILTER_TYPE_DATE) {
    let time = Date.parse(value);
    return new Intl.DateTimeFormat('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric'}).format(time);
  }

  if (value && filterType && filterType === FILTER_TYPE_DATE_TIME) {
    let time = Date.parse(value);
    return new Intl.DateTimeFormat('ru-RU', {
      hour: "numeric", minute: "numeric",
      day: '2-digit', month: '2-digit', year: 'numeric'}).format(time);
  }

  if(value &&  filterType === FILTER_TYPE_MONEY){
    return moneyFormat(value)
  }

  if(filterType === FILTER_TYPE_EQ_CHECK){
    const currentValue = filterValues.find(item => item.value === value)
    if(!currentValue) return

    return `<span title="${currentValue.title}" class="mdi ${currentValue.icon ? currentValue.icon : `mdi-circle`}" style="color: ${currentValue.color}; font-size: 20px"></span>`
  }

  // расшифровка
  if(value && transcript){
    return filterValues?.find(i => i.value === value || i.key === value).title
  }

  if(!search) return value

  // bold substrings of search results depending on search query
  if(value && typeof value === "string") {
    return highlightedText(value, search)
  }

  return value
}

const handleFormatColumn = (item, column, search) => {
  return !isObject(item[column.value]) ? formatColumn(item[column.value], column.filterOptions, search, column.transcript)
          : !isObject(item[column.value][column.subValue]) ? formatColumn(item[column.value][column.subValue], column.filterOptions, search, column.transcript)
          : !isObject(item[column.value][column.subValue][column.subValueSecond]) ? formatColumn(item[column.value][column.subValue][column.subValueSecond], column.filterOptions, search, column.transcript)
          : formatColumn(item[column.value][column.subValue][column.subValueSecond][column.subValueThird], column.filterOptions, search, column.transcript)
}

const handleTextTooltip = (item, column) => {
  return !isObject(item[column.tooltipValue]) ? item[column.tooltipValue] : item[column.tooltipValue][column.tooltipSubValue]
}

const getLocalTime = (timeDiff) => {
  const timeNow = new Date().getTime()
  const timeLocal = timeNow + +timeDiff*3600000

  const date = new Date(timeLocal)

  let hours = String(date.getHours()).padStart(2, '0');
  let minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`
}
</script>

<style scoped lang="scss">
.tooltip-custom{
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, -8px);
  width: max-content;
  max-width: 600px;
  border-radius: 4px;
  background: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface-variant));
  transition: 0.3s;
  opacity: 0;
  visibility: hidden;
  padding: 8px 16px;
  pointer-events: none;
  user-select: none;
}

.tooltip-custom-wrap:hover .tooltip-custom{
  opacity: 1;
  visibility: visible;
}
</style>