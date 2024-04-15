import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const { name, count } = filter;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      ${isChecked ? 'checked' : ''}
      ${count ? '' : 'disabled'}
      value=${name}>
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>`
  );
};

const createFiltersTemplate = (filterItems) => {
  const filterItemsTemplate = Array.from(filterItems)
    .map((name, count) => createFilterItemTemplate(name, count))
    .join('');

  return(
    `<form class="trip-filters" action="#" method="get">
       ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }
  
  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
