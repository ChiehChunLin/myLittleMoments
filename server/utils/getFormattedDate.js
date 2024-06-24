const moment = require('moment')

function getUTCTime () {
  // 1718482477069
  return new Date().getTime()
}
function getFormattedDate () {
  // YYYY-MM-DD
  return new Date().toISOString().slice(0, 10)
}
function getSerialTimeFormat () {
  // YYYYMMDDHHmmss
  return Number(
    new Date().toLocaleString('af-ZA', { hour12: false }).replace(/-| |:|/g, '')
  )
}
function getLogTimeFormat () {
  // YYYY-MM-DD HH:mm:ss
  return new Date().toLocaleString('af-ZA', { hour12: false })
}
function getCalendarDate (date) {
  return moment(date).format('MMM Do YY')
}
function getWeekNumberByDate (date) {
  return moment(date, 'YYYY-MM-DD').week()
}
function getDateDifference (date) {
  const todays = getFormattedDate().split('-')
  const dates = date.split('-')
  const today = moment([todays[0], todays[1], todays[2]])
  const dateBirth = moment([dates[0], dates[1], dates[2]])
  const diffDuration = moment.duration(today.diff(dateBirth))
  return `${diffDuration.years()}Y-${diffDuration.months()}M-${diffDuration.days()}D old`
}
function getDateBefore30days () {
  return moment().subtract(30, 'd').format('YYYY-MM-DD')
}
module.exports = {
  getUTCTime,
  getFormattedDate,
  getSerialTimeFormat,
  getLogTimeFormat,
  getCalendarDate,
  getWeekNumberByDate,
  getDateDifference,
  getDateBefore30days
}
