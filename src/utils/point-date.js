import dayjs from 'dayjs';
import { SortType } from '../const.js';

const HOUR_MINUTES_COUNT = 60;
const TOTAL_DAY_MINUTES_COUNT = 1440;
const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'DD/MM/YY HH:mm';
const TIME_FORMAT = 'HH:mm';

const humanizePointDueDate = (date) => dayjs(date).format('DD MMM');

const getDaysOutput = (days) => days <= 0 ? '' : `${`${days}`.padStart(2, '0')}D`;
const getHoursOutput = (days, restHours) => (days <= 0 && restHours <= 0) ? '' : `${`${restHours}`.padStart(2, '0')}H`;
const getMinutesOutput = (restMinutes) => `${`${restMinutes}`.padStart(2, '0')}M`;

const duration = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const difference = end.diff(start, 'minute');

  const days = Math.floor(difference / TOTAL_DAY_MINUTES_COUNT);
  const restHours = Math.floor((difference - days * TOTAL_DAY_MINUTES_COUNT) / HOUR_MINUTES_COUNT);
  const restMinutes = difference - (days * TOTAL_DAY_MINUTES_COUNT + restHours * HOUR_MINUTES_COUNT);

  const daysOutput = getDaysOutput(days);
  const hoursOutput = getHoursOutput(days, restHours);
  const minutesOutput = getMinutesOutput(restMinutes);

  return `${daysOutput} ${hoursOutput} ${minutesOutput}`;
};

const getDate = (date) => dayjs(date).format(DATE_FORMAT);
const getTime = (date) => dayjs(date).format(TIME_FORMAT);
const getDateTime = (date) => dayjs(date).format(DATE_TIME_FORMAT);

const isPastPoint = (dateTo) => dayjs().diff(dateTo, 'minute') > 0;
const isFuturePoint = (dateFrom) => dayjs().diff(dateFrom, 'minute') <= 0;
const isFuturePastPoint = (dateFrom, dateTo) => dayjs().diff(dateFrom, 'minute') > 0 && dayjs().diff(dateTo, 'minute') < 0;

const sortPointsByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
const sortPointsByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortPointsByTime = (pointA, pointB) => {
  const timePointA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timePointB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return timePointB - timePointA;
};

const sorting = {
  [SortType.DAY]: (points) => points.sort(sortPointsByDay),
  [SortType.TIME]: (points) => points.sort(sortPointsByTime),
  [SortType.PRICE]: (points) => points.sort(sortPointsByPrice)
};

export { humanizePointDueDate, duration, getDate, getDateTime, getTime, isPastPoint, isFuturePoint, isFuturePastPoint, sorting };
