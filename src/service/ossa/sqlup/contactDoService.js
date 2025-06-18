import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const contactDoAdd = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/sqlup/contact_do/add",
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const contactDoEdit = async (id, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/contact_do/${id}/edit`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}