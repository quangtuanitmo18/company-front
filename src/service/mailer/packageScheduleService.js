import { projectHTTPRequest } from "@/utils/httpRequest.js"

export const tasksSro = async (id, data) => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/package/schedule/sro/${id}`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}

export const taskDetail = async (id, data) => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/package/schedule/${id}`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}

export const taskAdd = async data => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "put",
      url: `/api/package/schedule/add`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}

export const taskEdit = async (id, data) => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "patch",
      url: `/api/package/schedule/${id}`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}

export const taskDelete = async id => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "delete",
      url: `/api/package/schedule/${id}`
    })
    return res
  } catch (err) {
    throw err
  }
}

export const tasksCalendar = async data => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/package/schedule/calendar`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}

export const scheduleFrequencyDictionary = async data => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/dictionary/schedule-frequency/show`,
      data
    })

    return res
  } catch (err) {
    throw err
  }
}

export const scheduleFrequencyDictionaryFilterMailer = async data => {
  try {
    const { items } = await scheduleFrequencyDictionary({ row_page: 500, ...data })

    return items.map(item => ({
      value: item.key,
      title: item?.title || "None"
    }))
  } catch (err) {
    throw err
  }
}
export const thressNerearestTasks = async data => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/package/schedule/next-starts`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}
