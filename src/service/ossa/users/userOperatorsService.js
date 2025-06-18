import {projectHTTPRequest} from "@/utils/httpRequest.js";


export const operatorList = async () => {
    try{
        const { data: res } = await projectHTTPRequest({
            method: "post",
            url: `/api/user/operators`,
        })

        return res
    }catch (err){
        throw err
    }
}

export const operatorListForFilter = async (data) => {
    try{
        const { items } = await operatorList({row_page: 500, ...data})

        const objByGroup = {}
        const result = []

        items.forEach((item) => {
            if(!objByGroup.hasOwnProperty(item.department.title)){
                objByGroup[item.department.title] = []
            }

            objByGroup[item.department.title].push({value: item.id, title: item.landlineNumber ? item.landlineNumber : item.mobileNumber, subtitle: item.fio})
        })

        for(const [key, values] of Object.entries(objByGroup)){
            result.push({ props: { header: key } })

            values.forEach((value) => {
                result.push(value)
            })
        }

        return result
    }catch (err){
        throw err
    }
}