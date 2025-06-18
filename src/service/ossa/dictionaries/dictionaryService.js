import {projectHTTPRequest} from "@/utils/httpRequest.js";


export const dictionaryList = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/list/dictionaries",
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const dictionaryOperatorDepartmentsList = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/dictionary/operator-departments/show",
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const dictionaryContactTypeList = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/dictionary/contact-type/show",
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const dictionaryMemberDoStatusList = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/dictionary/member-do-status/show",
            data
        })
        return res
    }catch (err){
        throw err
    }
}


export const dictionaryMemberDoStatusListForFilter = async (data) => {
    try{
        const { items } = await dictionaryMemberDoStatusList(data)

        return items.map((item) => ({
            value: item.id,
            title: item.title,
        }))
    }catch (err){
        throw err
    }
}