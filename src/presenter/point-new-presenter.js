import EditingFormView from '../view/editing-form-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { isEscape } from '../utils/comon.js';
import { UserAction, UpdateType } from '../const.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #pointEditComponent = null;

  #changeData = null;
  #destroyCallback = null;
  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  constructor({pointListContainer, changeData, destinationsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#pointEditComponent = new EditingFormView({
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: true
    });

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setResetClickHandler(this.#handleResetClick);

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

  setSaving = () => {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting() {
    const resetAddFormState = () => {
      this.#pointEditComponent.updateElement({
        isSaving: false,
        isDeleting: false,
        isDisabled: false,
      });
    };

    this.#pointEditComponent.shake(resetAddFormState);
  }

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleResetClick = () => this.destroy();

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
