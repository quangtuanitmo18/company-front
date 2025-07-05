import { projectHTTPRequest } from "@/utils/httpRequest.js"

export const employeeList = async data => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/employees`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}

export const employeeDetail = async id => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/employee/${id}`
    })
    return res
  } catch (err) {
    throw err
  }
}

export const employeeAdd = async data => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "put",
      url: `/api/employee/add`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}

export const employeeEdit = async (id, data) => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "patch",
      url: `/api/employee/${id}/edit`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}

export const employeeDelete = async id => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "delete",
      url: `/api/employee/${id}/delete`
    })
    return res
  } catch (err) {
    throw err
  }
}

export const employeeVacationAdd = async (id, data) => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "put",
      url: `/api/employee/${id}/vacation/add`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}

export const employeeVacationList = async id => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/employee/${id}/vacations`
    })
    return res
  } catch (err) {
    throw err
  }
}

export const employeeAddPhoto = async (id, data) => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "put",
      url: `/api/employee/${id}/photo/add`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}
