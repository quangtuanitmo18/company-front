<template>
  <div class="auth">
    <!--    <div class="auth-top">-->
    <!--      <div class="auth-top-container">-->
    <!--        <img class="auth-top__logo" :src="logo">-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="auth-bg" :style="{'background': 'url('+ image + ') center center/cover no-repeat'}">
      <v-card class="ma-auto px-12 pt-8 pb-8" elevation="8" width="460" rounded="lg">
        <div class="pb-4 border-b-sm mb-4">
          <p class="text-h5 text-center">Войти в систему</p>
        </div>
        <v-form ref="form">
          <div class="text-subtitle-1 text-medium-emphasis">Логин или Email</div>
          <v-text-field @keydown.enter="submit" :rules="[v => !!v || 'Поле обязательное']" v-model="username" density="compact" prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis">Пароль</div>
          <v-text-field
              @keydown.enter="submit"
              :rules="[v => !!v || 'Поле обязательное']"
              v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
              density="compact" prepend-inner-icon="mdi-lock-outline" variant="outlined"
              @click:append-inner="visible = !visible"
          ></v-text-field>
          <v-btn @click="submit" :loading="loading" block color="primary" size="large" variant="flat">
            Войти
          </v-btn>
<!--          <div class="text-center py-2 recovery">-->
<!--            <router-link :to="recover">Восстановить пароль</router-link>-->
<!--          </div>-->
          <div v-if="error">
            <span class="error">{{ error }}</span>
          </div>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import image from "@/assets/images/bg1.jpg"

const visible = ref(false)
const username = ref("")
const password = ref("")
const error = ref("")
const form = ref(null)
const loading = ref(false)
const recover = '/user/password/recover';

const store = useStore()
const router = useRouter()

const submit = async () => {
  error.value = ""

  const { valid } = await form.value.validate()

  if (!valid) return

  loading.value = true

  store.dispatch("auth/login", {
    username: username.value,
    password: password.value
  }).then(res => {
    if(res){
      location.href = "/"
    }
  }).catch(err => {
    error.value = err
  }).finally(() => {
    loading.value = false
  })
}

</script>

<style scoped lang="scss">
.auth{
  height: 100vh;
}
.auth-link:hover{
  text-decoration: underline;
}
.auth-bg{
  display: flex;
  height: 100%;
}
.error{
  color: #B00020;
  font-size: 14px;
}
.auth-top{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  box-shadow: 0 1px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;

  &-container{
    width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }

  &__logo{
    width: 130px;
  }
}

.recovery {
  a {
    text-decoration: none;
  }

  a:hover {
    color: #d84315;
  }
}
</style>