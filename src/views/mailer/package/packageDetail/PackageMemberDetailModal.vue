<template>
  <modal width="1200px" v-model="isOpen">
    <template #title>
      <template v-if="!loading">
        <div class="d-flex">
          <p class="mr-1 font-italic">Наименование:</p>
          <p class="mr-4">{{ memberData?.packageMember.memberShortname }}</p>
          <p class="mr-1 font-italic">ИНН:</p>
          <p class="mr-4">{{ memberData?.packageMember.memberInn }}</p>
        </div>
      </template>
      <template v-else> Загрузка данных... </template>
    </template>
    <template #content>
      <v-row>
        <v-col cols="12" md="6">
          <v-card elevation="2" class="pa-2">
            <v-row>
              <v-col cols="12" md="6">
                <p class="mr-1 font-weight-bold">Тип:</p>
              </v-col>
              <v-col cols="12" md="6">
                {{ memberData?.packageMember?.packageType.typeName }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="mr-1 font-weight-bold">Статус:</p>
              </v-col>
              <v-col cols="12" md="6">
                {{ memberData?.packageMember?.packageMemberStatus.statusName }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="mr-1 font-weight-bold">Организация:</p>
              </v-col>
              <v-col cols="12" md="6">
                {{ memberData?.packageMember.memberShortname }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="mr-1 font-weight-bold">ИНН:</p>
              </v-col>
              <v-col cols="12" md="6">
                {{ memberData?.packageMember.memberInn }}
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card elevation="2" class="pa-2">
            <v-row>
              <v-col cols="12" md="6">
                <p class="mr-1 font-weight-bold">Дата создания:</p>
              </v-col>
              <v-col cols="12" md="6">
                {{ shortDateFormat(memberData?.packageMember?.dttmCreated) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="mr-1 font-weight-bold">Дата генерации документов:</p>
              </v-col>
              <v-col cols="12" md="6">
                {{ shortDateFormat(memberData?.packageMember?.dttmGenerate) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <p class="mr-1 font-weight-bold">Дата отправки писем:</p>
              </v-col>
              <v-col cols="12" md="6">
                {{ shortDateFormat(memberData?.packageMember?.dttmSendEmail) }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <br />
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- Các phần card thông tin khác -->
        <v-col cols="12" md="12">
          <v-card elevation="2" class="pa-2">
            <v-row>
              <v-col cols="12" md="2">
                <p class="mr-1 font-weight-bold">Организация:</p>
              </v-col>
              <v-col cols="12" md="3">
                {{ memberData?.packageMember?.memberShortname }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="2">
                <p class="mr-1 font-weight-bold">Описание:</p>
              </v-col>
              <v-col cols="12" md="10">
                {{ memberData?.packageMember?.itemName }}
              </v-col>
            </v-row>
            <!-- Các thông tin khác -->
            <v-row>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="6">
                    <p class="mr-1 font-weight-bold">Итого:</p>
                  </v-col>
                  <v-col cols="12" md="6">
                    {{ moneyFormat(memberData?.packageMember?.itemTotalSum) }} руб.
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <p class="mr-1 font-weight-bold">Период:</p>
                  </v-col>
                  <v-col cols="12" md="6">
                    {{ memberData?.packageMember?.itemPeriod }}
                  </v-col>
                </v-row>
              </v-col>
              <!-- Thông tin invoice -->
              <v-col cols="12" md="1">
                <p class="mr-1 font-weight-bold">Номер счета:</p>
              </v-col>
              <v-col cols="12" md="1">
                {{ memberData?.packageMember?.invoiceNumber }}
              </v-col>
              <v-col cols="12" md="1">
                <p class="mr-1 font-weight-bold">Дата счета:</p>
              </v-col>
              <v-col cols="12" md="2">
                {{ shortDateFormat(memberData?.packageMember?.invoiceDate) }}
              </v-col>
            </v-row>
            <v-row v-if="memberData?.packageMember?.agentDebt">
              <v-col cols="12" md="12">
                <div v-html="nextLine(moneyFormat(memberData?.packageMember?.agentDebt))"></div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- Documents -->
        <v-col cols="4" v-for="document in memberData?.packageMember.documents" :key="document.id">
          <v-card elevation="2" class="pa-2">
            <p class="card-title color-primary"></p>
            <div class="d-flex">
              <p :style="{ 'max-width': '240px' }" class="color-secondary"></p>
              <v-btn
                outlined
                icon
                class="ma-2"
                @click="onDownloadDocument(document.link, document, memberData?.packageMember)"
              >
                <v-icon icon="mdi-download-box-outline"></v-icon>
              </v-btn>
              <p class="mt-6 card-body-value">{{ document.title }}</p>
            </div>
          </v-card>
        </v-col>

        <!-- Emails -->
        <v-col cols="12" md="12">
          <v-card v-if="memberData?.packageMember.emails" elevation="2" class="pa-2">
            <v-row>
              <v-col cols="12" md="12">
                <v-table class="table pt-4">
                  <thead>
                    <tr>
                      <th style="width: 40%">Email</th>
                      <th style="width: 20%; text-align: center">Статус</th>
                      <th style="width: 20%; text-align: center">Успешно</th>
                      <th style="width: 20%; text-align: center">Обратная связь</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="email in memberData?.packageMember.emails" :key="email.id">
                      <td>{{ email?.email }}</td>
                      <td style="text-align: center">{{ email?.status?.title }}</td>
                      <td style="text-align: center">
                        <v-icon
                          v-if="email?.isSuccess"
                          size="large"
                          class="icon-color-success"
                          icon="mdi-check"
                        ></v-icon>
                      </td>
                      <td style="text-align: center">
                        <v-icon
                          v-if="email?.hasFeedbackSent"
                          size="large"
                          class="icon-color-success"
                          icon="mdi-check"
                        ></v-icon>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template #actions>
      <btn-secondary @click="closeModal"> Закрыть </btn-secondary>
    </template>
  </modal>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import Modal from "@/components/Modal.vue"
import { BtnSecondary } from "@/components/buttons/index.js"
import { moneyFormat, shortDateFormat } from "@/utils/format.js"

const props = defineProps({
  modelValue: Boolean,
  memberData: Object,
  loading: Boolean
})

const emit = defineEmits(["update:modelValue", "download-document"])

// Two-way binding cho v-model
const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value)
})

const closeModal = () => {
  isOpen.value = false
}

const onDownloadDocument = (link, document, member) => {
  console.log("Link value:", link, typeof link)
  console.log("Document:", document)
  console.log("Member:", member)

  emit("download-document", link, document, member)
}

const nextLine = text => {
  if (!text) return ""
  return text.replace(/\n/g, "<br>")
}
</script>
