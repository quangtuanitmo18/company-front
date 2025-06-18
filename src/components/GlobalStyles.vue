<template>
  <slot></slot>
</template>

<script>
export default {
  name: "GlobalStyles",
};
</script>

<style lang="scss">
$body-font-family: "Neusa Next Pro", sans-serif;

:root {
  --text-primary: #033c73;
  --text-main: #505863;
  --text-secondary: #495057aa;
  --secondary: #ced4da;

  --text-success: #73a839;
  --text-info: #16aaff;
  --text-error: #d8101c;
  --text-warning: #fc6815;
  --text-highlight: #820711;
  // Color primary in format rgb, it's important!
  --color-primary: 3, 60, 115;
  --color-blue-dark: #415b76;
  --color-blue-dark-2: #27394e;
  --color-header: linear-gradient(
    to right,
    var(--color-blue-dark-2) 70%,
    var(--color-blue-dark) 100%
  );
  --color-profile: linear-gradient(
    to left,
    var(--color-blue-dark-2) 70%,
    var(--color-blue-dark) 100%
  );
  --color-black: #505863;
  --color-error-table: #ff00006b;
  --color-secondary: #495057aa;
  --color-warning-table: #f39c126b;
  --color-success-table: #73a8396b;

  //Overwrite font vue date picker
  --dp-font-family: "Neusa Next Pro", sans-serif !important;
  --dp-action-button-height: 24px !important;
  --dp-preview-font-size: 0.9rem !important;

  // Overwrite color schedule-x vue
  --sx-color-primary: rgb(var(--color-primary)) !important;
  --sx-color-primary-container: #086dce61;
  --sx-color-surface-container: #086dce61;
  --sx-color-on-primary-container: #033c73;
  --sx-color-surface-dim: #eef1f5;
}

html {
  font-family: "Neusa Next Pro", sans serif !important;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

button,
input {
  outline: none;
  background-color: transparent;
  border: none;
  font-family: "Neusa Next Pro", sans serif !important;
}

ul {
  list-style: none;
}

a[href] {
  color: inherit;
  text-decoration: none;
}

a.mail{
  color: rgb(var(--color-primary));
}

a.mail:hover{
  text-decoration: underline;
}

i.v-icon {
  transition: color 0.3s;
}

body {
  b,
  strong {
    font-weight: 500;
  }
}

.body{
  width: 100%;
  padding: 20px;
  margin-right: auto;
  margin-left: auto;

  @media (min-width: 960px) {
    max-width: 900px;
  }
  @media (min-width: 1280px) {
    max-width: 1200px;
  }
  @media (min-width: 1680px) {
    max-width: 1400px;
  }
}

.text-xs {
  font-size: 12px;
}

.text-sm {
  font-size: 14px;
}

.text-base {
  font-size: 16px;
}

.text-h1,
.text-h2,
.text-h3,
.text-h4,
.text-h5,
.text-h6{
  font-family: "Neusa Next Pro", sans serif !important;
}

.text-highlight {
  color: var(--text-highlight);
  font-size: 15px;
}

.text-success{
  color: var(--text-success);
}


.text-ellipsis {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

img {
  max-width: 100%;
  height: auto;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

div:empty {
  margin: 0 !important;
}

.pull-right {
  float: right;
}

[class^="text-"] {
  font-family: "Neusa Next Pro", sans serif !important;
}

.custom-scrollbar::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 3px;
  height: 3px;
  background-color: transparent;
  -webkit-overflow-scrolling: auto;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}
.icon-color-error {
  color: var(--text-error) !important;
}
.icon-color-success {
  color: var(--text-success) !important;
}
.icon-color-primary {
  color: rgb(var(--color-primary)) !important;
}
.icon-color-error-full {
  color: white !important;
  background-color: var(--text-error) !important;
}
.icon-color-success-full {
  color: white !important;
  background-color: var(--text-success) !important;
}

.form-notion-text {
  &.success {
    color: var(--text-success);
  }

  &.error {
    color: var(--text-error);
  }
}

button.table-head-icon {
  float: right;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: 0.3s;
  background-color: #fff;
  color: rgb(var(--color-primary));

  &:hover {
    background-color: #f8f9fa;
  }
}

.message__content-text {
  ul {
    padding-left: 40px;
    list-style: initial;
  }
  ol {
    padding-left: 40px;
    list-style: decimal;
  }
  a {
    color: rgb(var(--color-primary));
    text-decoration: underline;
  }
}

.message-error {
  margin-top: 6px;
  line-height: 12px;
  font-size: 12px;
  word-break: break-word;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  transition: all 0.3s;
  transform: translateY(-100%);
  opacity: 0;

  &.active {
    transform: translateY(0);
    opacity: 1;
    color: rgb(var(--v-theme-error));
  }
}

//Form with many blocks
.card-error {
  padding: 16px;
  border-radius: 4px;
  background-color: var(--text-error);
  color: white;

  &-title {
    font-size: 18px;
    font-weight: 500;
  }

  &-list {
    padding-left: 16px;
    list-style: disc;
    font-size: 14px;
  }
}
.card-block {
  margin-top: 16px;
  border-radius: 4px;
  border: 1px solid #ecf0f1;

  &[nomargin] {
    margin: 0 !important;
  }
}
.card-block-header {
  padding: 8px 16px;
  display: flex;
  column-gap: 8px;
  align-items: center;
  background-color: var(--secondary);
}
.card-block-body {
  padding: 16px;
}

// V-checkbox
.v-checkbox:not(.other-color) .v-selection-control--dirty .v-selection-control__input > .v-icon {
  color: var(--text-success);
}

//Overwrite vuetify
body .v-list-item--density-default.v-list-item--one-line {
  min-height: 32px;
}

button.bg-primary,
.text-primary {
  --v-theme-primary: var(--color-primary);
}

button.bg-primary.danger {
  --v-theme-primary: 216, 16, 28;
}

.color-primary {
  color: rgb(var(--color-primary)) !important;
}

.color-secondary {
  color: var(--color-secondary) !important;
}

button.text-primary,
a.text-primary {
  color: rgb(var(--color-primary)) !important;
}

.v-selection-control-group--inline {
  column-gap: 24px;
}

.v-row {
  margin-top: -8px !important;
  margin-bottom: -8px !important;
}

.v-row > div {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

// overwrite v-radio
.v-radio-group > .v-input__control > label.v-label {
  margin-inline-start: 0;
}
.v-radio-group > .v-input__control > .v-label + div.v-selection-control-group {
  margin-top: 0;
  padding-inline-start: 0;
}
.v-selection-control.v-radio {
  .v-selection-control__wrapper {
    color: var(--text-color);
    caret-color: var(--text-color);
  }

  .v-label {
    color: var(--text-color);
  }

  &.info {
    --text-color: var(--text-info);
  }

  &.warning {
    --text-color: var(--text-warning);
  }

  &.danger {
    --text-color: var(--text-error);
  }
}

// Stepper vuetify
.v-stepper-item--selected div.v-stepper-item__avatar.v-avatar,
.v-stepper-item--complete div.v-stepper-item__avatar.v-avatar {
  background: rgb(var(--color-primary));
}

.v-field__input {
  word-break: break-word;
}

button.v-stepper-item {
  padding: 1rem;
}

div.v-stepper-window {
  margin: 1rem;
}

//Data table
table {
  --v-table-row-height: 44px;
  --v-table-header-height: 44px;
  border-collapse: collapse;
}

.table thead > tr {
  font-size: 16px;
}

.table tbody > tr:nth-child(2n + 1) {
  background-color: #f5f5f5;
}

.table tbody tr{
  border: 1px solid transparent;
  outline: 1px solid transparent;
}

.table.view-detail tbody > tr:hover {
  cursor: pointer;
  background-color: rgba(var(--color-primary), 0.15);
}

.table tbody tr.success {
  background-color: var(--color-success-table) !important;
}

.table tbody tr.warning {
  background-color: var(--color-warning-table) !important;
}

.table tbody tr.error {
  background-color: var(--color-error-table) !important;
}

.table tbody tr.playing{
  border: 1px solid rgb(var(--color-primary));
  outline: 1px solid rgb(var(--color-primary));
  animation: pulseBorderColor 3s linear infinite alternate;
}

div.v-table>.v-table__wrapper>table>tbody>tr>td,
div.v-table>.v-table__wrapper>table>tbody>tr>th,
div.v-table>.v-table__wrapper>table>thead>tr>td,
div.v-table>.v-table__wrapper>table>thead>tr>th,
div.v-table>.v-table__wrapper>table>tfoot>tr>td,
div.v-table>.v-table__wrapper>table>tfoot>tr>th{
  padding: 0 12px;
}

@keyframes pulseBorderColor {
  0% {
    border-color: rgb(147, 14, 0);
    outline-color: rgb(147, 14, 0);
  }
  25% {
    border-color: rgb(255, 165, 0);
    outline-color: rgb(255, 165, 0);
  }
  50% {
    border-color: rgb(0, 145, 21);
    outline-color: rgb(0, 145, 21);
  }
  75% {
    border-color: rgb(20, 0, 131);
    outline-color: rgb(20, 0, 131);
  }
  100% {
    border-color: rgb(147, 14, 0);
    outline-color: rgb(147, 14, 0);
  }
}


div.v-table__wrapper {
  overflow: visible;
}

//Table for view info
.table-view table {
  --v-table-row-height: 34px;
}
.table-view tbody {
  tr {
    td:first-child {
      width: 370px;
      border-style: none;
      border-top-style: solid;
      border-bottom-style: solid;
      border-image: linear-gradient(
        to right,
        #ffffff 1%,
        rgba(232, 235, 236, 0.57),
        rgba(0, 0, 0, 0.12)
      );
      border-image-slice: 1;
      color: var(--text-secondary);
    }

    td:last-child {
      border-style: none;
      border-top-style: solid;
      border-bottom-style: solid;
    }
  }

  td {
    border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-top: 8px !important;
    padding-bottom: 8px !important;

    border-right: none;
    border-left: none;
  }
}

.table-view tbody tr:not(:last-child) > td {
  border-bottom: none !important;
}

.table-view tbody tr:last-child > td {
  border-bottom: none !important;
}

.table-view tbody tr:first-child > td {
  border-top: none !important;
}

.table-view .table-section {
  background-color: var(--secondary) !important;
  color: white;

  &.warning {
    background-color: var(--color-warning-table) !important;
  }
}

.table-view .table-section-header {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 400;
  color: #141e30;
}

.table-view .table-section-header span {
  padding-top: 5px;
  padding-left: 8px;
}

.table-view .v-checkbox .v-selection-control {
  --v-input-control-height: 36px;
  column-gap: 8px;
}

.table-view .v-selection-control--density-default {
  --v-selection-control-size: 18px;
}

.table-view .v-label {
  --v-medium-emphasis-opacity: 1;
  font-size: 14px;
}

.table-view .v-selection-control--disabled {
  opacity: 1;

  & .v-selection-control__wrapper {
    opacity: var(--v-disabled-opacity);
  }
}

.table-view .v-selection-control--dirty .v-selection-control__input > .v-icon {
  color: var(--text-success);
}

.table-view.table-view--primary tbody {
  tr {
    td:first-child {
      color: rgb(var(--color-primary));
    }
  }
}

.table-view.table-view--comparator tbody {
  tr {
    td:nth-child(3) {
      p {
        display: none;
      }
    }
  }

  tr.has-change {
    td:first-child {
      text-decoration: underline var(--text-warning);
    }

    td:nth-child(2) {
      width: 450px;
    }

    td:nth-child(3) {
      color: var(--text-secondary);
      font-style: italic;
      p {
        min-width: 370px;
        display: block;
        color: var(--text-highlight);
      }
    }
  }
}

.table-view {
  .card {
    &.new {
      box-shadow: 0px 2px 4px -1px var(--text-success), 0px 1px 4px 0px var(--text-success),
        0px 1px 10px 0px var(--text-success) !important;

      &::after {
        content: "Новое";
        position: absolute;
        top: -11px;
        left: 11px;
        border-radius: 4px;
        padding: 2px 6px;
        color: white;
        background-color: var(--text-success);
        font-size: 12px;
      }
    }

    &.update {
      box-shadow: 0px 2px 4px -1px var(--text-warning), 0px 1px 4px 0px var(--text-warning),
        0px 1px 10px 0px var(--text-warning) !important;

      &::after {
        content: "Измененное";
        position: absolute;
        top: -11px;
        left: 11px;
        border-radius: 4px;
        padding: 2px 6px;
        color: white;
        background-color: var(--text-warning);
        font-size: 12px;
      }
    }

    &.delete {
      box-shadow: 0px 2px 4px -1px var(--text-error), 0px 1px 4px 0px var(--text-error),
        0px 1px 10px 0px var(--text-error) !important;

      &::after {
        content: "Удаленное";
        position: absolute;
        top: -11px;
        left: 11px;
        border-radius: 4px;
        padding: 2px 6px;
        color: white;
        background-color: var(--text-error);
        font-size: 12px;
      }
    }
  }
}

.table-search {
  max-width: 400px;
  display: flex;
  margin-bottom: 8px;

  &:focus-within {
    .table-search-icon {
      color: black;
    }
  }
}
.table-search-with-select {
  max-width: 600px;
  display: flex;
  margin-bottom: 8px;
  justify-content: flex-start;

  & .v-text-field {
    min-width: 280px;
  }
}
.table-search-icon {
  margin-top: 20px;
  color: #a8a8a8;
  pointer-events: none;

  &.active {
    pointer-events: all;
    color: rgb(var(--color-primary)) !important;
    cursor: pointer;
  }
}

// Card view
.card-view-header > .v-row {
  margin: 0 !important;

  & > div {
    border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
    font-size: 14px;

    &:first-child {
      padding-right: 48px;
    }

    &:nth-child(2) {
      padding-right: 48px;
      padding-left: 48px;
    }

    &:nth-child(3) {
      padding-left: 48px;
    }
  }

  &:last-of-type > div {
    border-bottom: none;
  }
}

.v-pagination__item--is-active {
  pointer-events: none;
}

.v-list--density-default {
  > .v-input--density-default {
    position: sticky;
    top: -8px;
    z-index: 99;
    background-color: white;
    padding: 0 16px;
  }
}

.item-icon-small {
  .v-list-item__prepend {
    max-width: 28px;

    > .v-icon {
      opacity: 1;
    }
  }
}

div.v-list-item__prepend {
  align-self: start;
  margin-top: 2px;
}

div.v-list-item__append > .v-icon {
  opacity: 1;
}

.select-small .v-field__input {
  min-height: 32px;
  padding: 0 0 0 8px;
}

.select-small.v-text-field .v-field {
  padding-right: 0;
}

// Overwrite vue date picker
div.dp__range_end,
div.dp__range_start,
div.dp__active_date,
div.dp__overlay_cell_active,
button.dp__action_select,
button.dp__action_select:hover {
  background-color: rgb(var(--color-primary));
}

button.dp__action_cancel:hover,
div.dp__today {
  border-color: rgb(var(--color-primary));
}

div.dp__selection_preview {
  display: none;
}

//Animation
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s !important;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20%);
  opacity: 0;
}

.slide-fade-enter-active {
  transition-delay: 0.3s !important;
}

// Calendar schedule
.sx__month-grid-wrapper {
  min-height: calc(100vh - 207px);
}

.sx__calendar-header {
  padding: 8px 12px 20px 12px;
}

.sx__calendar {
  border: none;
}

.sx__view-selection{
  display: none;
}

.sx__date-picker-popup{
  max-height: 600px;
  overflow: hidden;
  box-shadow: 0px 5px 5px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 8px 10px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 3px 14px 2px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12))
}

/*----- Panels -----*/
.panel-header {
  background: var(--secondary) !important;
  padding: 10px !important;
  min-height: auto !important;
}

.panel-header .panel-section-header {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 400;
  color: #141e30;
}

</style>
