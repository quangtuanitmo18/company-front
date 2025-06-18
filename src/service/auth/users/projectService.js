import {projectHTTPRequest} from "@/utils/httpRequest.js";

export const projectList = async () => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/admin/projects`,
        })
        return res
    }catch (err){
        throw err
    }
}
export const projectListForFilter = async (data) => {
    try{
        const { items } = await projectList(data)

        return items.map((item) => ({
            value: item.id,
            title: item.title
        }))
    }catch (err){
        throw err
    }
}
export const projectDetail = async (code) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/admin/project/${code}`,
        })
        return res
    }catch (err){
        throw err
    }
}