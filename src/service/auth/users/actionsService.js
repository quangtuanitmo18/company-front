import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const actionsList = async (project) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/admin/actions/${project}`,
        })
        return res
    }catch (err){
        throw err
    }
}