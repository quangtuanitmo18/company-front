import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const memberDoContractList = async (id) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/member-do-contract/list/${id}`,
        })
        return res
    }catch (err){
        throw err
    }
}