import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const pushList = async () => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: "/api/user/pushes"
        })

        return res
    }catch (err){
        throw err
    }
}