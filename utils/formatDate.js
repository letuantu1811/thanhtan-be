const format = require('date-fns/format')
const vi = require('date-fns/locale/vi')

const formatDate = (
  date,
  dateFormat = "dd-MM-yyyy"
) =>  {
  if(!date) return ''
  const formattedDate = format(new Date(date), dateFormat, { locale: vi });
  return formattedDate;
}

const getCurrentDate = () => {
  const currentDate = formatDate(new Date(), 'dd-MM-yyyy HH:mm:ss');
  return currentDate;
}

module.exports = {
  formatDate,
  getCurrentDate
}
