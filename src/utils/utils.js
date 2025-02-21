import { SalaryDetails } from './enum';

export const getDateTimeToTime = (date) => {
  let dateArray = date.split(':');
  return `${dateArray[0]}.${dateArray[1]}`;
};

export const getTimeByCurrentDate = () => {
  const currentDate = new Date();
  return `${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(
    currentDate.getSeconds()
  ).padStart(2, '0')}`;
};

export const getCalculatedTime = (loginTime) => {
  const currentDate = new Date();

  let currentTime = loginTime.split(':');

  currentDate.setHours(currentDate.getHours() - currentTime[0]);
  currentDate.setMinutes(currentDate.getMinutes() - currentTime[1]);
  currentDate.setSeconds(currentDate.getSeconds() - currentTime[2]);

  const calculatedHours = currentDate.getHours();
  const calculatedMinutes = currentDate.getMinutes();
  const calculatedSecond = currentDate.getSeconds();

  return `${String(calculatedHours).padStart(2, '0')}:${String(calculatedMinutes).padStart(2, '0')}:${String(calculatedSecond).padStart(
    2,
    '0'
  )}`;
};

export const getShortDate = (date) => {
  let dateArray = date.split('-');
  let dayArray = dateArray[2].split(' ');
  return `${dateArray[1]}/${dayArray[0]}`;
};

export const getTotalHours = (hours) => {
  let hoursArray = hours.split(':');
  return `${hoursArray[0]}`;
};

export const getEmployeeAge = (dateOfBirth) => {
  let dobArray = dateOfBirth.split('-');
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentAge = currentYear - dobArray[0];
  return `${currentAge} Years`;
};

export const getDayNameByDate = (date) => {
  let dateValue = new Date(date);
  return dateValue.toLocaleString('en-us', { weekday: 'long' });
};

export const getYearMonthNameByDate = (date, separator) => {
  let newDate = date.split('-');
  let dateValue = new Date(date);
  return `${dateValue.toLocaleString('en-us', { month: 'long' })}${separator}${newDate[0]}`;
};

export const getUserNameTitle = (userName) => {
  let firstName = userName.toLocaleString().split(' ')[0];
  let lastName = userName.toLocaleString().split(' ')[1];
  return `${firstName[0]}${lastName[0]}`;
};

export const getStartWeekDay = (startWeekDate) => {
  let startWeekDay = startWeekDate.split('-');
  return `${startWeekDay[0]}-${startWeekDay[1]}-${amount(startWeekDay[2]) + 1}`;
};

export const getEndWeekDay = (endWeekDate) => {
  let endWeekDay = endWeekDate.split('-');
  return `${endWeekDay[0]}-${endWeekDay[1]}-${amount(endWeekDay[2])}`;
};

export const getDateFormat = (currentDate) => {
  let formatedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(
    currentDate.getDate()
  ).padStart(2, '0')}`;
  return formatedDate;
};

export const getWeekEndDateFormat = (currentDate) => {
  const lastWeekDate = currentDate;
  let formatedDate = `${lastWeekDate.getFullYear()}-${String(lastWeekDate.getMonth() + 1).padStart(2, '0')}-${lastWeekDate.getDate()}`;
  return formatedDate;
};

export const getWeekStartDateFormat = (currentDate, weekGap) => {
  const lastWeekDate = currentDate;
  lastWeekDate.setDate(lastWeekDate.getDate() - weekGap);
  let formatedDate = `${lastWeekDate.getFullYear()}-${String(lastWeekDate.getMonth() + 1).padStart(2, '0')}-${lastWeekDate.getDate()}`;
  return formatedDate;
};

export const getMonthStartDateFormat = (currentMonthDate, date) => {
  let formatedDate = `${currentMonthDate.getFullYear()}-${String(currentMonthDate.getMonth() + 1).padStart(2, '0')}-${date}`;
  return formatedDate;
};

export const getPreviousMonthStartDateFormat = (currentMonthDate, date) => {
  let formatedDate = '';

  if (currentMonthDate.getMonth() == 0) {
    formatedDate = `${currentMonthDate.getFullYear() - 1}-${String(12).padStart(2, '0')}-${date}`;
  } else {
    formatedDate = `${currentMonthDate.getFullYear()}-${String(currentMonthDate.getMonth()).padStart(2, '0')}-${date}`;
  }

  return formatedDate;
};

export const getCurrentMonthStartDateFormat = (currentMonthDate, date) => {
  let formatedDate = `${currentMonthDate.getFullYear()}-${String(currentMonthDate.getMonth() + 1).padStart(2, '0')}-${date}`;
  return formatedDate;
};

export const getDateTimeFormat = (currentDate) => {
  let currentDateTime = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}-${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;
  return currentDateTime;
};

export const getCurrentMonthAndDate = (currentDate) => {
  let currentDateTime = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  return currentDateTime;
};

export const getPreviousMonthAndDate = (currentDate) => {
  let selectedDate = '';
  //let date = new Date('2025-02-12');

  if (currentDate.getMonth() == 0) {
    selectedDate = `${currentDate.getFullYear() - 1}-12-31`;
  } else {
    selectedDate = `${currentDate.getFullYear() - 1}-${String(currentDate.getMonth()).padStart(2, '0')}`;
  }

  return selectedDate;
};

export const getMonthByDate = (currentDate) => {
  let date = new Date(currentDate);
  return date.getMonth();
};

export const getYearAndMonthByDate = (date) => {
  let providedDate = new Date(date);
  const selectedDate = `${providedDate.getFullYear()}-${String(providedDate.getMonth() + 1).padStart(2, '0')}`;
  return selectedDate;
};

export const getYearAndPreviousMonthByDate = (date) => {
  let providedDate = new Date(date);
  const selectedDate = `${providedDate.getFullYear()}-${providedDate.getMonth()}-1`;
  return selectedDate;
};

export const getFirstDateOfMonth = () => {
  let date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  let firstDay = new Date(y, m, 1);

  return firstDay.getDate();
};

export const getLastDateOfMonth = () => {
  let date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  let lastDay = new Date(y, m + 1, 0);

  return lastDay.getDate();
};

export const getCurrentYear = () => {
  let date = new Date();
  let currentYear = date.getFullYear();
  return String(currentYear);
};

export const getNextYear = () => {
  let date = new Date();
  let nextYear = date.getFullYear() + 1;
  return String(nextYear);
};

export const getLastDateOfMonthByDate = (selectDate) => {
  let date = new Date(selectDate),
    y = date.getFullYear(),
    m = date.getMonth();
  let lastDay = new Date(y, m + 1, 0);

  return lastDay.getDate();
};

export const getPayLastDateOfMonthByDate = (selectDate) => {
  let date = new Date(selectDate),
    y = date.getFullYear(),
    m = date.getMonth();
  let lastDay = new Date(y, m, 0);

  return lastDay.getDate();
};

export const getFirstDayOfMonth = (selectDate) => {
  let date = new Date(selectDate),
    y = date.getFullYear(),
    m = date.getMonth();
  let lastDay = getWeekEndDateFormat(new Date(y, m + 1, 1));

  return lastDay;
};

export const getFullDate = (date) => {
  let sortMonthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let dateMonthYear = new Date(date);

  let dateValue = dateMonthYear.getDate();
  let monthValue = sortMonthArray[dateMonthYear.getMonth()];
  let yearValue = dateMonthYear.getFullYear();

  return '' + (dateValue <= 9 ? '0' + dateValue : dateValue) + '-' + monthValue + '-' + yearValue;
};

export const getWordsByAmount = (amount) => {
  var NS = [
    { value: 10000000, str: 'Crore' },
    { value: 100000, str: 'Lakh' },
    { value: 1000, str: 'Thousand' },
    { value: 100, str: 'Hundred' },
    { value: 90, str: 'Ninety' },
    { value: 80, str: 'Eighty' },
    { value: 70, str: 'Seventy' },
    { value: 60, str: 'Sixty' },
    { value: 50, str: 'Fifty' },
    { value: 40, str: 'Forty' },
    { value: 30, str: 'Thirty' },
    { value: 20, str: 'Twenty' },
    { value: 19, str: 'Nineteen' },
    { value: 18, str: 'Eighteen' },
    { value: 17, str: 'Seventeen' },
    { value: 16, str: 'Sixteen' },
    { value: 15, str: 'Fifteen' },
    { value: 14, str: 'Fourteen' },
    { value: 13, str: 'Thirteen' },
    { value: 12, str: 'Twelve' },
    { value: 11, str: 'Eleven' },
    { value: 10, str: 'Ten' },
    { value: 9, str: 'Nine' },
    { value: 8, str: 'Eight' },
    { value: 7, str: 'Seven' },
    { value: 6, str: 'Six' },
    { value: 5, str: 'Five' },
    { value: 4, str: 'Four' },
    { value: 3, str: 'Three' },
    { value: 2, str: 'Two' },
    { value: 1, str: 'One' }
  ];

  let result = '';

  for (var n of NS) {
    if (amount >= n.value) {
      if (amount <= 99) {
        result += n.str;
        amount -= n.value;
        if (amount > 0) result += ' ';
      } else {
        var t = Math.floor(amount / n.value);
        var d = amount % n.value;
        if (d > 0) {
          return getWordsByAmount(t) + ' ' + n.str + ' ' + getWordsByAmount(d);
        } else {
          return getWordsByAmount(t) + ' ' + n.str;
        }
      }
    }
  }
  return result;
};

export const getNumberOfWeekendsInMonth = (selectedDate) => {
  let selectedDateArray = selectedDate.split('-');
  let year = selectedDateArray[0];
  let month = selectedDateArray[1];

  // Create a new Date object for the first day of the month.
  const date = new Date(year, month - 1, 1);

  // Get the number of days in the month.
  const numDays = new Date(year, month, 0).getDate();

  // Initialize a counter for the number of weekends.
  let numWeekends = 0;

  // Loop through each day in the month.
  for (let i = 0; i < numDays; i++) {
    // Get the day of the week.
    const dayOfWeek = date.getDay();

    // If the day of the week is Saturday or Sunday, increment the counter.
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      numWeekends++;
    }

    // Increment the date to the next day.
    date.setDate(date.getDate() + 1);
  }

  // Return the number of weekends.
  return numWeekends;
};

export const getTimeFormat = (selectedTime) => {
  let selectedTimeArray = selectedTime.split(':');

  var hours = selectedTimeArray[0];
  var minutes = selectedTimeArray[1];

  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours != 24 && hours < 10 ? '0' + hours : hours; // the hour '0' should be '12'
  minutes = minutes < 10 ? minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

export const getFullTimeFormat = (selectedTime) => {
  let selectedTimeArray = selectedTime.split(':');

  var hours = selectedTimeArray[0];
  var minutes = selectedTimeArray[1];
  var seconds = selectedTimeArray[2];

  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours != 24 && hours < 10 ? '0' + hours : hours; // the hour '0' should be '12'
  minutes = minutes < 10 ? minutes : minutes;
  seconds = seconds < 10 ? seconds : seconds;

  var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
  return strTime;
};

export const checkUserLoginStatus = (startSiftTime, endShiftTime) => {
  let now = new Date();
  let currentTime = convertTo24HourFormat([now.getHours(), ':', now.getMinutes(), ':', now.getSeconds()].join(''));

  return currentTime >= startSiftTime && currentTime <= endShiftTime;
};

export const convertTo24HourFormat = (time12h) => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes, seconds] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}:${seconds}`;
};

export const getHoursMinuteFormat = (selectedTime) => {
  let selectedTimeArray = selectedTime.split(':');

  var hours = selectedTimeArray[0];
  var minutes = selectedTimeArray[1];

  return `${hours} : ${minutes}`;
};

export const getHoursMinuteFormatNew = (date, inTime, outTime) => {
  var inDate = new Date(`${date} ${inTime}`);
  var outDate = new Date(`${date} ${outTime}`);

  var timeDifference = outDate.getTime() - inDate.getTime();

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  let calculatedHours = hours < 10 ? '0' + hours : hours;
  let calculatedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${calculatedHours}:${calculatedMinutes}`;
};

export const calculateSalary = (salary, leaves, specialAllowance) => {
  const oneDaySalary = salary / SalaryDetails.SALARY_DAYS;
  const leaveAmount = oneDaySalary * leaves;
  const totalPaidAMount = salary;
  const paybleSalary = totalPaidAMount - leaveAmount;

  return Math.round(paybleSalary + specialAllowance);
};

export const getDaysCountByTwoDates = (startDate, endDate) => {
  let date = new Date(startDate),
    y = date.getFullYear(),
    m = date.getMonth(),
    d = date.getDate();

  let firstDate = new Date(y, m, d - 1);
  let Difference_In_Time = endDate.getTime() - firstDate.getTime();
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  return Difference_In_Days;
};
