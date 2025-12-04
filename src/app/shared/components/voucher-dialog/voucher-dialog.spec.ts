import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherDialog } from './voucher-dialog';

describe('VoucherDialog', () => {
  let component: VoucherDialog;
  let fixture: ComponentFixture<VoucherDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
