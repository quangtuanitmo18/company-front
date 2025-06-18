<template>
  <v-menu
      :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <v-btn class="ml-auto" color="primary" prepend-icon="mdi-card-account-details" variant="outlined" v-bind="props">
        Контакты
      </v-btn>
    </template>

    <v-card min-width="300">
      <v-list>
        <v-list-item>
          <v-list-item-title>
            <p class="text-h6 color-primary font-weight-bold">Контакты</p>
          </v-list-item-title>
          <template v-slot:append>
            <v-icon @click="() => {isShowModal = true; isCreateContact = true; contact = {memberDo: +route.params.id}}" title="Добавить контакт" size="small" class="cursor-pointer color-primary" icon="mdi-plus"></v-icon>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-list
        max-height="550"
      >
        <v-list-item
            v-for="contact in contacts"
            class="item-icon-small"
            :disabled="!contact.isActive"
            max-width="500"
        >
          <template v-slot:prepend>
            <v-icon size="small" :icon="getIconContact(contact.contactType.id)"></v-icon>
          </template>
          <v-list-item-title>
            <template v-if="contact.contactType.id === TYPE_PHONE">
              <v-menu
                  :close-on-content-click="false"
                  location="left"
                  offset="32"
              >
                <template v-slot:activator="{ props }">
                  <span class="cursor-pointer d-block" v-bind="props">
                    {{contact.contact}}
                  </span>
                </template>
                <v-card min-width="212">
                  <v-list>
                    <v-list-item v-if="projectUserData.isLandlineNumber" @click="handleCallLandline(contact.contact, sro)" title="Стационарный">
                      <template v-slot:append>
                        <v-icon size="small" icon="mdi-phone-outgoing" class="color-primary cursor-pointer"></v-icon>
                      </template>
                    </v-list-item>
                    <v-list-item v-if="projectUserData.isMobileNumber" @click="handleCallMobile(contact.contact)" title="Мобильный">
                      <template v-slot:append>
                        <v-icon size="small" icon="mdi-phone-outgoing" class="color-primary cursor-pointer"></v-icon>
                      </template>
                    </v-list-item>
                    <v-list-item v-if="!projectUserData.isMobileNumber && !projectUserData.isLandlineNumber" title="Нет регистрации"></v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </template>
            <template v-else-if="contact.contactType.id === TYPE_MAIL">
              <a :href="`mailto:${contact.contact}`">{{contact.contact}}</a>
            </template>
            <template v-else-if="contact.contactType.id === TYPE_SITE">
              <a target="_blank" :href="contact.contact.includes('http') ? contact.contact : `//${contact.contact}`">{{contact.contact}}</a>
            </template>
            <template v-else>
              {{contact.contact}}
            </template>
          </v-list-item-title>
          <v-list-item-subtitle v-if="contact.contactPerson">
            <span class="font-italic" style="color: #495057 !important;">Контакное лицо:</span> {{ contact.contactPerson }}
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="contact.comment">
            <span class="font-italic" style="color: #495057 !important;">Комментарий:</span> {{ contact.comment }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <v-icon @click="handleOpenEditContact(contact)" size="small" title="Редактировать контакта" icon="mdi-pencil-outline" class="color-primary cursor-pointer"></v-icon>
          </template>
        </v-list-item>
        <v-list-item v-if="!contacts.length">
          Нет контактов
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
  <snackbar-notification
      v-model="successState"
      color="success"
      message="Совершается исходящий звонок из стороннего приложения"
  />
  <modal width="800" v-model="isShowModal" :title="isCreateContact ? 'Добавление контакта' : 'Редактирование контакта'">
    <template #content>
      <v-form ref="formContact" class="my-4">
        <v-row>
          <v-col cols="4">
            <v-select
                :disabled="!isCreateContact"
                v-model="contact.contactType"
                label="Тип контакта"
                variant="underlined"
                :items="CONTACT_TYPES"
                :rules="[v =>  !!v || 'Это обязательное поле.']"
                @update:modelValue="() => contact.contact = ''"
            ></v-select>
          </v-col>
          <v-col cols="8">
            <v-text-field
                variant="underlined"
                v-if="contact.contactType === 1"
                v-model="contact.contact"
                label="Контакт"
                :rules="[
                    v =>  !!v || 'Это обязательное поле.',
                    v => v.length === 10 || 'Номер телефона содержит 10 цифр.'
                ]"
            ></v-text-field>
            <email-field
                v-else-if="contact.contactType === 2"
                v-model="contact.contact"
                label="Контакт"
            ></email-field>
            <v-text-field v-else
                v-model="contact.contact"
                label="Контакт"
                variant="underlined"
                :rules="[v =>  !!v || 'Это обязательное поле.']"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
                v-model="contact.contactPerson"
                label="Контактное лицо"
                variant="underlined"
                hide-details
            >
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
                rows="3"
                v-model="contact.comment"
                label="Комментарий"
                variant="underlined"
                hide-details
            >
            </v-textarea>
          </v-col>
          <v-col cols="4">
            <v-select
                v-model="contact.isActive"
                label="Активен"
                variant="underlined"
                :items="SELECT_BOOLEAN"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
                v-model="contact.isResident"
                label="Резидент"
                variant="underlined"
                :items="SELECT_BOOLEAN"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
                v-model="contact.isMailing"
                label="Mail"
                variant="underlined"
                :items="SELECT_BOOLEAN"
            ></v-select>
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template #actions>
      <btn-secondary @click="() => {isShowModal = false; contact = {memberDo: +route.params.id}}">
        Закрыть
      </btn-secondary>
      <btn-primary :loading="isLoading" @click="handleSubmit">
        {{ isCreateContact ? 'Добавить' : 'Подтвердить' }}
      </btn-primary>
    </template>
  </modal>
</template>

<script setup>
import BtnPrimary from "@/components/buttons/BtnPrimary.vue";
import BtnSecondary from "@/components/buttons/BtnSecondary.vue";
import EmailField from "@/components/formFields/EmailField.vue";
import Modal from "@/components/Modal.vue";
import {CONTACT_TYPES, TYPE_FAX, TYPE_MAIL, TYPE_PHONE, TYPE_POST, TYPE_SITE} from "@/utils/dictionary.js";
import {computed, ref} from "vue";
import {useRoute} from "vue-router";
import {contactDoAdd, contactDoEdit} from "@/service/ossa/sqlup/contactDoService.js";
import {useStore} from "vuex";
import SnackbarNotification from "@/components/notifications/SnackbarNotification.vue";

defineProps(["contacts", "sro"])
const emit = defineEmits(["addContact"])

const route = useRoute()
const store = useStore()

const contact = ref({
  memberDo: +route.params.id
})
const formContact = ref("")
const isShowModal = ref(false)
const isCreateContact = ref(false)
const currentContact = ref(null)
const isLoading = ref(false)
const successState = ref(false)

const projectUserData = computed(() => store.getters["auth/projectUserData"])

const SELECT_BOOLEAN = [
  {
    value: true,
    title: "Да"
  },
  {
    value: false,
    title: "Нет"
  }
]

const handleCallLandline = (contact, sro) => {
  window.location.href = `sip:${sro.lineNumber}8${contact}@${import.meta.env.VITE_SIP_LANDLINE}`
  successState.value = true
}

const handleCallMobile = (contact) => {
  window.location.href = `sip:8${contact}@${import.meta.env.VITE_SIP_MOBILE}`
  successState.value = true
}

const handleOpenEditContact = (item) => {
  isShowModal.value = true
  isCreateContact.value = false

  currentContact.value = item

  contact.value.contactType = item.contactType.id
  contact.value.contact = item.contact
  contact.value.contactPerson = item.contactPerson
  contact.value.comment = item.comment
  contact.value.isActive = item.isActive
  contact.value.isResident = item.isResident
  contact.value.isMailing = item.isMailing
}

const handleSubmit = async () => {
  const {valid} = await formContact.value.validate()

  if(valid){
    isLoading.value = true
    if(isCreateContact.value){
      contactDoAdd({
        ...contact.value
      }).then(res => {
        // const newContact = {}
        //
        // newContact.contact = res.contactDo.contact
        // newContact.contactType = res.contactDo.contactType
        // newContact.contactPerson = res.contactDo.contactPerson
        // newContact.comment = res.contactDo.comment
        // newContact.isActive = res.contactDo.isActive
        // newContact.isResident = res.contactDo.isResident
        // newContact.isMailing = res.contactDo.isMailing
        // newContact.id = res.contactDo.id

        emit("addContact", res.contactDo)
        isShowModal.value = false
        contact.value = {
          memberDo: +route.params.id
        }
      }).finally(() => {
        isLoading.value = false
      })
    }else{
      contactDoEdit(currentContact.value.id, {
        ...contact.value
      }).then(res => {
        currentContact.value.contact = res.contactDo.contact
        currentContact.value.contactType = res.contactDo.contactType
        currentContact.value.contactPerson = res.contactDo.contactPerson
        currentContact.value.comment = res.contactDo.comment
        currentContact.value.isActive = res.contactDo.isActive
        currentContact.value.isResident = res.contactDo.isResident
        currentContact.value.isMailing = res.contactDo.isMailing

        isShowModal.value = false
        contact.value = {
          memberDo: +route.params.id
        }
      }).finally(() => {
        isLoading.value = false
      })
    }
  }
}

const getIconContact = (type) => {
  switch (type){
    case TYPE_PHONE: return "mdi-phone"
    case TYPE_MAIL: return "mdi-mail"
    case TYPE_SITE : return "mdi-web"
    case TYPE_FAX : return "mdi-fax"
    case TYPE_POST : return "mdi-post"
  }
}

</script>
<style lang="scss">
.v-list-item--disabled{
  opacity: 1;

  & > *{
    opacity: 0.6;
  }
}
.v-list-item--disabled .v-list-item__append{
  pointer-events: auto;
  opacity: 1 !important;
}
</style>