import axios from "axios"
import * as storage from "@/utils/storage"
import { ERROR_MESSAGE_500 } from "@/utils/dictionary.js"
import store from "@/store/index.js";
import router from "@/router/index.js";
import {getTokenProject} from "@/service/homeService.js";

const projectBaseRequest = axios.create({
    withCredentials: true
})


projectBaseRequest.interceptors.request.use(config => {
    const baseURL = storage.load("project_href");
    if (baseURL) {
        config.baseURL = baseURL;
    }else{
        window.location.href = "/";
    }


    const token = storage.load("project_token")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

projectBaseRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest= error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark token refresh attempted

            try {
                // Refresh token
                const { token } = await getTokenProject(store.getters["auth/projectId"])
                store.commit("auth/setProjectToken", token)

                return projectBaseRequest(originalRequest); // Resend request
            } catch (err) {
                console.error('Lỗi khi thử lại request:', err);
                return Promise.reject(err); // If it fails to refresh, return an error.
            }
        }

        return Promise.reject(error);
    }
)

export const projectHTTPRequest = async (options) => {
    try{
        let res = await projectBaseRequest(options)

        return res?.data
    }catch (err){
        console.log("Project HTTP request err", err)

        if(err.response?.data){
            if (err.response.data.data && Object.keys(err.response.data.data).length){
                throw err.response.data.data
            } else if (err.response.data.message) {
                throw err.response.data.message
            }

        }else if (err.message){
            throw err.message
        } else{
            throw ERROR_MESSAGE_500
        }
    }
}

const baseRequest = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URI,
    withCredentials: true
})

baseRequest.interceptors.request.use(config => {
    const token = storage.load("user_token")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

const httpRequest = async (options) => {
    try{
        const { data: res } = await baseRequest(options)

        return res
    }catch (err){
        console.log("HTTP request err", err)

        if(err.response?.status === 401){
            await store.commit("auth/logout")
            await router.push({name: "login"})
        }

        if(err.response?.data){
            if (err.response.data?.message){
                throw err.response.data.message
            }
        }else if (err.message){
            throw err.message
        } else{
            throw ERROR_MESSAGE_500
        }
    }
}

export default httpRequest
