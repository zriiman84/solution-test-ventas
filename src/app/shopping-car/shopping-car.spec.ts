import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCar } from './shopping-car';

describe('ShoppingCar', () => {
  let component: ShoppingCar;
  let fixture: ComponentFixture<ShoppingCar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingCar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
