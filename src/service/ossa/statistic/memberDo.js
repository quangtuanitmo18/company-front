import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const GraphicMemberDoMembers = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/statistic/member-do/members ",
            data
        })

        return res
    }catch (err){
        throw err
    }
}