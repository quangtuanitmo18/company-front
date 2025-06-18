import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const GraphicEventDoMembers = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/statistic/event-do/members",
            data
        })

        return res
    }catch (err){
        throw err
    }
}

export const GraphicEventDoSro = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/statistic/event-do/sro",
            data
        })

        return res
    }catch (err){
        throw err
    }
}

export const GraphicEventSroRow = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/statistic/event-do/sro-row",
            data
        })

        return res
    }catch (err){
        throw err
    }
}
