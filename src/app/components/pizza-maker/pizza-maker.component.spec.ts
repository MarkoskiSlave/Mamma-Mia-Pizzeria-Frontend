import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzaMakerComponent } from './pizza-maker.component';

describe('PizzaMakerComponent', () => {
  let component: PizzaMakerComponent;
  let fixture: ComponentFixture<PizzaMakerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PizzaMakerComponent]
    });
    fixture = TestBed.createComponent(PizzaMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
