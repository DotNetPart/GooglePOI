import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import "geolib";
import "googlemaps";
import Map = google.maps.Map;
import PlacesService = google.maps.places.PlacesService;
import PlaceSearchRequest = google.maps.places.PlaceSearchRequest;
import LatLngBounds = google.maps.LatLngBounds;

@Injectable()
export class PoiSearchService {
  private googleSearch: google.maps.places.PlacesService;
  private map: google.maps.Map;

  constructor() {
    this.map = new Map(document.getElementById("map"));
    this.googleSearch = new PlacesService(this.map);
  }

  search() : void{

    let request: PlaceSearchRequest = {
      bounds: new LatLngBounds({lat:30.318846, lng:59.827468}),
      type: 'atm',
      radius: 500
    };
    this.googleSearch.nearbySearch(request, this.onPlacesFound);
  }

  private onPlacesFound(res: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus, pages: google.maps.places.PlaceSearchPagination) {

  }
}
