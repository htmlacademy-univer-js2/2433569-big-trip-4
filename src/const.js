const FilterType = {
  EVERYTHING: 'everything',
  PRESENT: 'present',
  FUTURE: 'future',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
  EVENT: 'event',
  OFFER: 'offer'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const Point = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant'
};

const PointDescription = {
  [Point.TAXI]: 'Taxi',
  [Point.BUS]: 'Bus',
  [Point.TRAIN]: 'Train',
  [Point.SHIP]: 'Ship',
  [Point.DRIVE]: 'Drive',
  [Point.FLIGHT]: 'Flight',
  [Point.CHECK_IN]: 'Check-in',
  [Point.SIGHTSEEING]: 'Sightseeing',
  [Point.RESTAURANT]: 'Restaurant'
};

const ApiServiceResponse = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export {FilterType, SortType, UserAction, UpdateType, Point, PointDescription, ApiServiceResponse};
