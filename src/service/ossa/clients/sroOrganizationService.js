import {projectHTTPRequest} from "@/utils/httpRequest.js";


export const sroOrgList = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/dictionary/sro/show",
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const sroOrgListForFilter = async (data) => {
    try{
        const { items } = await sroOrgList({row_page: 500, ...data})

        return items.map((item) => ({
            value: item.id,
            title: item?.shortName || "None",
        }))
    }catch (err){
        throw err
    }
}

export const sroOrgListMailer = async (data) => {

    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/dictionary/sro-type/show",
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const sroOrgListForFilterMailer = async (data) => {
    try{
        const { items } = await sroOrgListMailer({row_page: 500, ...data})

        return items.map((item) => ({
            value: item.id,
            title: item?.title || "None",
        }))
    }catch (err){
        throw err
    }
}