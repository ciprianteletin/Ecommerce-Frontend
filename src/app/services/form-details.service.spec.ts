import { TestBed } from '@angular/core/testing';

import { FormDetailsService } from './form-details.service';

describe('FormDetailsService', () => {
  let service: FormDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
