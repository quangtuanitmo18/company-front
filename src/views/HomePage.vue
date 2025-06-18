<template>
  <app-page-title :separate="true" iconClassname="mdi-apps" title="Доступные проекты"></app-page-title>
  <div class="body">
    <v-row>
      <v-col cols="12" sm="6" md="4" :key="project.id" v-for="project in projects">
        <v-card @click.once="redirectToProject(project)">
<!--          <v-img-->
<!--              class="align-end text-white"-->
<!--              height="200"-->
<!--              :src="bgCard[project.id]"-->
<!--              cover-->
<!--          >-->
<!--            <v-card-title>{{project.title}}</v-card-title>-->
<!--          </v-img>-->
          <div class="card-img">
            <div class="card-img__bg" :style="{backgroundImage: `url(${bgCard[project.id]})`}"></div>
            <p class="card-img__title">{{project.title}}</p>
          </div>
          <v-card-actions>
            <p style="font-size: 14px; line-height: 1.2" class="mr-2">{{project.description}}</p>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <snackbar-notification
        v-model="notification.value"
        :color="notification.color"
        :message="notification.message"
    />
  </div>
</template>

<script setup>
import {accessibleProjectList, getTokenProject} from "@/service/homeService.js";
import {onMounted, ref} from "vue";
import BtnPrimary from "@/components/buttons/BtnPrimary.vue";
import SnackbarNotification from "@/components/notifications/SnackbarNotification.vue";
import {jwtDecode} from "jwt-decode";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import bgOssa from "@/assets/images/ossa/bg-card.jpg"
import bgMailer from "@/assets/images/mailer/mailer.jpg"
import bgAuth from "@/assets/images/auth/auth.jfif"
import bgEmployess from "@/assets/images/employees/employees.jpg"

const store = useStore()
const router = useRouter()

const projects = ref([])

const notification = ref({
  value: false,
  color: '',
  message: ''
})

const bgCard = {
  "ossa": bgOssa,
  "employees": bgEmployess,
  "mailer": bgMailer,
  "auth": bgAuth,
}

const redirectToProject = async (project) => {
  try{
    project.loading = true
    const { token } = await getTokenProject(project.id)
    const projectUser = jwtDecode(token)
    store.commit("auth/setProjectToken", token)
    store.commit("auth/setProjectUser", projectUser)
    store.commit("auth/setProjectHref", project.project_href)

    await router.push(project.id)

    // Handle token
  }catch (err){
    notification.value = {
      value: true,
      color: "error",
      message: err
    }
  }finally {
    project.loading = false
  }
}

onMounted(() => {
  accessibleProjectList().then(res => {
    projects.value = res.projects
  })

  // Remove all settings for a specific project
  localStorage.removeItem("project_href")
  localStorage.removeItem("project_user")
  localStorage.removeItem("project_token")
})
</script>
<style scoped lang="scss">
.card-img{
  position: relative;
  height: 200px;
  background-image: -webkit-linear-gradient(left, #141e30, #243b55);
  display: flex;
  align-items: flex-end;

  &__bg{
    position: absolute;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    inset: 0;
    filter: grayscale(1);
    opacity: 0.17;
    pointer-events: none;
  }

  &__title{
    color: white;
    padding: 8px;
    font-size: 18px;
    font-weight: 500;
    line-height: 1;
  }
}
</style>