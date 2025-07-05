import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const memberDoRight = async (id) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/member-do-right/member-right/${id}`,
        })
        return res
    }catch (err){
        throw err
    }
}