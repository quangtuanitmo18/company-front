<template>
  <div class="sidebar" :class="{'sidebar-closed': isCloseSidebar, 'sidebar-open': isOpenSidebarForced}">
    <div class="sidebar__body-bg" :style="{backgroundImage: `url(${bg[projectId]})`}"></div>
    <div class="sidebar__head">
      <div class="d-flex logo">
        <img v-if="logo[projectId]?.icon" :alt="logo[projectId].title" :src="logo[projectId].icon" />
        <p style="font-size: 36px; font-weight: 900; color: #f4d9d9; font-style: italic" v-else>{{ logo[projectId]?.title }}</p>
      </div>
      <div @click="toggleSideBar" class="hamburger-box hamburger--elastic" :class="{'active': !isCloseSidebar}">
        <span class="hamburger-inner"></span>
      </div>
    </div>
    <div @mouseenter="handleOpenSidebarForce" @mouseleave="handleCloseSidebarForce" class="sidebar__body custom-scrollbar">
      <div class="sidebar__body-bg" :style="{backgroundImage: `url(${bg[projectId]})`}"></div>
      <div class="sidebar__body-inner" v-if="filteredNavs.length">
        <div v-for="nav in filteredNavs">
          <template v-if="nav.content && nav.content.length > 0">
            <h5 class="sidebar__body-inner-title">{{nav.title}}</h5>
            <MetisMenu :content="nav.content"></MetisMenu>
          </template>
        </div>
      </div>
      <router-link to="/" class="d-flex align-center ga-1 pt-5 bottom-link mt-auto">
        <v-icon color="white" size="x-large" icon="mdi-arrow-left-thin"></v-icon>
        <p class="font-weight-bold text-h5 text-no-wrap mt-1" style="color: white">к проектам</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { MetisMenu } from "@/components/index.js";
import navs from "@/data/nav.json"
import {computed, onMounted, ref} from "vue"
import { useStore } from "vuex";
import logoOssa from "@/assets/images/ossa/logo-ossa.svg"
import bgOssa from "@/assets/images/ossa/sidebar-bg.png"
import bgMailer from "@/assets/images/mailer/mailer.jpg"
import bgEmployees from "@/assets/images/employees/employees.jpg"
import bgAuth from "@/assets/images//auth/auth.jfif"
import {useRouter} from "vue-router";

const store = useStore()
const router = useRouter()

const filteredNavs = ref([])

const isCloseSidebar = computed(() => store.getters["settings/closeSidebar"])
const projectId = computed(() => store.getters["auth/projectId"])
const roles = computed(() => store.getters["auth/userRoles"])
const isOpenSidebarForced = ref(false)

const logo = {
  "ossa": {
    icon: logoOssa,
    title: "ОССА"
  },
  "employees": {
    title: "Сотрудники"
  },
  "mailer": {
    title: "Рассылки"
  },
  "auth": {
    title: "Авторизация"
  },
}

const bg = {
  "ossa": bgOssa,
  "employees": bgEmployees,
  "mailer": bgMailer,
  "auth": bgAuth
}

const toggleSideBar = () => {
  store.commit("settings/setCloseSidebar", !isCloseSidebar.value)
}

const handleOpenSidebarForce = () => {
  if(!isCloseSidebar.value) return

  isOpenSidebarForced.value = true
}

const handleCloseSidebarForce = () => {
  if(!isCloseSidebar.value) return

  isOpenSidebarForced.value = false
}

onMounted(async () => {
  function filterByRoles(data, roles) {
    return data.map(section => {
      const filteredContent = section.content
          .map(item => {
            // If there is nested content, handle it recursively
            if (item.content) {
              const subContent = filterByRoles([{ content: item.content }], roles)[0].content;
              // Return the item only if subContent has elements
              return subContent.length > 0 ? { ...item, content: subContent } : null;
            }

            const currentRoute = router.options.routes.find(i => i.path === item.to)

            // If roleName exists, check if there's an intersection with user roles
            if (currentRoute && currentRoute.meta.roleName) {
              const hasRole = currentRoute.meta.roleName.some(role => roles.includes(role));
              return hasRole ? item : null;
            }

            // If there's no roleName, always keep the item
            return item;
          })
          .filter(Boolean); // Remove null entries

      return { ...section, content: filteredContent };
    });
  }

  filteredNavs.value = filterByRoles(navs[projectId.value], roles.value)
})

</script>

<style lang="scss">
.sidebar{
  background-image: -webkit-linear-gradient(left,#141e30,#243b55);
  width: 280px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  -webkit-box-shadow: 7px 0 60px rgba(0,0,0,.05);
  box-shadow: 7px 0 60px rgba(0,0,0,.05);
  transition: width 0.3s;

  .sidebar__body-bg{
    position: absolute;
    inset: 0;
    filter: grayscale(1);
    opacity: 0.07;
    pointer-events: none;
    background-size: cover;
  }

  &.sidebar-closed{
    width: 80px;
    z-index: 9;

    & .sidebar__head{
      justify-content: center;
    }

    & .sidebar__body{
      width: 80px;
    }

    & .sidebar__head > .logo{
      display: none !important;
    }

    &:not(.sidebar-open) .metismenu-link a{
      width: 40px;
      overflow: hidden;
    }

    &:not(.sidebar-open) .sidebar__body-inner-title{
      color: transparent;
      position: relative;
      
      &::after{
        content: "";
        display: block;
        position: absolute;
        bottom: 50%;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: rgba(255,255,255,.2);
      }
    }

    &:not(.sidebar-open) .metismenu-link.metismenu-link--toggle::after{
      opacity: 0;
    }

    &:not(.sidebar-open) .metismenu-list > .metismenu-item > .metismenu-list{
      transform: scale(0);
      padding-top: 0;
    }

    &:not(.sidebar-open) .metismenu-list > .metismenu-item > .metismenu-list .metismenu-link{
      height: 0;
    }

    & .bottom-link{
      justify-content: center;

      & p{
        display: none;
      }
    }
  }

  &.sidebar-closed.sidebar-open{
    & .sidebar__body{
      position: fixed;
      top: 60px;
      height: 100vh;
      width: 280px;
      padding-bottom: 84px;
      background-image: -webkit-linear-gradient(left,#141e30,#243b55);

      > .sidebar__body-bg{
        display: block;
        background-position: 0 -60px;
      }
    }

    & .bottom-link{
      justify-content: flex-start;

      & p{
        display: block;
      }
    }
  }
}

.logo{
  pointer-events: none;
  user-select: none;
}

.sidebar__head{
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar__body{
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  color: white;
  padding: 2px 20px 24px;
  position: relative;
  transition: 0.3s;
  background-color: transparent;
  width: 280px;
  display: flex;
  flex-direction: column;

  & > &-bg{
    transition: 0.3s;
    display: none;
  }

  &-inner-title{
    margin: 12px 0;
    text-transform: uppercase;
    font-size: 13px;
    line-height: 1;
    white-space: nowrap;
  }
}

.hamburger-box{
  width: 24px;
  height: 14px;
  display: inline-block;
  position: relative;
  cursor: pointer;

  .hamburger-inner {
    display: block;
    top: 50%;
    margin-top: -1px;

    &::before{
      content: "";
      display: block;
      top: -6px;
    }

    &::after{
      content: "";
      display: block;
      bottom: -6px
    }
  }

  .hamburger-inner,.hamburger-inner::before,.hamburger-inner::after {
    width: 24px;
    height: 2px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    -webkit-transition-property: -webkit-transform;
    transition-property: -webkit-transform;
    -o-transition-property: transform;
    transition-property: transform;
    transition-property: transform,-webkit-transform;
    -webkit-transition-duration: .15s;
    -o-transition-duration: .15s;
    transition-duration: .15s;
    -webkit-transition-timing-function: ease;
    -o-transition-timing-function: ease;
    transition-timing-function: ease
  }
}

.hamburger--elastic {
  .hamburger-inner {
    top: 1px;
    -webkit-transition-duration: .275s;
    -o-transition-duration: .275s;
    transition-duration: .275s;
    -webkit-transition-timing-function: cubic-bezier(.68,-.55,.265,1.55);
    -o-transition-timing-function: cubic-bezier(.68,-.55,.265,1.55);
    transition-timing-function: cubic-bezier(.68,-.55,.265,1.55);

    &::before{
      top: 6px;
      -webkit-transition: opacity .125s .275s ease;
      -o-transition: opacity .125s .275s ease;
      transition: opacity .125s .275s ease;
    }

    &::after{
      top: 12px;
      -webkit-transition: -webkit-transform .275s cubic-bezier(.68,-.55,.265,1.55);
      transition: -webkit-transform .275s cubic-bezier(.68,-.55,.265,1.55);
      -o-transition: transform .275s cubic-bezier(.68,-.55,.265,1.55);
      transition: transform .275s cubic-bezier(.68,-.55,.265,1.55);
      transition: transform .275s cubic-bezier(.68,-.55,.265,1.55),-webkit-transform .275s cubic-bezier(.68,-.55,.265,1.55)
    }
  }

  &.active{
    .hamburger-inner {
      -webkit-transform: translate3d(0,6px,0) rotate(135deg);
      transform: translate3d(0,6px,0) rotate(135deg);
      -webkit-transition-delay: .075s;
      -o-transition-delay: .075s;
      transition-delay: .075s;

      &::before{
        -webkit-transition-delay: 0s;
        -o-transition-delay: 0s;
        transition-delay: 0s;
        opacity: 0;
      }

      &::after{
        -webkit-transform: translate3d(0,-12px,0) rotate(-270deg);
        transform: translate3d(0,-12px,0) rotate(-270deg);
        -webkit-transition-delay: .075s;
        -o-transition-delay: .075s;
        transition-delay: .075s;
      }
    }
  }
}
</style>