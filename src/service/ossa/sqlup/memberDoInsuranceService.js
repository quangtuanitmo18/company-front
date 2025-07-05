import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const memberDoInsuranceList = async (id, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/member-do-insurance/list/${id}`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const memberDoInsuranceGetData = async (id) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/member-do-insurance/get-form-data/${id}`,
        })
        return res
    }catch (err){
        throw err
    }
}

export const memberDoInsuranceAdd = async (id, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "put",
            url: `/api/sqlup/member-do-insurance/add/${id}`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const memberDoInsuranceEdit = async (memberDo, insuranceId, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "patch",
            url: `/api/sqlup/member-do-insurance/edit/${memberDo}/${insuranceId}`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const memberDoInsuranceRemove = async (memberDo, insuranceId) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "delete",
            url: `/api/sqlup/member-do-insurance/remove/${memberDo}/${insuranceId}`,
        })
        return res
    }catch (err){
        throw err
    }
}