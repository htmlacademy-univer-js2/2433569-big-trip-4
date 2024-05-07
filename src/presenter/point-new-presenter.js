import EditingFormView from '../view/editing-form-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { isEscape } from '../utils/comon.js';
import { UserAction, UpdateType } from '../const.js';
import { nanoid } from 'nanoid';

export default class PointNewPresenter {
  #pointListContainer = null;
  #pointEditComponent = null;

  #changeData = null;
  #destroyCallback = null;
  #pointsModel = null;

  #destinations = null;
  #offers = null;
  #isNewPoint = true;

  constructor(pointListContainer, changeData, pointsModel) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#pointsModel = pointsModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    this.#pointEditComponent = new EditingFormView({
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: this.#isNewPoint
    });

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleDeleteClick = () => this.destroy();

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };
}
