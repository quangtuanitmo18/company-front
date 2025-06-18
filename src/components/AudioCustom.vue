<template>
  <div class="audio-card" ref="playerRef" :class="{hide: !isShow}" draggable="true" @dragstart="onDragStart" @dragend="onDragEnd" :style="{bottom: `${position.bottom}px`, right: `${position.right}px`}">
    <v-card elevation="16" style="text-align: center">
      <v-card-text>
        <div class="d-flex justify-center">
          <v-btn v-if="!isPlaying" outlined icon class="ma-2" @click="play()" :disabled="!loaded">
            <v-icon icon="mdi-play"></v-icon>
          </v-btn>
          <v-btn v-else outlined icon class="ma-2" @click="pause()" :disabled="!loaded">
            <v-icon icon="mdi-pause"></v-icon>
          </v-btn>
          <div class="position-relative volume-wrp" :class="{active: loaded}">
            <v-btn outlined icon class="ma-2" @click="mute()" :disabled="!loaded">
              <v-icon v-if="!isMuted" icon="mdi-volume-high"></v-icon>
              <v-icon v-else icon="mdi-volume-mute"></v-icon>
            </v-btn>
            <div class="volume-bg"></div>
            <div class="volume-slider"><v-slider hide-details class="volume-slider-input" v-model="playerVolume" max="1" step="0.01" min="0"></v-slider></div>
          </div>
        </div>
        <v-slider hide-details v-model="percentage" height="5" style="margin-top: 15px; margin-bottom: 15px;" @click="setPosition()" :disabled="!loaded"></v-slider>
        <p>{{ currentTime }} / {{ duration }}</p>
        <div class="speed-block">
          <v-select
            v-model="speed"
            :items="speedSelect"
            variant="plain"
            hide-details
            @update:modelValue="handleSpeedAudio"
          >

          </v-select>
        </div>
      </v-card-text>
      <audio @timeupdate="_handlePlayingUI" @loadeddata="_handleLoaded" @ended="_handleEnded" id="audioRef" ref="audioRef" :src="file"></audio>
    </v-card>
    <v-btn @click="_handleClose" variant="text" class="audio-card-close" icon="mdi-close"></v-btn>
  </div>
</template>
<script setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";

const store = useStore()

const isShow = computed(() => store.getters["audio/isShow"])
const file = computed(() => store.getters["audio/currentFile"])
const isPlaying = computed(() => store.getters["audio/isPlaying"])
const position = computed(() => store.getters["audio/position"])

const formatTime = second => new Date(second * 1000).toISOString().substr(11, 8)

const audioRef = ref(null)
const playerRef = ref(null)

const dragOffset = ref({ x: 0, y: 0 })

const isMuted = ref(false)
const loaded = ref(false)
const playerVolume = ref(0.5)
const percentage = ref(0)
const currentTime = ref('00:00:00')
const totalDuration = ref(0)
const speed = ref(1)
const speedSelect = [
  {
    title: "1x",
    value: 1
  },
  {
    title: "1.5x",
    value: 1.5
  },
  {
    title: "2x",
    value: 2
  },
]

function onDragStart(e) {
  const rect = playerRef.value.getBoundingClientRect()
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

function onDragEnd(e) {
  const newX = e.clientX - dragOffset.value.x
  const newY = e.clientY - dragOffset.value.y

  let right = window.innerWidth - (newX + playerRef.value.offsetWidth)
  let bottom = window.innerHeight - (newY + playerRef.value.offsetHeight)

  if(right > window.innerWidth - 535){
    right = window.innerWidth - 535
  }else if (right < 20){
    right = 20
  }

  if(bottom > window.innerHeight - 200){
    bottom = window.innerHeight - 200
  }else if (bottom < 20){
    bottom = 20
  }

  store.commit("audio/setPosition", {
    right,
    bottom
  })
}

const duration = computed(() => audioRef.value ? formatTime(totalDuration.value) : '')

const setPosition = () => {
  audioRef.value.currentTime = parseInt(audioRef.value.duration / 100 * percentage.value);
}

const play = () => {
  if (isPlaying.value) return
  audioRef.value.play().then(_ => store.commit("audio/setIsPlaying", true))
}

const pause = () => {
  store.commit("audio/setIsPlaying", false)
  audioRef.value.pause()
}

const mute = () => {
  isMuted.value = !isMuted.value
  audioRef.value.muted = isMuted.value
}

const handleSpeedAudio = (e) => {
  audioRef.value.playbackRate = e
}

const _handleLoaded = () => {
  if (audioRef.value.readyState >= 2) {
    if (audioRef.value.duration === Infinity) {
      audioRef.value.currentTime = 1e101;
      audioRef.value.ontimeupdate = () => {
        audioRef.value.ontimeupdate = () => {}
        audioRef.value.currentTime = 0
        totalDuration.value = parseInt(audioRef.value.duration)
        loaded.value = true;
      }
    } else {
      audioRef.value.playbackRate = speed.value
      totalDuration.value = parseInt(audioRef.value.duration)
      loaded.value = true
    }
  } else {
    throw new Error('Failed to load sound file')
  }
}

const _handlePlayingUI = (e) => {
  audioRef.value.volume = playerVolume.value
  percentage.value  = audioRef.value.currentTime / audioRef.value.duration * 100
  currentTime.value = formatTime(audioRef.value.currentTime)
}

const _handleEnded = () => {
  store.commit("audio/setIsPlaying", false)
}

const _handleClose = () => {
  pause()
  store.commit("audio/setIsShow", false)
}

watch([file, isShow], (newFile) => {
  store.commit("audio/setIsPlaying", false)
  audioRef.value.load()
  if(isShow.value){
    setTimeout(() => {
      play()
    }, 0 )
  }
})
</script>
<style scoped lang="scss">
.audio-card{
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 500px;
  transition: 0.3s ease-in-out;
  transform: translateX(0);
  opacity: 1;
  visibility: visible;
  z-index: 999;
  cursor: move;

  &.hide{
    opacity: 0;
    visibility: hidden;
    transform: translateX(100%);
  }

  &-close{
    position: absolute;
    right: 4px;
    top: 4px;
  }
}
.volume-bg{
  position: absolute;
  top: 0;
  bottom: 0;
  width: 120px;
  left: 100%;
  display: none;
}
.volume-slider{
  position: absolute;
  bottom: 0;
  left: 100%;
  transform: translateY(-50%);
  display: none;

  &-input{
    width: 100px;
  }
}
.volume-wrp.active:hover .volume-slider,
.volume-wrp.active:hover .volume-bg{
  display: block;
}
.speed-block{
  position: absolute;
  right: 20px;
  bottom: 12px;
}
.audio-card-drag{
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 50px);
  height: 28px;
  background-color: red;
  z-index: 1;
  cursor: move;
}
</style>