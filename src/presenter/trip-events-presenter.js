import TripEventsView from '../view/trip-events-view.js';
import RoutePointView from '../view/route-point-view.js';
import CreatingFormView from '../view/creating-form-view.js';
import EditingFormView from '../view/editing-form-view.js';
import SortingView from '../view/sorting-view.js';
import { render } from '../render.js';

export default class TripEventsPresenter {
    constructor() {
        this.eventsList = new TripEventsView();
    }

    init(tripContainer) {
        this.tripContainer = tripContainer;

        render(new SortingView(), this.tripContainer);
        render(this.eventsList, this.tripContainer);
        render(new EditingFormView(), this.eventsList.getElement());

        for (let i = 0; i < 3; i++) {
            render(new RoutePointView(), this.eventsList.getElement());
        }

        render(new CreatingFormView(), this.eventsList.getElement());
    }
}