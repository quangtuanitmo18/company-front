import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const memberDoCheckList = async (id, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/member-do-check/list/${id}`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}