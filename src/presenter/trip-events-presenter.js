import NoPointView from '../view/no-point.js';
import TripEventsView from '../view/trip-events-view.js';
import PointPresenter from './point-presenter.js';
import SortingView from '../view/sorting-view.js';
import PointNewPresenter from './point-new-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ErrorMessageView from '../view/error-message-view.js';
import TripInfoPresenter from './info-presenter.js';
import { filter } from '../utils/filter.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { sorting } from '../utils/point-date.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripEventsPresenter {
  #tripInfoContainer = null;
  #tripContainer = null;

  #pointsModel = null;
  #filterModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #noPointComponent = null;
  #sortComponent = null;
  #pointListComponent = new TripEventsView();
  #loadingComponent = new LoadingView();
  #errorMessageComponent = new ErrorMessageView();

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #tripInfoPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor({tripInfoContainer, tripContainer, pointsModel, filterModel, destinationsModel, offersModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointNewPresenter = new PointNewPresenter({
      pointListContainer: this.#pointListComponent.element,
      changeData: this.#handleViewAction,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });

    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    sorting[this.#currentSortType](filteredPoints);
    return filteredPoints;

  }

  init() {
    this.#renderTripEvents();
  }

  createNewForm = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    if (this.#noPointComponent) {
      render(this.#pointListComponent, this.#tripContainer);
    }
    this.#pointNewPresenter.init(callback);
  };

  #renderSort = () => {
    this.#sortComponent = new SortingView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderTripInfo = () => {
    this.#tripInfoPresenter = new TripInfoPresenter(this.#tripInfoContainer, this.#destinationsModel, this.#offersModel);
    const sortedPoints = sorting[SortType.DAY](this.points);
    this.#tripInfoPresenter.init(sortedPoints);
  };

  #renderPoint (point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      changeData: this.#handleViewAction,
      changeMode: this.#handleModeChange,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderErrorMessage = () => {
    render(this.#errorMessageComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointView(this.#filterType);
    render(this.#noPointComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPointList = (points) => {
    render(this.#pointListComponent, this.#tripContainer);
    this.#renderPoints(points);
  };

  #clearTripInfo = () => {
    this.#tripInfoPresenter.destroy();
  };

  #clearPointList = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderTripEvents = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#offersModel.offers.length === 0 || this.#offersModel.isSuccessfulLoading === false ||
      this.#destinationsModel.destinations.length === 0 || this.#destinationsModel.isSuccessfulLoading === false ||
      this.#pointsModel.isSuccessfulLoading === false) {
      this.#renderErrorMessage();
      return;
    }

    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderPointList(points);
    this.#renderSort();
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#clearTripInfo();
        this.#renderTripInfo();
        this.#renderTripEvents();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({resetSortType: true});
        this.#renderTripEvents();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTripEvents();
        this.#renderTripInfo();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderTripEvents();
  };
}
