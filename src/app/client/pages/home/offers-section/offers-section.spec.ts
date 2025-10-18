import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersSection } from './offers-section';

describe('OffersSection', () => {
  let component: OffersSection;
  let fixture: ComponentFixture<OffersSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
