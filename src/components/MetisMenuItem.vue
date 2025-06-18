<template>
  <li class="metismenu-item">
    <div v-if="item.content && item.content.length > 0" @click="isOpen = !isOpen" class="metismenu-link metismenu-link--toggle" :class="{'has-active-child': isActive, 'open': isOpen }">
      <v-icon v-if="item.icon" :icon="item.icon"></v-icon>
      <a>{{ item.label }}</a>
    </div>
    <div class="metismenu-link" v-else>
      <v-icon v-if="item.icon" :icon="item.icon"></v-icon>
      <router-link :to="item.to">{{ item.label }}</router-link>
    </div>
    <ul v-if="item.content && item.content.length > 0" class="metismenu-list">
      <div v-for="(children, index) in item.content" :key="index" class="metismenu-link">
        <v-icon v-if="children.icon" :icon="children.icon"></v-icon>
        <router-link :to="children.to">{{ children.label }}</router-link>
      </div>
    </ul>
  </li>
</template>

<script setup>
import {onMounted, ref, watch} from "vue"
import { useRoute } from "vue-router"
const { item } = defineProps(["item"])
const isOpen = ref(false)
const isActive = ref(false)
const route = useRoute()

// active and open the current list which contain the active route
const handleOpenCurrentList = (path) => {
  if(item.content && item.content.length > 0){
    if(item.content.some(i => i.to === path)){
      isOpen.value = true
      isActive.value = true
    }
  }
}

onMounted(() => {
  handleOpenCurrentList(route.fullPath)
})

watch(
    () => route.path,
    (newPath) => {
      isActive.value = false
      isOpen.value = false

      handleOpenCurrentList(newPath)

      // Scroll to top
      window.scrollTo(0,0)
    }
)

</script>

<style lang="scss">
.metismenu-link{
  user-select: none;
  display: flex;
  height: 40px;
  transition: background-color .3s;
  cursor: pointer;
  position: relative;
  color: rgba(255,255,255,.7);

  i{
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  a{
    white-space: nowrap;
    font-size: 14px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding-left: 40px;
    transition: background-color 0.3s;

    &:hover{
      background: rgba(255,255,255,.1);
      color: rgba(255,255,255,1);
    }

    &.router-link-active {
      background-color: rgba(255,255,255,.1);
      color: rgba(255,255,255,1);
    }
  }
}

.metismenu-link.metismenu-link--toggle::after{
  pointer-events: none;
  content: "";
  display: block;
  position: absolute;
  right: 12px;
  top: 16px;
  width: 8px;
  height: 8px;
  transform: rotate(135deg);
  border: 1px solid;
  border-color: white white transparent transparent;
  transition: transform 0.3s, opacity 0.3s;
}

.metismenu-link.metismenu-link--toggle.open::after {
  transform: rotate(-45deg);
}

.metismenu-link.metismenu-link--toggle.has-active-child{
  font-weight: 500;
}

.metismenu-link.metismenu-link--toggle.open + .metismenu-list{
  padding-left: 30px;
  padding-top: 8px;
  transform: scale(1);

  & .metismenu-link{
    height: 32px;
  }
}

.metismenu-list > .metismenu-item > .metismenu-list{
  position: relative;
  transform: scale(0);
  transition: 0.3s;
  transform-origin: 18px 0;

  &::before{
    content: "";
    display: block;
    position: absolute;
    top: 0;
    height: 100%;
    left: 18.5px;
    width: 3px;
    background-color: rgba(255,255,255,.3);
  }

  & .metismenu-link {
    height: 0;
    transition: height 0.3s;

    a{
      padding-left: 12px;
    }
  }
}
</style>