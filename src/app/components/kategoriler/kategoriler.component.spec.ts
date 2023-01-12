/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KategorilerComponent } from './kategoriler.component';

describe('KategorilerComponent', () => {
  let component: KategorilerComponent;
  let fixture: ComponentFixture<KategorilerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KategorilerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KategorilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
