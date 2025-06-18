export const FILTER_TYPE_EQ = 1 // Type input is select
export const FILTER_TYPE_EQ_CHECK = 2 // Type input is select but a check mark is displayed in table
export const FILTER_TYPE_EQ_MULTI = 3 // Type input is multi select
export const FILTER_TYPE_EQ_MULTI_WITH_SEARCH = 4 // Type input is multi select with search
export const FILTER_TYPE_LIKE = 5 // Type input is text
export const FILTER_TYPE_DATE = 6 // Type input is date
export const FILTER_TYPE_ACTION = 7 // No input, only actions
export const FILTER_TYPE_EQ_WITH_SEARCH = 8 // Type input is select with search
export const FILTER_TYPE_BETWEEN = 9 // Type input is range slider
export const FILTER_TYPE_DATE_TIME = 10 // Type input is date&time
export const FILTER_TYPE_EDITABLE = 11 // Type input is editable
export const FILTER_TYPE_EQ_BY_GROUP = 12 // Type input is multi select by group
export const FILTER_TYPE_MONEY = 13 // Type input is money format "12 000"

export const CALL_TYPES = [
  {
    value: "outgoing",
    title: "Исходящий",
  },
  {
    value: "incoming",
    title: "Входящий",
  },
]

export const DISPOSITION_TYPES = [
  {
    value: "ANSWERED",
    title: "Успешно",
    color: "#73A839",
  },
  {
    value: "NO ANSWER",
    title: "Нет ответа",
    color: "#ff9005",
  },
  {
    value: "FAILED",
    title: "Ошибка",
    color: "#d85610",
  },
  {
    value: "BUSY",
    title: "Занято",
    color: "#d8101c",
  },
]

export const DISPOSITION_TYPES_OUTGOING = [
  {
    value: "ANSWERED",
    title: "Успешно",
    color: "#73A839",
    icon: "mdi-phone-outgoing",
  },
  {
    value: "NO ANSWER",
    title: "Нет ответа",
    color: "#ff9005",
    icon: "mdi-phone-outgoing",
  },
  {
    value: "FAILED",
    title: "Ошибка",
    color: "#d85610",
    icon: "mdi-phone-outgoing",
  },
  {
    value: "BUSY",
    title: "Занято",
    color: "#d8101c",
    icon: "mdi-phone-outgoing",
  },
]

export const DISPOSITION_TYPES_INCOMING = [
  {
    value: "ANSWERED",
    title: "Успешно",
    color: "#73A839",
    icon: "mdi-phone-incoming",
  },
  {
    value: "NO ANSWER",
    title: "Нет ответа",
    color: "#ff9005",
    icon: "mdi-phone-incoming",
  },
  {
    value: "FAILED",
    title: "Ошибка",
    color: "#d85610",
    icon: "mdi-phone-incoming",
  },
  {
    value: "BUSY",
    title: "Занято",
    color: "#d8101c",
    icon: "mdi-phone-incoming",
  },
]

export const GRAPHIC_COLORS_CALL_INCOMING = [
  {
    value: "answered",
    color: "#24ab24",
  },
  {
    value: "noAnswer",
    color: "#ff9005",
  },
  {
    value: "incomingMobile",
    color: "#7091E6",
  },
  {
    value: "incomingLandline",
    color: "#3D52A0",
  },
]

export const GRAPHIC_COLORS_CALL_OUTGOING = [
  {
    value: "answered",
    color: "#24ab24",
  },
  {
    value: "noAnswer",
    color: "#ff9005",
  },
  {
    value: "busy",
    color: "#d8101c",
  },
  {
    value: "error",
    color: "#d85610",
  },
  {
    value: "outgoingMobile",
    color: "#7091E6",
  },
  {
    value: "outgoingLandline",
    color: "#3D52A0",
  },
]

export const DO_RING_STATUS = [
  {
    value: 4,
    title: "Входящий звонок",
    color: "#1f1f9d",
    icon: "mdi-phone-incoming",
  },
  {
    value: 2,
    title: "Недозвон",
    color: "#d8101c",
    icon: "mdi-phone-remove",
  },
  {
    value: 3,
    title: "Просили перезвонить",
    color: "#ff9005",
    icon: "mdi-phone-alert",
  },
  {
    value: 1,
    title: "Успешный звонок",
    color: "#73A839",
    icon: "mdi-phone-check",
  },
]

export const TYPE_PHONE = 1
export const TYPE_MAIL = 2
export const TYPE_SITE = 3
export const TYPE_FAX = 4
export const TYPE_POST = 20

export const CONTACT_TYPES = [
  {
    value: TYPE_PHONE,
    title: "Телефон",
  },
  {
    value: TYPE_MAIL,
    title: "E-mail",
  },
  {
    value: TYPE_SITE,
    title: "Сайт",
  },
  {
    value: TYPE_FAX,
    title: "Факс",
  },
  {
    value: TYPE_POST,
    title: "Почтовый адрес",
  },
]

export const EXCHANGE_TYPES = [
  {
    value: "landline",
    title: "Стационарный",
  },
  {
    value: "mobile",
    title: "Мобильный",
  },
]

const USER_ENABLED = {
  value: true,
  title: "Активен",
  color: "#73A839",
  icon: "mdi-check-circle",
}
const USER_DISABLED = {
  value: false,
  title: "Неактивен",
  color: "#d8101c",
  icon: "mdi-close-circle",
}

export const FILTER_USER_STATUS = [USER_ENABLED, USER_DISABLED]

/* ----- Сообщения от сервера ----- */
export const ERROR_MESSAGE_500 = "Непредвиденная ошибка сервера. Попробуйте позднее."
/* --------------------- */

const IS_OPERATOR = {
  value: 1,
  title: "Да",
}
const IS_NOT_OPERATOR = {
  value: 0,
  title: "Нет",
}

export const OPERATOR_STATUS = [IS_OPERATOR, IS_NOT_OPERATOR]

const CLIENT_DEPARTMENT = {
  value: 1,
  title: "Клиентский отдел",
}
const ADMISSIONS_DEPARTMENT = {
  value: 2,
  title: "Приемный отдел",
}

const CONTROL_DEPARTMENT = {
  value: 3,
  title: "Контрольный отдел",
}

export const DEPARTMENTS_LIST = [CLIENT_DEPARTMENT, ADMISSIONS_DEPARTMENT, CONTROL_DEPARTMENT]

export const COLOR_SCHEME_CALENDAR = [
  {
    main: "#f9d71c",
    container: "#fff5aa",
    onContainer: "#594800",
  },
  {
    main: "#f91c45",
    container: "#ffd2dc",
    onContainer: "#59000d",
  },
  {
    main: "#1cf9b0",
    container: "#dafff0",
    onContainer: "#004d3d",
  },
  {
    main: "#1c7df9",
    container: "#d2e7ff",
    onContainer: "#002859",
  },
  {
    main: "#f9a11c",
    container: "#ffedda",
    onContainer: "#4d2e00",
  },
  {
    main: "#b11cf9",
    container: "#f7daff",
    onContainer: "#3d004d",
  },
  {
    main: "#1ce8f9",
    container: "#dafffe",
    onContainer: "#004d4c",
  },
  {
    main: "#d4f91c",
    container: "#e9ffd2",
    onContainer: "#305900",
  },
  {
    main: "#30f91c",
    container: "#d2ffd4",
    onContainer: "#005910",
  },
]

export const DICTIONARY_STATUS = [
  {
    value: true,
    title: "Активен",
    color: "#73A839",
    icon: "mdi-check-circle",
  },
  {
    value: false,
    title: "Неактивен",
    icon: "mdi-close-circle",
    color: "#d8101c",
  },
]

export const WEEK_DAYS = [
  { title: "Понедельник", value: "MONDAY" },
  { title: "Вторник", value: "TUESDAY" },
  { title: "Среда", value: "WEDNESDAY" },
  { title: "Четверг", value: "THURSDAY" },
  { title: "Пятница", value: "FRIDAY" },
  { title: "Суббота", value: "SATURDAY" },
  { title: "Воскресенье", value: "SUNDAY" },
]
