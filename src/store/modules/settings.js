import * as storage from "@/utils/storage.js";

const state = {
    rowPage: storage.load("settings_app")?.rowPage || 20,
    closeSidebar: storage.load("settings_app")?.closeSidebar || false,
    calendars: storage.load("settings_app")?.calendars || {}
}

const getters = {
    rowPage(state){
        return state.rowPage
    },
    closeSidebar(state){
        return state.closeSidebar
    },
    calendars(state){
        return state.calendars
    },
}

const mutations = {
    setRowPage(state, payload){
        state.rowPage = payload
        storage.save("settings_app", { ...storage.load("settings_app"), rowPage: payload })
    },
    setCloseSidebar(state, payload){
        state.closeSidebar = payload
        storage.save("settings_app", { ...storage.load("settings_app"), closeSidebar: payload })
    },
    setCalendars(state, payload){
        state.calendars = payload
        storage.save("settings_app", { ...storage.load("settings_app"), calendars: payload })
    },
}

const actions = {}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}