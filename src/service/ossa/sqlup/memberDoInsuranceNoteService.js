import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const memberDoInsuranceNoteList = async (id, insuranceId) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/member-do-insurance-note/list/${id}/${insuranceId}`,
        })
        return res
    }catch (err){
        throw err
    }
}

export const memberDoInsuranceNoteAdd = async (memberDo, insuranceId, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "put",
            url: `/api/sqlup/member-do-insurance-note/add/${memberDo}/${insuranceId}`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const memberDoInsuranceNoteEdit = async (memberDo, insuranceNoteId, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "patch",
            url: `/api/sqlup/member-do-insurance-note/edit/${memberDo}/${insuranceNoteId}`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const memberDoInsuranceNoteRemove = async (memberDo, insuranceNoteId) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "delete",
            url: `/api/sqlup/member-do-insurance-note/remove/${memberDo}/${insuranceNoteId}`,
        })
        return res
    }catch (err){
        throw err
    }
}