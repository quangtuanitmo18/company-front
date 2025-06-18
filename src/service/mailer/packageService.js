import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const packageList = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/package/packages`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const packageDetails = async (id, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/package/package/${id}`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const membersInPackage = async (id, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/package/package/${id}/members`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const typeDictionaryPackage = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/dictionary/package-type/show`,
            data
        })

        return res
    }catch (err){
        throw err
    }
}

export const typePackageDictionaryFilterMailer = async (data) => {
    try{
        const { items } = await typeDictionaryPackage({row_page: 500, ...data})

        return items.map((item) => ({
            value: item.key,
            title: item?.title || "None",
        }))
    }catch (err){
        throw err
    }
}

export const statusDictionaryPackage = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/dictionary/package-status/show`,
            data
        })

        return res
    }catch (err){
        throw err
    }
}

export const memberStatusPackageDictionaryFilterMailer = async (data) => {
    try{
        const { items } = await memberStatusDictionaryPackage({row_page: 500, ...data})

        return items.map((item) => ({
            value: item.key,
            title: item?.title || "None",
        }))
    }catch (err){
        throw err
    }
}

export const memberStatusDictionaryPackage = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/dictionary/package-member-status/show`,
            data
        })

        return res
    }catch (err){
        throw err
    }
}

export const statusPackageDictionaryFilterMailer = async (data) => {
    try{
        const { items } = await statusDictionaryPackage({row_page: 500, ...data})

        return items.map((item) => ({
            value: item.key,
            title: item?.title || "None",
        }))
    }catch (err){
        throw err
    }
}

export const packageMemberDetails = async (id, data) => {
    try {
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/package/member/${id}`,
            data
        })
        return res
    } catch (err) {
        throw err
    }
}

export const archiveDownload = async (id) => {
    try{
        return await projectHTTPRequest({
            method: "post",
            url: `/api/package/member/${id}/files/download`,
            responseType: 'blob'
        })
    }catch (err){
        throw err
    }
}

export const linkDownload = async (link) => {
    try{
        return await projectHTTPRequest({
            method: "post",
            url: link,
            responseType: 'blob'
        })
    }catch (err){
        throw err
    }
}

export const packageAdd = async (sro, data) => {
    try {
        const { data: res } = await projectHTTPRequest({
            method: "put",
            url: `/api/package/package/${sro}/add`,
            data
        })
        return res
    } catch (err) {
        throw err
    }
}

export const packageGenerate = async (id) => {
    try {
        const { data: res } = await projectHTTPRequest({
            method: "patch",
            url: `/api/package/package/${id}/generate`
        })
        return res
    } catch (err) {
        throw err
    }
}

export const packageSend = async (id) => {
    try {
        const { data: res } = await projectHTTPRequest({
            method: "patch",
            url: `/api/package/package/${id}/send`
        })
        return res
    } catch (err) {
        throw err
    }
}