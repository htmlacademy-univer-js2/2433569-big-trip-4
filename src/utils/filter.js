import { isPastPoint, isFuturePoint, isFuturePastPoint } from './point-date.js';
import { FilterType } from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point.dateFrom) || isFuturePastPoint(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point.dateTo) || isFuturePastPoint(point.dateFrom, point.dateTo)),
};

export { filter };
