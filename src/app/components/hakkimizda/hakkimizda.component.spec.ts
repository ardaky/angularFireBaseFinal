/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HakkimizdaComponent } from './hakkimizda.component';

describe('HakkimizdaComponent', () => {
  let component: HakkimizdaComponent;
  let fixture: ComponentFixture<HakkimizdaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HakkimizdaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HakkimizdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
