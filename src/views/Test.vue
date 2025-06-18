<template>
  <div>
    <input
        ref="input"
        type="file"
        name="image"
        accept="image/*"
        @change="setImage"
    />
    <modal width="600px" v-model="isShowModal" title="Выберите фото профиля" @update:model-value="handleClearInput">
      <template #content>
        <vue-cropper
            ref="cropper"
            :aspect-ratio="1 / 1"
            :src="imgSrc"
            preview=".preview"
        />
      </template>
      <template #actions>
        <btn-secondary @click="handleClearInput">
          Закрыть
        </btn-secondary>
        <btn-primary @click="handleSubmit">
          Подтвердить
        </btn-primary>
      </template>
    </modal>
  </div>
</template>

<script setup>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import {ref, watch} from "vue";
import Modal from "@/components/Modal.vue";
import {BtnPrimary, BtnSecondary} from "@/components/buttons/index.js";

const isShowModal = ref(false)
const imgSrc = ref("")
const cropper = ref(null)
const input = ref(null)

const handleClearInput = () => {
  isShowModal.value = false
  input.value.value = null;
}

const setImage = (e) => {
  isShowModal.value = true

  const file = e.target.files[0];

  if (file.type.indexOf('image/') === -1) {
    alert('Please select an image file');
    return;
  }

  if (typeof FileReader === 'function') {
    const reader = new FileReader();

    reader.onload = (event) => {
      imgSrc.value = event.target.result;
    };

    reader.readAsDataURL(file);

    console.log("cropper.value", cropper.value)
  } else {
    alert('Sorry, FileReader API not supported');
  }
}

const handleSubmit = () => {
  const data = cropper.value.getCroppedCanvas().toDataURL()
  console.log("data", data)
}

watch(imgSrc, (newValue) => {
  if (cropper.value) {
    // Reset cropper instance when imgSrc changes
    cropper.value.replace(newValue);
  }
});

</script>