
function DateConverter(inputDateString, hasTime) {
  console.log(hasTime);
  const months = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };

  if (!hasTime){
    const [, day, month, year, time] = inputDateString.match(/(\d{2}) (\w{3}) (\d{4}) (\d{2}:\d{2}:\d{2})/);
    const [hours, minutes, seconds] = time.split(':');

    return `${year}-${months[month]}-${day} ${hours}:${minutes}:${seconds}`;
  }
  return inputDateString.replace('T', ' ').replace(/\b(\d{1})\b/g, '0$1') + ':00';

}

export default DateConverter;