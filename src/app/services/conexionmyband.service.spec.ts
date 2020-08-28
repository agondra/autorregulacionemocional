import { TestBed } from '@angular/core/testing';

import { ConexionmybandService } from './conexionmyband.service';

describe('ConexionmybandService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConexionmybandService = TestBed.get(ConexionmybandService);
    expect(service).toBeTruthy();
  });
});
