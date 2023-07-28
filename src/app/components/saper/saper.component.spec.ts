import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaperComponent } from './saper.component';

describe('SaperComponent', () => {
  let component: SaperComponent;
  let fixture: ComponentFixture<SaperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaperComponent]
    });
    fixture = TestBed.createComponent(SaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
