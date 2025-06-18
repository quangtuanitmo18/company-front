import {projectHTTPRequest} from "@/utils/httpRequest.js";


export const callList = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/calls/all",
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const callListIncoming = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/calls/incoming",
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const callListOutgoing = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/calls/outgoing",
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const callDownload = async (id) => {
    try{
        const res = await projectHTTPRequest({
            method: "post",
            url: `/api/call/${id}/download/wav`,
            responseType: 'blob'
        })
        return res
    }catch (err){
        throw err
    }
}