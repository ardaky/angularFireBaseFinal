/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FirebaseservisService } from './firebaseservis.service';

describe('Service: Firebaseservis', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseservisService]
    });
  });

  it('should ...', inject([FirebaseservisService], (service: FirebaseservisService) => {
    expect(service).toBeTruthy();
  }));
});
