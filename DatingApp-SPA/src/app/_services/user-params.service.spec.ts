import { TestBed } from '@angular/core/testing';

import { UserParamsService } from './user-params.service';

describe('UserParamsService', () => {
  let service: UserParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
