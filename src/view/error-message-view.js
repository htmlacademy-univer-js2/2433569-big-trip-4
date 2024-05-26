import AbstractView from '../framework/view/abstract-view.js';


const cretaeErrorMessageTemplate = () => (
  `<p class="trip-events__msg">
  Sorry, there was an error loading the data, please try again
  </p>`
);

export default class ErrorMessageView extends AbstractView {
  get template() {
    return cretaeErrorMessageTemplate();
  }
}
