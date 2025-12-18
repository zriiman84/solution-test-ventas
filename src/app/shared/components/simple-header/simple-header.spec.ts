import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleHeader } from './simple-header';

describe('SimpleHeader', () => {
  let component: SimpleHeader;
  let fixture: ComponentFixture<SimpleHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
