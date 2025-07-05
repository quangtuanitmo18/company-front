<template>
  <div class="avatar">
    <div class="avatar-head">
      <img alt="Avatar" :src="uploadAvatar ? uploadAvatar : avatar ? avatar : defaultUser">
    </div>
    <template v-if="upload">
      <div class="avatar-layout">
        <input
            id="avatar-input"
            class="avatar-input"
            ref="input"
            type="file"
            name="avatar-input"
            accept="image/*"
            @change="setImage"
        />
        <v-btn variant="flat" @click="input.click()" style="text-transform: initial">{{ id ? "Изменить фото" : "Добавить фото"}}</v-btn>
      </div>
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
            Назад
          </btn-secondary>
          <btn-primary @click="handleAddPhoto">
            Подтвердить
          </btn-primary>
        </template>
      </modal>
      <modal v-model="dialogBlockConfirm" title="Подтверждение действия" text="После подтверждения старое фото удаляется. Вы действительно хотите продолжить?">
        <template #actions>
          <btn-secondary @click="dialogBlockConfirm = false">
            Отменить
          </btn-secondary>
          <btn-primary :loading="loading" @click="handleSubmit">
            Подтвердить
          </btn-primary>
        </template>
      </modal>
    </template>
  </div>
</template>
<script setup>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import defaultUser from "@/assets/images/user_default-avatar.jpg"
import {ref, watch} from "vue";
import {BtnPrimary, BtnSecondary} from "@/components/buttons/index.js";
import Modal from "@/components/Modal.vue";
import {employeeAddPhoto} from "@/service/employees/employeeService.js";

const {id} = defineProps(["avatar", "upload", "id"])
const model = defineModel()

const isShowModal = ref(false)
const dialogBlockConfirm = ref(false)
const imgSrc = ref("")
const cropper = ref(null)
const input = ref(null)
const uploadAvatar = ref("")
const loading = ref(false)

function base64SizeInBytes(base64) {
  // Убираем префикс (data:image/jpeg;base64,...)
  let base64String = base64.split(',')[1];
  // Подсчет реального размера (формула для base64)
  return Math.ceil((base64String.length * 3) / 4);
}

function compressBase64Image(base64, targetSizeBytes = 1024 * 1024) {
  const currentSize = base64SizeInBytes(base64);

  if (currentSize <= targetSizeBytes) {
    // Уже меньше 1 MB
    return Promise.resolve(base64);
  }

  // Функция для сжатия
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      let width = img.width;
      let height = img.height;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Будем сжимать в цикле, уменьшая качество
      let quality = 0.9;

      (function compressLoop() {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        const newSize = base64SizeInBytes(compressedBase64);

        if (newSize <= targetSizeBytes || quality <= 0.1) {
          resolve(compressedBase64);
        } else {
          quality -= 0.1;
          compressLoop();
        }
      })();
    };
    img.onerror = reject;
    img.src = base64;
  });
}

const handleAddPhoto = async () => {
  if (id) {
    dialogBlockConfirm.value = true
  } else {
    const data = cropper.value.getCroppedCanvas().toDataURL()
    try {
      const resultBase64 = await compressBase64Image(data)
      model.value = resultBase64
      uploadAvatar.value = resultBase64
    } catch (err) {
      console.error("Ошибка:", err)
    }
  }
}

const handleClearInput = () => {
  isShowModal.value = false
  input.value.value = null;
}

const handleSubmit = async () => {
  const data = cropper.value.getCroppedCanvas().toDataURL()

  loading.value = true
  try {
    const resultBase64 = await compressBase64Image(data)
    await employeeAddPhoto(id, {"photo": resultBase64})
    model.value = resultBase64
    uploadAvatar.value = resultBase64
  } catch (err) {
    console.error("Ошибка:", err)
  } finally {
    loading.value = false
    isShowModal.value = false
    dialogBlockConfirm.value = false
  }
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
  } else {
    alert('Sorry, FileReader API not supported');
  }
}


watch(imgSrc, (newValue) => {
  if (cropper.value) {
    // Reset cropper instance when imgSrc changes
    cropper.value.replace(newValue);
  }
});

watch(model, (newValue) => {
  uploadAvatar.value = newValue
})

</script>
<style scoped lang="scss">
.avatar {
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  &:hover .avatar-layout {
    opacity: 1;
  }
}

.avatar-head {
  max-width: 240px;
  display: flex;
}

.avatar-layout {
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.avatar-input {
  display: none;
}
</style>
