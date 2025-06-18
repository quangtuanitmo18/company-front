<template>
  <span class="table-header" :data-order="getOrder(column, sort)" :class="{[getSortType(column, sort)]: true}" @click="handleSort(column, sort)" :id="column.value" href="#">
    {{ column.heading }}
  </span>
</template>

<script setup>
import {computed} from "vue";
const { setSort, sort, column } = defineProps(["column","sort", "setSort"])

const getSortType = (column, sort) => sort.find(i => i.sortBy === column.sortOptions.sortByValue)?.sortType

const getOrder = (column, sort) => sort.findIndex(i => i.sortBy === column.sortOptions.sortByValue) + 1

const handleSort = (column, sort) => {
  let copySort = [...sort]
  let currentSortBy = column.sortOptions.sortByValue
  let currentIndex = copySort.findIndex((i) => i.sortBy === currentSortBy)
  let currentSortType = copySort[currentIndex]?.sortType

  switch (currentSortType){
    case "asc":
      copySort.splice(currentIndex, 1, {
        sortBy: currentSortBy,
        sortType: "desc"
      })
      setSort(copySort)

      return

    case "desc":
      copySort.splice(currentIndex, 1)
      setSort(copySort)

      return

    default:
      setSort([
        ...copySort,
        {
          sortBy: currentSortBy,
          sortType: "asc"
        }
      ])
  }
}
</script>

<style scoped lang="scss">
.table-header{
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &.desc::before{
    content: "";
    display: inline-block;
    margin-right: 4px;
    transform: translateY(2px);
    border-bottom: solid 5px transparent;
    border-top: solid 5px black;
    border-left: solid 5px transparent;
    border-right: solid 5px transparent;
  }

  &.asc::before{
    content: "";
    display: inline-block;
    transform: translateY(-2px);
    margin-right: 4px;
    border-bottom: solid 5px black;
    border-left: solid 5px transparent;
    border-right: solid 5px transparent;
  }

  &.asc::after, &.desc::after{
    content: attr(data-order);
    display: inline-flex;
    justify-content: center;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    background-color: var(--text-warning);
    color: white;
    font-size: 12px;
    margin-left: 4px;
    transform: translateY(-1px);
    flex-shrink: 0;
  }
}
</style>