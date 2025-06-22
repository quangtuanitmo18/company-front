import { projectHTTPRequest } from "@/utils/httpRequest.js"

export const mailingStatusReport = async (id, data) => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/report/mailingStatus/package/${id}`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}

export const packageMemberDeliveryStatusReport = async (id, data) => {
  try {
    const { data: res } = await projectHTTPRequest({
      method: "post",
      url: `/api/report/packageMemberDelivery/package/${id}`,
      data
    })
    return res
  } catch (err) {
    throw err
  }
}
