/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EgitimlerComponent } from './egitimler.component';

describe('EgitimlerComponent', () => {
  let component: EgitimlerComponent;
  let fixture: ComponentFixture<EgitimlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EgitimlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EgitimlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
