const moment = require("moment");

function getUTCTime() {
  //1718482477069
  return new Date().getTime();
}
function getFormattedDate() {
  //YYYY-MM-DD
  return new Date().toISOString().slice(0, 10);
}
function getSerialTimeFormat() {
  //YYYYMMDDHHmmss
  return Number(
    new Date().toLocaleString("af-ZA", { hour12: false }).replace(/-| |:|/g, "")
  );
}
function getLogTimeFormat() {
  //YYYY-MM-DD HH:mm:ss
  return new Date().toLocaleString("af-ZA", { hour12: false });
}
function getCalendarDate(date) {
  return moment(date).format("MMM Do YY");
}
function getWeekNumberByDate(date) {
  return moment(date, "YYYY-MM-DD").week();
}
function getDateDifference(date1, date2) {
  const diff = moment.preciseDiff(date1, date2, true);
  return `${diff.years}Y-${diff.monthd}M-${diff.days}D old`;
}
module.exports = {
  getUTCTime,
  getFormattedDate,
  getSerialTimeFormat,
  getLogTimeFormat,
  getCalendarDate,
  getWeekNumberByDate,
  getDateDifference
};
