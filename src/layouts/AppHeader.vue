<template>
  <header class="header">
    <div class="header-wrapper">
      <div class="header__login" v-if="isAuth">
        <div class="header__login-info">
          <p class="header__login-info-name">{{ user?.fio }}</p>
        </div>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-account" size="small" v-bind="props"></v-btn>
          </template>

          <v-list min-width="200px">
            <div v-for="(item, index) in items" :key="index" >
              <p class="header-menu-title">{{ item.title }}</p>
              <v-list-item
                  v-for="(child, id) in item.content"
                  :key="id"
                  @click="child.handleFunc"
                  class="item-icon-small header-menu-item"
              >
                <template v-slot:prepend>
                  <v-icon size="small" :icon="child.icon"></v-icon>
                </template>
                <v-list-item-title>{{ child.title }}</v-list-item-title>
              </v-list-item>
            </div>
          </v-list>
        </v-menu>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useStore } from "vuex";
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const store = useStore()
const isAuth = computed(() => store.getters["auth/isAuthenticated"])
const user = computed(() => store.getters["auth/user"])

const handleLogout = () => {
  store.dispatch("auth/logout").then(res => {
    if(res){
      router.push({ name: "login" })
    }
  })
}

const handleRedirect = (path) => {
  router.push({
    name: path,
  })
}

const items = [
  {
    title: "Аккаунт",
    content: [
      {
        icon: "mdi-badge-account-horizontal-outline",
        title: 'Профиль',
        handleFunc: () => handleRedirect("profile")
      },
      {
        icon: "mdi-logout-variant",
        title: 'Выйти',
        handleFunc: handleLogout
      },
    ]
  }
]
</script>

<style lang="scss" scoped>
.header{
  background-image: var(--color-header);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-wrapper{
  width: 100%;
  height: 60px;
  padding: 0 20px;
  margin-right: auto;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;

}
.header-menu-title{
  padding: 0 16px;
  font-weight: 500;
  color: var(--text-secondary);
}
.header-menu-item{
  color: rgb(var(--color-primary)) !important;
}

.header__login{
  display: flex;
  align-items: center;
  column-gap: 10px;

  &-info{
    display: flex;
    flex-direction: column;
    color: white;
    align-items: end;

    &-type{
      font-size: 14px;
      opacity: 0.6;
    }
  }
}
</style>