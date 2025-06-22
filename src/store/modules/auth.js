import { userProfile } from "@/service/homeService.js"
import httpRequest from "@/utils/httpRequest.js"
import * as storage from "@/utils/storage"
import axios from "axios"

const state = {
  userToken: storage.load("user_token") || null,
  user: storage.load("user") || null,
  projectToken: storage.load("project_token") || null,
  projectUser: storage.load("project_user") || null,
  projectHref: storage.load("project_href") || null,
  availableRoutes: [],
}

const getters = {
  user(state) {
    return state.user
  },
  isOperator(state) {
    return state.projectUser?.roles.length === 1 && state.projectUser?.roles[0] === "ROLE_USER"
  },
  userRoles(state) {
    return state.projectUser?.roles || []
  },
  isAuthenticated(state) {
    return !!state.userToken
  },
  projectId(state) {
    return state.projectUser?.project
  },
  projectUserData(state) {
    return state.projectUser?.projectData
  },
  availableRoutes(state) {
    return state.availableRoutes
  },
}

const mutations = {
  setUser(state, payload) {
    state.user = payload
    storage.save("user", payload)
  },
  setUserToken(state, payload) {
    state.userToken = payload
    storage.save("user_token", payload)
  },
  setProjectUser(state, payload) {
    state.projectUser = payload
    storage.save("project_user", payload)
  },
  setProjectToken(state, payload) {
    state.projectToken = payload
    storage.save("project_token", payload)
  },
  setProjectHref(state, payload) {
    state.projectHref = payload
    storage.save("project_href", payload)
  },
  logout(state) {
    state.userToken = ""
    state.availableRoutes = []
    storage.remove("user_token")
    storage.remove("user")
  },
}

const actions = {
  async login({ commit }, payload) {
    try {
      const { token } = await httpRequest({
        method: "post",
        url: "/api/login",
        data: payload,
      })
      await commit("setUserToken", token)

      const { user } = await userProfile()
      await commit("setUser", user)

      return true
    } catch (err) {
      throw err
    }
  },
  async logout({ commit }) {
    try {
      const res = await httpRequest({
        method: "post",
        url: "/api/admin/user/logout",
      })
      if (res.success) {
        delete axios.defaults.headers["Authorization"]
        commit("logout")

        return true
      }
    } catch (err) {
      throw err
    }
  },
  async availableRoutes({ commit }) {
    try {
      // const { data: res } = await httpRequest({
      //     method: "post",
      //     url: "/api/user/user/routes"
      // })

      // Add access default router and test router
      // res.routes.push(
      //     "home",
      // )
      //
      // commit("setAvailableRoutes", res.routes)

      // return res.routes
      return []
    } catch (err) {
      throw err
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
