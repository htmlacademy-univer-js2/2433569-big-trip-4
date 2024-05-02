import NoPointView from '../view/no-point.js';
import { render, RenderPosition } from '../framework/render.js';
import TripEventsView from '../view/trip-events-view.js';
import PointPresenter from './point-presenter.js';
import SortingView from '../view/sorting-view.js';
import { updateItem } from '../utils/comon.js';

export default class TripEventsPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #boardPoints = null;
  

  #noPointComponent = new NoPointView();
  #sortComponent = new SortingView();
  #pointListComponent = new TripEventsView();
  #pointPresenter = new Map();

  constructor(tripContainer, pointsModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    
    if (this.#boardPoints.length === 0) {
      this.#renderNoPoints();
    }
    else {
      this.#renderSort();
      this.#renderPointList();
    }
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };  

  #renderSort = () => {
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };
    
  #renderPoint (point) {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#pointsModel, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };
    
  #renderPoints = (from, to) => {
    this.#boardPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  };

  #renderNoPoints = () => {
    render(this.#noPointComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderPointList = () => {
    render(this.#pointListComponent, this.#tripContainer);
    this.#renderPoints(0, this.#boardPoints.length);
  };
}
