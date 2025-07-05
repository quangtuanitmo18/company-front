export const printErrors = (validationErrors) => {
    const errorArray = []
    for (const key in validationErrors){
        if(typeof validationErrors[key] === "string"){
            errorArray.push(validationErrors[key])
        }else if(key === "actions" || key === "checks" || key === "insurances"){
            for(const subKey in validationErrors[key]["errors"]){
                errorArray.push(...printErrors(validationErrors[key]["errors"][subKey].errors))
            }
        }else if(validationErrors[key].length){
            validationErrors[key][0].label
                ? errorArray.push(`${validationErrors[key][0].label}: ${validationErrors[key][0].message}`)
                : errorArray.push(`${validationErrors[key][0]}`)
        }else{
            errorArray.push(`${validationErrors[key].label}: ${validationErrors[key].errors[0]}`)
        }
    }

    return errorArray
}

export const printErrorsFileUpload = (validationErrors) => {
    const errorArray = []
    for (const key in validationErrors){

        for (const subKey in validationErrors[key]){
            errorArray.push(`${key} - ${validationErrors[key][subKey][0]}`)
        }
    }

    return errorArray
}