import { TestBed } from '@angular/core/testing';

import { NotlogedGuard } from './notloged.guard';

describe('NotlogedGuard', () => {
  let guard: NotlogedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NotlogedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
