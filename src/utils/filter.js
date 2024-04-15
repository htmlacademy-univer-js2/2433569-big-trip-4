import { isPointPastDate, isPointFutureDate, isPointFuturePastDate } from './point-date.js';
import { FilterType } from '../mock/point.js';

const filterPoints = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFutureDate(point.dateFrom) || isPointFuturePastDate(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPastDate(point.dateTo) || isPointFuturePastDate(point.dateFrom, point.dateTo)),
};

export { filterPoints };
