import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const memberDoList = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/sqlup/member_do/list",
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const memberDoDetailShort = async (id) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/member_do/${id}/short`,
        })
        return res
    }catch (err){
        throw err
    }
}

export const memberDoDetailFull = async (id) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/member_do/${id}/full`,
        })
        return res
    }catch (err){
        throw err
    }
}