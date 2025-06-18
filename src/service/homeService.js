import httpRequest from "@/utils/httpRequest.js";

export const getTokenProject = async (project) => {
    try{
        const res = await httpRequest({
            method: "post",
            url: `/api/auth/project/token/${project}`,
        })
        return res
    }catch (err){
        throw err
    }
}

export const accessibleProjectList = async () => {
    try{
        const res = await httpRequest({
            method: "post",
            url: `/api/auth/projects`,
        })
        return res
    }catch (err){
        throw err
    }
}
export const userProfile = async () => {
    try{
        const { data: res } = await httpRequest({
            method: "get",
            url: `/api/user/profile`,
        })
        return res
    }catch (err){
        throw err
    }
}
