import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable, Subject} from "rxjs";
import "geolib";
import "googlemaps";
import Map = google.maps.Map;
import PlacesService = google.maps.places.PlacesService;
import PlaceSearchRequest = google.maps.places.PlaceSearchRequest;
import LatLngBounds = google.maps.LatLngBounds;
import PlaceResult = google.maps.places.PlaceResult;
import PlacesServiceStatus = google.maps.places.PlacesServiceStatus;
import PlaceSearchPagination = google.maps.places.PlaceSearchPagination;
import {forEach} from "@angular/router/src/utils/collection";
import PositionAsDecimal = geolib.PositionAsDecimal;

@Injectable()
export class PoiSearchService {
  private googleSearch: google.maps.places.PlacesService;
  private map: google.maps.Map;
  private static type: string = 'atm';
  private static radius: number = 500;

  private static bounds = {
    leftTop: { latitude: 60.216812, longitude: 29.585813 },
    rightBottom: { latitude: 59.715533, longitude: 30.787728 }
  };

  public isBusy: boolean = false;

  constructor() {
    this.map = new Map(document.getElementById("map"));
    this.googleSearch = new PlacesService(this.map);
  }

  search(options?: SearchOptions): Observable<PlaceResult> {

    options = options || {
        location: PoiSearchService.bounds.leftTop,
        nextLocationUpper: false,
        nextLocationRight: true,
        observable: new Subject<PlaceResult>()
      };

    let request: PlaceSearchRequest = {
      location: {
        lat: options.location.latitude,
        lng: options.location.longitude
      },
      type: PoiSearchService.type,
      radius: PoiSearchService.radius
    };

    options.observable = options.observable || new Subject<PlaceResult>();

    this.googleSearch.nearbySearch(request, (res, status, pages) => this.onPlacesFound(res, status, pages, options));
    return options.observable;
  }

  private onPlacesFound(res: PlaceResult[], status: PlacesServiceStatus, pages: PlaceSearchPagination, options: SearchOptions) {
    if (status != PlacesServiceStatus.OK)
      return;

    res.forEach(item => options.observable.next(item));

    if (pages.hasNextPage)
      pages.nextPage();

    let bearing =  0;
    let newLocation = geolib.computeDestinationPoint(options.location, PoiSearchService.radius, bearing);
    this.search()
  }
}


export interface SearchOptions {
  location: PositionAsDecimal;
  nextLocationUpper: boolean;
  nextLocationRight: boolean;
  observable: Subject<PlaceResult>;
}
