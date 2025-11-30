import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductBuyDialog } from './add-product-buy-dialog';

describe('AddProductBuyDialog', () => {
  let component: AddProductBuyDialog;
  let fixture: ComponentFixture<AddProductBuyDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductBuyDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductBuyDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
