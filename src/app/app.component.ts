import { Component } from '@angular/core';
import { PoiSearchService } from "./poi-search.service";
import {serialize} from "@angular/compiler/src/i18n/serializers/xml_helper";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PoiSearchService]
})
export class AppComponent {
  title = 'app works!';
  searchService: PoiSearchService;


  constructor(searchService: PoiSearchService){
    this.searchService = searchService;
  }
}
