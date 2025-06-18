import {projectHTTPRequest} from "@/utils/httpRequest.js";
import {projectList} from "@/service/auth/users/projectService.js";

export const employeeDictionary = async (code, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/dictionary/${code}/list`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const employeeDictionaryEdit = async (code, id, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "patch",
            url: `/api/dictionary/${code}/${id}/edit`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const employeeDictionaryAdd = async (code, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "put",
            url: `/api/dictionary/${code}/add`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const employeeDictionaryDelete = async (code, id) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "delete",
            url: `/api/dictionary/${code}/${id}/delete`,
        })
        return res
    }catch (err){
        throw err
    }
}

export const employeeDictionarySearchPost = async (searchString) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/dictionary/posts/search`,
            data: {
                title: searchString
            }
        })
        return res.posts
    }catch (err){
        throw err
    }
}

export const employeeDepartmentForFilter = async () => {
    try{
        const { items } = await employeeDictionary('department')

        return items.map((item) => ({
            value: item.id,
            title: item.title
        }))
    }catch (err){
        throw err
    }
}

export const employeePostForFilter = async () => {
    try{
        const { items } = await employeeDictionary('post')

        return items.map((item) => ({
            value: item.id,
            title: item.title
        }))
    }catch (err){
        throw err
    }
}