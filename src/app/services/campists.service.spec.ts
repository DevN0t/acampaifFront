import { TestBed } from '@angular/core/testing';

import { CampistsService } from './campists.service';

describe('CampistsService', () => {
  let service: CampistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
