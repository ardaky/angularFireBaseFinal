/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KullanicilarComponent } from './kullanicilar.component';

describe('KullanicilarComponent', () => {
  let component: KullanicilarComponent;
  let fixture: ComponentFixture<KullanicilarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KullanicilarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KullanicilarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
