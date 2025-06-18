import {projectHTTPRequest} from "@/utils/httpRequest.js";


export const graphCallByHour = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/statistic/hourly",
            data
        })

        return res
    }catch (err){
        throw err
    }
}


export const graphCallByOperators = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/statistic/operators",
            data
        })

        return res
    }catch (err){
        throw err
    }
}


export const graphCallBySro = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/statistic/sro",
            data
        })

        return res
    }catch (err){
        throw err
    }
}

export const graphCallHourlyByType = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/statistic/hourly-by-type",
            data
        })

        return res
    }catch (err){
        throw err
    }
}
