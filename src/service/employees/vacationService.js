import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const vacationEdit = async (id, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "patch",
            url: `/api/vacation/${id}/edit`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}
export const vacationDelete = async (id) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "delete",
            url: `/api/vacation/${id}/delete`,
        })
        return res
    }catch (err){
        throw err
    }
}
