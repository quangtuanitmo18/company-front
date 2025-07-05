import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const memberDoReportList = async (id) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/member-do-report/list/${id}`,
        })
        return res
    }catch (err){
        throw err
    }
}