<template>
  <div v-for="sro in sroList" :key="sro.id">
    <v-expansion-panels class="pt-4" v-model="panel[sro.id]">
      <v-expansion-panel>
        <v-expansion-panel-title class="panel-header">
          <template v-slot:default="{ expanded }">
            <h4 class="panel-section-header">
              <v-icon icon="mdi-menu-down"></v-icon>
              <span class="panel-section-header-text">{{ sro.title }}</span>
            </h4>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="12">
              <v-btn class="pull-right icon-color-primary" @click="createSchedule(sro.id)" size="small" icon="mdi-plus" title="Добавить"></v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-table v-if="sroSchedule[sro.id]" class="table">
                <thead>
                  <tr>
                    <th>SRO</th>
                    <th>Type</th>
                    <th>Frequency</th>
                    <th>Last Execute</th>
                    <th>From</th>
                    <th>Until</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="link-row" v-for="row in sroSchedule[sro.id].items" @click="handleDetailsTo(row)">
                    <td>{{ row.sroOrganization.title }}</td>
                    <td>{{ row.package_type.package_type_name }}</td>
                    <td>{{ row.schedule_frequency_type.schedule_frequency_type_name }}</td>
                    <td>{{ shortDateHourFormat(row.dttmLastExecuted) }}</td>
                    <td>{{ shortDateHourFormat(row.scheduleFromDttm) }}</td>
                    <td>{{ shortDateHourFormat(row.scheduleUntilDttm) }}</td>
                    <td>{{ row.countLaunches }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup>
  import {ref, watch} from "vue";
  import {tasksSro} from "@/service/mailer/packageScheduleService.js";
  import {shortDateHourFormat} from "@/utils/format.js";
  import {useRouter} from "vue-router";

  const router = useRouter();
  const panel = ref({})
  const { sroList } = defineProps(["sroList"])
  const sroSchedule = ref({})
  const detailsTo = '/mailer/schedule/view/'
  const getSroSchedule = async (id) => {
    sroSchedule.value[id] = await tasksSro(id)
  }

  const handleRedirect = (name, params = {}) => {
    router.push({ name, params });
  }

  const createSchedule = (id) => handleRedirect("mailer-sro-schedule-add", { id })

  const handleDetailsTo = (item) => {
    if(!detailsTo) return

    router.push(detailsTo + item.id)
  }

  watch(
    () => sroList,
    (items) => {
      if (items && items.length > 0) {
        items.forEach(sro => {
          getSroSchedule(sro.id);
        });
      }
    },
    { immediate: true }
  );
</script>

<style scoped lang="scss">
  .link-row {
    cursor: pointer;
  }
</style>