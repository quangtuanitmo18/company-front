import {projectHTTPRequest} from "@/utils/httpRequest.js";

// Список исходящих звонков
export const graphCircleOutgoing = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/statistic/common/graph/outgoing",
            data
        })

        return res
    }catch (err){
        throw err
    }
}

// Список звонков
export const graphCircleCalls = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/statistic/common/graph/calls",
            data
        })

        return res
    }catch (err){
        throw err
    }
}
