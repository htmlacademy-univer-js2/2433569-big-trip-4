import NoPointView from '../view/no-point.js';
import RoutePointView from '../view/route-point-view.js';
import TripEventsView from '../view/trip-events-view.js';
import EditingFormView from '../view/editing-form-view.js';
import SortingView from '../view/sorting-view.js';
import { render, replace } from '../framework/render.js';
import { isEscape } from '../utils/comon.js';

export default class TripEventsPresenter {
  #eventsList = null;
  #pointsModel = null;
  #boardPoints = null;
  #destinations = null;
  #offers = null;

  constructor(tripContainer) {
    this.#eventsList = new TripEventsView();
    this.tripContainer = tripContainer;
  }

  init(pointsModel) {
    this.#pointsModel = pointsModel;
    this.#boardPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];
    if (this.#boardPoints.length === 0) {
      render(new NoPointView(), this.tripContainer);
    }
    else {
      render(new SortingView(), this.tripContainer);
      render(this.#eventsList, this.tripContainer);
      for (const point of this.#boardPoints) {
        this.#renderPoint(point);
      }
    }
  }

  #renderPoint (point) {
    const pointComponent = new RoutePointView(point, this.#destinations, this.#offers);
    const editPointComponent = new EditingFormView(point, this.#destinations, this.#offers);

    const replacePointToEditForm = () => {
      replace(editPointComponent, pointComponent);
    };

    const replaceEditFormToPoint = () => {
      replace(pointComponent, editPointComponent);
    };

    const onEscKeyDown = (evt) => {
      if (isEscape(evt)) {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.setEditClickHandler(() => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.setPreviewClickHandler(() => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editPointComponent.setFormSubmitHandler(() => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#eventsList.element);
  };
}
