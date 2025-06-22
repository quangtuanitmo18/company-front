import store from "@/store"

export const PERMISSIONS = {
  EMPLOYEE: {
    EDIT: "ROLE_EMPLOYEES_EDIT",
    SHOW: "ROLE_EMPLOYEES_SHOW",
    EDIT_DICTIONARY: "ROLE_EMPLOYEES_EDIT_DICTIONARY"
  },
  MAILER: {
    EDIT: "ROLE_MAILER_EDIT_DATA",
    SHOW: "ROLE_MAILER_SHOW_DATA"
  }
}

export const hasPermission = permission => {
  return store.getters["auth/userRoles"].includes(permission)
}
