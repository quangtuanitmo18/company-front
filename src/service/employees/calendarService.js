import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const calendarList = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/calendar`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}