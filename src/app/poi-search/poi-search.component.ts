import { Component, OnInit } from '@angular/core';
import {PoiSearchService} from "../poi-search.service";

@Component({
  selector: 'app-poi-search',
  templateUrl: './poi-search.component.html',
  styleUrls: ['./poi-search.component.css'],
  providers: [PoiSearchService]
})
export class PoiSearchComponent implements OnInit {

  constructor(private searchService: PoiSearchService) { }

  ngOnInit() {
  }

  search(){
    this.searchService.search();
  }
}
