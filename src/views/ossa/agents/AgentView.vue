<template>
  <app-page-title iconClassname="mdi-office-building">
    <template #content>
      <div v-if="!loading" class="agent-header">
        <div class="d-flex flex-column">
          <div class="d-flex">
            <p class="mr-1 color-secondary">Наименование:</p>
            <p class="mr-4">{{info?.shortname}}</p>
          </div>
          <div class="d-flex">
            <p class="mr-1 color-secondary">ИНН:</p>
            <p class="mr-4">{{info?.inn}}</p>
            <p class="mr-1 color-secondary" v-if="info?.memberDoStatus">Статус:</p>
            <p class="mr-4" v-if="info?.memberDoStatus">{{info?.memberDoStatus?.title}}</p>
            <p class="mr-1 color-secondary">СРО:</p>
            <p class="mr-4">{{info?.sro?.shortName}}</p>
          </div>
        </div>
        <div class="agent-contacts">
          <div class="mr-4 d-flex ga-4">
            <img width="52px" height="41px" alt="ЦСО" :src="cso" :class="{'image-disabled': !info.isCSO}"/>
            <img width="52px" height="41px" alt="ССП" :src="ssp" :class="{'image-disabled': !info.isSSP}"/>
            <img width="52px" height="41px" alt="ИГС" :src="igs" :class="{'image-disabled': !info.isIGS}"/>
          </div>
          <card-contacts :contacts="contacts" :sro="info?.sro" @add-contact="handleAddContact"></card-contacts>
        </div>
      </div>
    </template>
  </app-page-title>
  <card-with-actions>
    <div class="agent-content" v-if="!loading">
      <div class="d-flex flex-row">
        <v-tabs
            v-model="tab"
            class="color-primary mt-2 mb-3"
            direction="vertical"
        >
          <v-tab :prepend-icon="item.icon" v-for="(item, id) in configTabs" :key="id">
            <slot name="default">
              {{ item.title }}
            </slot>
          </v-tab>
        </v-tabs>
        <v-window class="w-100" v-model="tab">
          <v-window-item v-for="(item, id) in configTabs" :key="id" :value="item.value">
            <keep-alive>
              <component :is="item.component"  @update-info="updateInfo" :data="info" />
            </keep-alive>
          </v-window-item>
        </v-window>
      </div>
    </div>
    <template v-else>
      <div style="clear: both"></div>
      <div class="text-center pb-10">
        <v-progress-circular indeterminate class="color-primary" />
      </div>
    </template>
  </card-with-actions>
</template>
<script setup>
import AppPageTitle from "@/layouts/AppPageTitle.vue";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {memberDoDetailFull} from "@/service/ossa/sqlup/memberDoService.js";
import DetailCard from "@/views/ossa/agents/components/DetailCard.vue";
import EventsDo from "@/views/ossa/agents/components/EventsDo.vue";
import CardWithActions from "@/components/CardWithActions.vue";
import {shortDateFormat} from "@/utils/format.js";
import CardContacts from "@/views/ossa/agents/components/CardContacts.vue";
import cso from "@/assets/images/cso.png";
import ssp from "@/assets/images/ssp.png";
import igs from "@/assets/images/igs.png";

const route = useRoute()
const info = ref(null)
const loading = ref(true)
const contacts = ref([])
const tab = ref("agent")

const configTabs = [
  {
    value: "agent",
    title: "Член СРО",
    icon: "mdi-account-box",
    component: DetailCard
  },
  {
    value: "comments",
    title: "Комментарии",
    icon: "mdi-clock",
    component: EventsDo
  },
]

const handleAddContact = (contact) => {
  contacts.value.unshift(contact)
}

const updateInfo = () => {
  memberDoDetailFull(route.params.id).then(res => {
    info.value = res.memberDo
    contacts.value = res.memberDo.contactsDo
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  updateInfo()
})
</script>
<style lang="scss" scoped>
.agent-header{
  position: relative;
  padding: 0 336px 0 0;
  width: 100%;
}
.agent-content{
  margin-top: -16px;
  margin-left: -16px;
  margin-right: -8px;
}
.agent-contacts{
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}
.image-disabled{
  filter: grayscale(1);
  opacity: 0.3;
}
</style>