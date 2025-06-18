import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const workPlanList = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/work-plan",
            data
        })
        return res
    }catch (err){
        throw err
    }
}