import { projectHTTPRequest } from "@/utils/httpRequest.js"

export const userList = async data => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/admin/users`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}
export const userDetail = async id => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/admin/user/${id}`
    })
    return res
  } catch (err) {
    throw err
  }
}
export const userUpdate = async (id, data) => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "patch",
      url: `/api/admin/user/${id}`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}
export const userCreate = async data => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "put",
      url: "/api/admin/user/add",
      data
    })

    return res
  } catch (err) {
    throw err
  }
}
export const userBlock = async id => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/admin/user/${id}/block/1`
    })
    return res
  } catch (err) {
    throw err
  }
}
export const userUnblock = async id => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/admin/user/${id}/block/0`
    })
    return res
  } catch (err) {
    throw err
  }
}

export const userChangePassword = async id => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "patch",
      url: `api/admin/user/${id}/change-password`
    })
    return res
  } catch (err) {
    throw err
  }
}

export const userRoleList = async data => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/admin/roles`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}
export const userRoleListForFilter = async data => {
  try {
    const { items } = await userRoleList(data)

    return items.map(item => ({
      value: item.id,
      title: item.title
    }))
  } catch (err) {
    throw err
  }
}

export const userRoleListByGroupForFilter = async data => {
  try {
    const { items } = await userRoleList({ row_page: 500, ...data })

    const objByGroup = {}
    const result = []

    items.forEach(item => {
      if (!objByGroup.hasOwnProperty(item.project.title)) {
        objByGroup[item.project.title] = []
      }
      objByGroup[item.project.title].push({
        value: item.id,
        title: item.title,
        project: item.project.title
      })
    })

    for (const [key, values] of Object.entries(objByGroup)) {
      result.push({ props: { header: key } })

      values.forEach(value => {
        result.push(value)
      })
    }
    return result
  } catch (err) {
    throw err
  }
}
export const userRoleDetail = async id => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/admin/role/${id}`
    })
    return res
  } catch (err) {
    throw err
  }
}
export const userRoleBlock = async id => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/admin/role/${id}/block/0`
    })
    return res
  } catch (err) {
    throw err
  }
}
export const userRoleUnblock = async id => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/admin/role/${id}/block/1`
    })
    return res
  } catch (err) {
    throw err
  }
}
export const userRoleCreate = async data => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "put",
      url: "/api/admin/role/add",
      data
    })

    return res
  } catch (err) {
    throw err
  }
}
export const userRoleUpdate = async (id, data) => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "patch",
      url: `/api/admin/role/${id}`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}
