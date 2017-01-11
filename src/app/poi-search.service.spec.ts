/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PoiSearchService } from './poi-search.service';

describe('PoiSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoiSearchService]
    });
  });

  it('should ...', inject([PoiSearchService], (service: PoiSearchService) => {
    expect(service).toBeTruthy();
  }));
});
