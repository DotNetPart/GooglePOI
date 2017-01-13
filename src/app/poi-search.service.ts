import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import * as geolib from "geolib";
import "googlemaps";
import Map = google.maps.Map;
import PlacesService = google.maps.places.PlacesService;
import PlaceSearchRequest = google.maps.places.PlaceSearchRequest;
import LatLngBounds = google.maps.LatLngBounds;
import PlaceResult = google.maps.places.PlaceResult;
import PlacesServiceStatus = google.maps.places.PlacesServiceStatus;
import PlaceSearchPagination = google.maps.places.PlaceSearchPagination;
import PositionAsDecimal = geolib.PositionAsDecimal;
import LatLng = google.maps.LatLng;
import LatLngLiteral = google.maps.LatLngLiteral;

@Injectable()
export class PoiSearchService {
  private googleSearch: google.maps.places.PlacesService;
  private map: google.maps.Map;
  private static type: string = 'atm';
  private static radius: number = 500;
  private boundsArray: LatLngBounds[];

  private static bounds = {
    sw: { lat: 59.715533, lng: 29.585813 },
    ne: { lat:60.216812, lng: 30.787728 }
  };

  public isBusy: boolean = false;
  public progress: number = 0;
  public currentResult: Observable<PlaceResult> = null;

  constructor() {
    this.map = new Map(document.getElementById("map"));
    this.googleSearch = new PlacesService(this.map);
    this.boundsArray = this.pregenerateBounds(PoiSearchService.bounds);
  }

  private pregenerateBounds(bounds: {sw: LatLngLiteral, ne: LatLngLiteral}): LatLngBounds[]{
    let nextBounds: { sw: LatLngLiteral, ne: LatLngLiteral } =  { sw: bounds.sw, ne: null };
    let result: LatLngBounds[] = [];
    do{

      let start: PositionAsDecimal = { latitude: nextBounds.sw.lat, longitude: nextBounds.sw.lng };
      let ne = geolib.computeDestinationPoint(start, 2 * PoiSearchService.radius, 45);
      nextBounds.ne = { lat: ne.latitude, lng: ne.longitude };


      result.push(new LatLngBounds(nextBounds.sw, nextBounds.ne));

      nextBounds = { sw: { lat: nextBounds.sw.lat, lng: nextBounds.ne.lng }, ne: null };
      if (nextBounds.sw.lng > bounds.ne.lng)
        nextBounds.sw = { lng: bounds.sw.lng, lat: ne.latitude };

    }while(nextBounds.sw.lat <= bounds.ne.lat && nextBounds.sw.lng <= bounds.ne.lng);

    return result;
  }

  search(options?: SearchOptions): Observable<PlaceResult> {
    options = options || {
        boundsEnumerator: new BoundsEnumerator(this.boundsArray),
        observable: new Subject<PlaceResult>()
      };

    this.currentResult = options.observable.asObservable();

    if (!options.boundsEnumerator || !options.boundsEnumerator.current){
      return options.observable;
    }

    let request: PlaceSearchRequest = {
      bounds: options.boundsEnumerator.current,
      type: PoiSearchService.type
    };

    options.observable = options.observable || new Subject<PlaceResult>();

    this.googleSearch.nearbySearch(request, (res, status, pages) => this.onPlacesFound(res, status, pages, options));
    return options.observable;
  }

  private onPlacesFound(res: PlaceResult[], status: PlacesServiceStatus, pages: PlaceSearchPagination, options: SearchOptions) {
    if (status === PlacesServiceStatus.OVER_QUERY_LIMIT)
    {
      console.log("Over Query Limit");
      return;
    }
    if (status === PlacesServiceStatus.OK) {

      res.forEach(item => options.observable.next(item));

      if (pages.hasNextPage)``
      {
        pages.nextPage();
        return;
      }
    }

    this.progress = Math.floor(100 * options.boundsEnumerator.currentIndex / this.boundsArray.length);
    if (options.boundsEnumerator.moveNext())
      setTimeout(() => this.search(options), 2000);
  }
}


export interface SearchOptions {
  boundsEnumerator: BoundsEnumerator;
  observable: Subject<PlaceResult>;
}

export class BoundsEnumerator{
  public currentIndex: number = 0;

  public current: LatLngBounds;


  constructor(private source: LatLngBounds[]){
    if (source.length !== 0)
      this.moveNext();
  }

  public moveNext(): boolean {

    this.current = this.currentIndex < this.source.length
      ? this.source[this.currentIndex++] : null ;

    return !!this.current;
  }
}
