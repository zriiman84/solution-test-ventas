import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedInHeader } from './logged-in-header';

describe('LoggedInHeader', () => {
  let component: LoggedInHeader;
  let fixture: ComponentFixture<LoggedInHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggedInHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggedInHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
