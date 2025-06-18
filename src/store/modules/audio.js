import * as storage from "@/utils/storage.js";

const state = {
    isShow: false,
    isPlaying: false,
    currentFile: "",
    position: storage.load("settings_app")?.positionPlayer || {bottom: 20, right: 20}
}

const getters = {
    isShow(state){
        return state.isShow
    },
    isPlaying(state){
        return state.isPlaying
    },
    currentFile(state){
        return state.currentFile
    },
    position(state){
        return state.position
    }
}

const mutations = {
    setIsShow(state, payload){
        state.isShow = payload
    },
    setIsPlaying(state, payload){
        state.isPlaying = payload
    },
    setCurrentFile(state, payload){
        state.currentFile = payload
    },
    setPosition(state, payload){
        state.position = payload
        storage.save("settings_app", { ...storage.load("settings_app"), positionPlayer: payload })
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}