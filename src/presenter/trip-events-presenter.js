import TripEventsView from '../view/trip-events-view.js';
import RoutePointView from '../view/route-point-view.js';
import EditingFormView from '../view/editing-form-view.js';
import SortingView from '../view/sorting-view.js';
import { render } from '../render.js';

export default class TripEventsPresenter {
  constructor(tripContainer) {
    this.eventsList = new TripEventsView();
    this.tripContainer = tripContainer;
  }

  init(pointsModel) {
    this.pointsModel = pointsModel;
    this.boardPoints = [...this.pointsModel.getPoints()];
    this.destinations = [...this.pointsModel.getDestinations()];
    this.offers = [...this.pointsModel.getOffers()];

    render(new SortingView(), this.tripContainer);
    render(this.eventsList, this.tripContainer);
    render(new EditingFormView(this.boardPoints[0], this.destinations, this.offers), this.eventsList.getElement());

    for (const point of this.boardPoints) {
      render(new RoutePointView(point, this.destinations, this.offers), this.eventsList.getElement());
    }
  }
}
