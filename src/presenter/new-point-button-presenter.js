import { render } from '../framework/render.js';
import NewPointButtonView from '../view/new-point-button-view.js';

export default class NewPointButtonPresenter {
  #newPointButtonContainer = null;
  #destinationsModel = null;
  #pointsModel = null;
  #offersModel = null;
  #tripPresenter = null;
  #newButtonComponent = null;

  constructor({newPointButtonContainer, destinationsModel, pointsModel, offersModel, tripPresenter}) {
    this.#newPointButtonContainer = newPointButtonContainer;
    this.#destinationsModel = destinationsModel;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#tripPresenter = tripPresenter;
  }

  init() {
    this.#newButtonComponent = new NewPointButtonView();
  }

  renderNewPointButton = () => {
    render(this.#newButtonComponent, this.#newPointButtonContainer);
    this.#newButtonComponent.setClickHandler(this.#handleNewPointButtonClick);
    if (this.#offersModel.offers.length === 0 || this.#offersModel.isSuccessfulLoading === false ||
      this.#destinationsModel.destinations.length === 0 || this.#destinationsModel.isSuccessfulLoading === false ||
      this.#pointsModel.isSuccessfulLoading === false) {
      this.#newButtonComponent.element.disabled = true;
    }
  };

  #handleNewButtonClose = () => {
    this.#newButtonComponent.element.disabled = false;
  };

  #handleNewPointButtonClick = () => {
    this.#tripPresenter.createNewForm(this.#handleNewButtonClose);
    this.#newButtonComponent.element.disabled = true;
  };
}
