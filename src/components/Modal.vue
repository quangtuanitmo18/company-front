<template>
  <v-dialog
      v-model="model"
      width="auto"
  >
    <v-card :width="width || 500" min-height="188">
      <template #title>
        <div class="card-bg"></div>
        <div class="card-content" v-if="title">{{ title }}</div>
        <div class="card-content" v-else>
          <slot name="title"></slot>
        </div>
      </template>

      <v-card-text v-if="text" class="card-scroll">
        {{ text }}
      </v-card-text>
      <v-card-text v-else class="card-scroll">
        <slot name="content"></slot>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <slot name="actions"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
const model = defineModel()
defineProps(["text", "title", "width"])
</script>
<style lang="scss">
.v-dialog{
  .v-card-item{
    position: relative;
    background-color: rgb(var(--color-primary));
    color: white;
    border-radius: 4px 4px 0 0;

    .card-bg{
      position: absolute;
      inset: 0;
      background-position: center;
      background-size: cover;
      background-image: url("/src/assets/images/abstract.jpg");
      z-index: 1;
      filter: grayscale(1);
      opacity: 0.1;
    }

    .card-content{
      position: relative;
      z-index: 10;

    }
  }

  .v-card-text{
    border-top: 1px solid #d1d5db;
    border-bottom: 1px solid #d1d5db;
  }

  .v-overlay__content {
    .v-card{
      overflow: visible !important;

      .v-card-text{
        padding-top: 12px !important;
      }
    }
  }

  &.error{
    .v-card-item{
      background-color: var(--text-error);
    }
  }
}

.card-scroll{
  max-height: 85vh;
  overflow-y: auto;
}
</style>