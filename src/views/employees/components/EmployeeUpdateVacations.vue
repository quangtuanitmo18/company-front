<template>
  <div class="mt-4 ml-2">
    <div class="d-flex mb-4">
      <v-btn class="ml-auto" prepend-icon="mdi-plus" color="primary" variant="outlined" @click="showAdd">
        Отпуск
      </v-btn>
    </div>
    <v-row v-if="vacations.length">
      <v-col cols="12" md="4" v-for="item in vacations">
        <p class="text-center text-h6 mb-2">{{item.year}} год </p>
        <div v-for="vacation in item.vacations" class="d-flex ga-2 justify-center align-center mb-2">
          <p style="font-size: 16px" :class="{'text-highlight': !isValidDate(vacation.vacation)}">{{shortDateFormat(vacation.vacation.startDate)}} - {{shortDateFormat(vacation.vacation.endDate)}}</p>
          <v-btn @click="showEdit(vacation)" v-if="isValidDate(vacation.vacation)" size="x-small" icon="mdi-pencil" class="color-primary"></v-btn>
          <v-btn @click="showDelete(vacation)" size="x-small" icon="mdi-delete" class="color-primary"></v-btn>
        </div>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12" md="4" v-for="item in vacations">
        <p style="font-size: 16px" class="text-center text-highlight" v-if="item.used">Количество использованных: {{ item.used }}</p>
        <p class="text-center text-success" v-if="item.scheduled">Количество запланированных: {{ item.scheduled }}</p>
      </v-col>
    </v-row>
    <template v-else>
      <p class="text-center">Нет данных об отпусках</p>
    </template>
    <modal width="460px" :eager="true" v-model="isShowModal" :title="isCreateVacation ? 'Добавление отпуска' : 'Редактирование отпуска'">
      <template #content>
        <v-form>
          <v-row>
            <v-col cols="12">
              <date-picker
                  :range="true"
                  :teleport="true"
                  v-model="currentVacation.range"
                  label="Период отпуска"
                  :hide-details="true"
              ></date-picker>
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template #actions>
        <btn-secondary @click="() => isShowModal = false">
          Закрыть
        </btn-secondary>
        <btn-primary :loading="isLoading" @click="handleSubmit">
          {{ isCreateVacation ? "Добавить" : "Применить" }}
        </btn-primary>
      </template>
    </modal>
    <modal v-model="isShowModalDelete" title="Подтверждение действия" text="Это действие невозможно отменить, вы хотите продолжить?">
      <template #actions>
        <btn-secondary @click="isShowModalDelete = false">
          Закрыть
        </btn-secondary>
        <btn-primary :loading="isLoading" @click="handleDelete">
          Подтвердить
        </btn-primary>
      </template>
    </modal>
    <div class="d-flex justify-end mt-4">
      <btn-secondary @click="handleBack">
        Назад
      </btn-secondary>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {employeeDetail, employeeVacationAdd, employeeVacationList} from "@/service/employees/employeeService.js";
import {useRoute, useRouter} from "vue-router";
import {getDateFromRange, shortDateFormat} from "@/utils/format.js";
import Modal from "@/components/Modal.vue";
import {DatePicker} from "@/components/index.js";
import {BtnPrimary, BtnSecondary} from "@/components/buttons/index.js";
import {vacationDelete, vacationEdit} from "@/service/employees/vacationService.js";

const route = useRoute()
const router = useRouter()

const vacations = ref({})
const isShowModal = ref(false)
const isShowModalDelete = ref(false)
const currentVacation = ref({})
const isCreateVacation = ref(false)
const isLoading = ref(false)

const handleSubmit = () => {
  const id = currentVacation.value.id
  const range = `[${currentVacation.value.range.join(",")}]`

  isLoading.value = true

  if(isCreateVacation.value){
    employeeVacationAdd(route.params.id, {
      vacation: range
    }).then((res) => {
      vacations.value = addRangeVacations(res.vacations)
      isShowModal.value = false
    }).finally(() => {
      isLoading.value = false
    })
  }else{
    vacationEdit(id, {
      vacation: range
    }).then((res) => {
      vacations.value = addRangeVacations(res.vacations)
      isShowModal.value = false
    }).finally(() => {
      isLoading.value = false
    })
  }
}

const handleDelete = () => {
  isLoading.value = true

  vacationDelete(currentVacation.value.id).then((res) => {
    vacations.value = addRangeVacations(res.vacations)
    isShowModalDelete.value = false
  }).finally(() => {
    isLoading.value = false
  })
}

const showDelete = (vacation) => {
  isShowModalDelete.value = true
  currentVacation.value = JSON.parse(JSON.stringify(vacation))
}

const showEdit = (vacation) => {
  isCreateVacation.value = false
  isShowModal.value = true
  currentVacation.value = JSON.parse(JSON.stringify(vacation))
}

const showAdd = () => {
  isCreateVacation.value = true
  isShowModal.value = true
  currentVacation.value = {}
}

const isValidDate = (vacation) => {
  const today = new Date();
  const startDate = new Date(vacation.startDate);
  const endDate = new Date(vacation.endDate);

  return today <= startDate || (today >= startDate && today <= endDate);
}

const vacationsByYears = (data) => {
  const groupedByYear = data.reduce((acc, item) => {
    const year = new Date(item.vacation.startDate).getFullYear().toString();
    const {endDate, startDate} = item.vacation
    item.range = [startDate, endDate]

    if (!acc[year]) {
      acc[year] = [];
    }

    acc[year].push(item);
    return acc;
  }, {});

  // Sort and take the last 3 years
  const result = Object.keys(groupedByYear)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .slice(0, 3)
      .reduce((acc, year) => {
        acc[year] = groupedByYear[year];
        return acc;
      }, {});

  // Sort vacation in year
  for (const year in result) {
    result[year].sort((a, b) => new Date(b.vacation.startDate) - new Date(a.vacation.startDate));
  }

  return result
}

const addRangeVacations = (vacations) => {
  vacations.forEach(yearEntry => {
    yearEntry.vacations.forEach(vacationEntry => {
      const { startDate, endDate } = vacationEntry.vacation;
      vacationEntry.range = [startDate, endDate];
    });
  });

  return vacations;
}

const handleBack = () => {
  router.go(-1)
}

onMounted(() => {
  employeeVacationList(route.params.id).then(res => {
    vacations.value = addRangeVacations(res.vacations)
  })
})
</script>