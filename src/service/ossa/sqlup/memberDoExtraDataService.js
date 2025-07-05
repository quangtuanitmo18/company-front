import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const memberDoExtraData = async (id, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/member-do-extra-data/extra-data/${id}`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}