/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IletisimComponent } from './iletisim.component';

describe('IletisimComponent', () => {
  let component: IletisimComponent;
  let fixture: ComponentFixture<IletisimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IletisimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IletisimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
