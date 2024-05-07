import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createSortingTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--${SortType.DAY}">
    <input id="sort-${SortType.DAY}" data-sort-type=${SortType.DAY} class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.DAY}" checked>
    <label class="trip-sort__btn" for="sort-${SortType.DAY}">Day</label>
  </div>
  <div class="trip-sort__item  trip-sort__item--${SortType.EVENT}">
    <input id="sort-${SortType.EVENT}" data-sort-type=${SortType.EVENT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.EVENT}" disabled>
    <label class="trip-sort__btn" for="sort-${SortType.EVENT}">Event</label>
  </div>
  <div class="trip-sort__item  trip-sort__item--${SortType.TIME}">
    <input id="sort-${SortType.TIME}" data-sort-type=${SortType.TIME} class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.TIME}">
    <label class="trip-sort__btn" for="sort-${SortType.TIME}">Time</label>
  </div>
  <div class="trip-sort__item  trip-sort__item--${SortType.PRICE}">
    <input id="sort-${SortType.PRICE}" data-sort-type=${SortType.PRICE} class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.PRICE}">
    <label class="trip-sort__btn" for="sort-${SortType.PRICE}">Price</label>
  </div>
  <div class="trip-sort__item  trip-sort__item--${SortType.OFFER}">
    <input id="sort-${SortType.OFFER}" data-sort-type=${SortType.OFFER}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortType.OFFER}" disabled>
    <label class="trip-sort__btn" for="sort-${SortType.OFFER}">Offers</label>
  </div>
</form>`
);

export default class SortingView extends AbstractView {
  _callback = {};
  get template() {
    return createSortingTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
