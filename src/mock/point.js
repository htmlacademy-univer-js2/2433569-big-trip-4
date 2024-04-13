import { getRandomInteger, getRandomElement } from '../utils.js';
import dayjs from 'dayjs';

const COUNT_OF_POINTS = 20;
const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DESTINATION_NAMES = ['London', 'Moscow', 'Dubai', 'Bangkok', 'Paris'];

const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const ElementCounter = { MIN: 1, MAX: 4 };
const Price = { MIN: 100, MAX: 1000 };
const PossibleNumberID = { MIN: 0, MAX: 10 };

const generateDescription = () => {
  let description = '';
  for (let i = 0; i < getRandomInteger(ElementCounter.MIN, ElementCounter.MAX); i++) {
    description += ` ${getRandomElement(DESCRIPTIONS)}`;
  }
  return description;
};

const generatePicture = () => ({
  src: `http://picsum.photos/248/152?r=${getRandomInteger(PossibleNumberID.MIN, PossibleNumberID.MAX)}`,
  description: generateDescription(),
});

const generateDestination = (id) => ({
  id,
  description: generateDescription(),
  name: DESTINATION_NAMES[id],
  pictures: Array.from({ length: getRandomInteger(ElementCounter.MIN, ElementCounter.MAX) }, generatePicture),
});

const getDestinations = () => Array.from({ length: DESTINATION_NAMES.length }).map((value, index) => generateDestination(index));

const generateOffer = (id, pointType) => ({
  id,
  title: `offer for ${pointType}`,
  price: getRandomInteger(Price.MIN, Price.MAX)
});

const generateOffersByType = (pointType) => ({
  type: pointType,
  offers: Array.from({ length: getRandomInteger(ElementCounter.MIN, ElementCounter.MAX) }).map((value, index) => generateOffer(index + 1, pointType)),
});

const getOffers = () => Array.from({ length: POINT_TYPES.length }).map((value, index) => generateOffersByType(POINT_TYPES[index]));

const offersByType = getOffers();
const destinations = getDestinations();

const generatePoint = (id) => {
  const offersByTypePoint = getRandomElement(offersByType);
  const allOfferIdsByTypePoint = offersByTypePoint.offers.map((offer) => offer.id);
  return {
    basePrice: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: dayjs().add(getRandomInteger(-3, 0), 'day').add(getRandomInteger(-2, 0), 'hour').add(getRandomInteger(-59, 0), 'minute'),
    dateTo: dayjs().add(getRandomInteger(0, 2), 'hour').add(getRandomInteger(0, 59), 'minute'),
    destinationId: getRandomElement(destinations).id,
    id,
    isFavorite: Boolean(getRandomInteger()),
    offerIds: Array.from({ length: getRandomInteger(0, allOfferIdsByTypePoint.length) }).map(() => allOfferIdsByTypePoint[getRandomInteger(0, allOfferIdsByTypePoint.length - 1)]),
    type: offersByTypePoint.type,
  };
};

const getPoints = () => Array.from({ length: COUNT_OF_POINTS }).map((value, index) => generatePoint(index + 1));

export { getPoints, getDestinations, getOffers };
