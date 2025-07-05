export function shortDateFormat(date) {
  if (!date) return null

  // Convert "2020-01-24" or "2020-01-24 00:00:00" to "24.01.2020"
  return date.split(" ")[0].split("-").reverse().join(".")
}

export function shortDateHourFormat(date) {
  if (!date) return null

  const [firstPart, lastPart] = date.split(" ")
  const lastPartWithoutSeconds =
    lastPart.length === 8 ? lastPart.substring(0, lastPart.lastIndexOf(":")) : lastPart

  // Convert "2020-01-24 12:00:00" to "24.01.2020 12:00:00"
  return shortDateFormat(firstPart) + " " + lastPartWithoutSeconds
}

export function dateFormatBack(date) {
  if (!date) return null

  // Convert "24.01.2020" to "2020-01-24"
  return date.split(".").reverse().join("-")
}

export function dateHourFormatBack(date) {
  if (!date) return null

  const [firstPart, lastPart] = date.split(" ")

  // Convert "24.01.2020 12:00:00" to "2020-01-24 12:00:00"
  return firstPart.split(".").reverse().join("-") + " " + lastPart
}

export function dateToISOString(timestamp) {
  if (!timestamp) return null
  const date = new Date(timestamp)

  // Convert "1579219200000" to "2020-01-17"
  return date.toISOString().split("T")[0]
}

export function dateToStringHour(newDate) {
  if (!newDate) return null

  // Convert to Date object
  let date = new Date(newDate)

  // Extract components
  let year = date.getFullYear()
  let month = String(date.getMonth() + 1).padStart(2, "0") // Months are zero-based
  let day = String(date.getDate()).padStart(2, "0")
  let hours = String(date.getHours()).padStart(2, "0")
  let minutes = String(date.getMinutes()).padStart(2, "0")

  // Sat May 18 2024 10:20:00 GTM+0300 or 1579219200000 to "2024-18-05 10:20"
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
export function getDateThreeMonthsAgo(dateString) {
  if (!dateString) return null
  // Создаем объект Date из строки даты
  let date = new Date(dateString)

  // Получаем текущий месяц
  let currentMonth = date.getMonth()

  // Вычисляем новый месяц
  let newMonth = currentMonth - 3

  // Если новый месяц < 0, то переходим на предыдущий год
  if (newMonth < 0) {
    date.setFullYear(date.getFullYear() - 1)
    newMonth += 12
  }

  // Устанавливаем новый месяц
  date.setMonth(newMonth)

  // Возвращаем новую дату в формате "YYYY-MM-DD"
  let year = date.getFullYear()
  let month = ("0" + (date.getMonth() + 1)).slice(-2) // Месяцы в JavaScript начинаются с 0
  let day = ("0" + date.getDate()).slice(-2)

  return `${year}-${month}-${day}`
}

export const getDateNow = () => {
  const now = new Date()

  // 2024-09-23
  return now.toISOString().split("T")[0]
}

export const getFirstAndLastDayOfMonth = dateString => {
  // date: 2024-09-23
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = date.getMonth()

  const firstDay = new Date(year, month, 1)
  const firstDayFormatted = `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(firstDay.getDate()).padStart(2, "0")}`

  const lastDay = new Date(year, month + 1, 0)
  const lastDayFormatted = `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(lastDay.getDate()).padStart(2, "0")}`

  // startDate: 2024-09-01 and endDate: 2024-09-30
  return {
    startDate: firstDayFormatted,
    endDate: lastDayFormatted
  }
}

export const getDateFromRange = range => {
  const [startDate, endDate] = range
  const startDateFormated = shortDateFormat(startDate)
  const endDateFormated = shortDateFormat(endDate)

  // ['2024-04-20','2024-04-28'] to '20.04.2024 - 28.04.2024'
  return `${startDateFormated} - ${endDateFormated}`
}

export const highlightedText = (value, search) => {
  if (!value) return

  const regex = new RegExp(search, "gi")

  return value.replace(regex, match => {
    return `<b style="color: var(--text-highlight); font-size: 15px">${match}</b>`
  })
}

export function transcript(code, dictionary) {
  if (!code) return null

  if (!dictionary.length) return null

  return dictionary.find(dict => dict.value === code)?.title
}

export function moneyFormat(value) {
  if (!value) return null

  const parts = value.toString().split(".")
  const integerPart = parts[0]
  const fractionalPart = parts.length > 1 ? "." + parts[1] : ""
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return formattedInteger + fractionalPart
}

// Convert hex color to named color (name color defined in file dictionary)
export const mapHexToNamedColor = hexColor => {
  // Default color if no match
  if (!hexColor) return "blue"

  // Strip the # if present
  const hex = hexColor.toLowerCase().startsWith("#")
    ? hexColor.slice(1).toLowerCase()
    : hexColor.toLowerCase()

  // Direct mapping for your specific colors
  const colorMap = {
    f9d71c: "yellow", // #f9d71c - Yellow -
    f91c45: "red", // #f91c45 - Red -
    "1cf9b0": "teal", // #1cf9b0 - Teal -
    "1c7df9": "blue", // #1c7df9 - Blue -
    f9a11c: "orange", // #f9a11c - Orange -
    b11cf9: "purple", // #b11cf9 - Purple -
    "4b5563": "gray", // #4b5563 - Gray
    "4b0082": "indigo", // #4b0082 - indigo
    "30f91c": "green", // #30f91c - Green,
    ec4899: "pink" // #ec4899 - Pink
  }

  return colorMap[hex] || "blue" // Return mapped color or default blue
}
