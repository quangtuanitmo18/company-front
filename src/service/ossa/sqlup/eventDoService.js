import {projectHTTPRequest} from "@/utils/httpRequest.js";


export const eventDoRemarkThemes = async (sro) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/event_do/remark-themes-groups/${sro}`,
        })
        return res
    }catch (err){
        throw err
    }
}

export const eventDoRemarkThemesSelectByGorup = async (sro) => {
    try{
        const res = await eventDoRemarkThemes(sro)
        const result = []

        for (let i of res.items){
            if(i.remarkThemes.length){
                result.push({
                    props: {
                        header: i.title
                    }
                })

                for (let j of i.remarkThemes){
                    result.push({
                        value: j.id,
                        title: j.title
                    })
                }
            }
        }

        return result
    }catch (err){
        throw err
    }
}

export const eventDoAdd = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/event_do/add`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const eventDoEdit = async (id, data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/event_do/${id}/edit`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}

export const eventDoToday = async (data) => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/sqlup/event_do/list`,
            data
        })
        return res
    }catch (err){
        throw err
    }
}