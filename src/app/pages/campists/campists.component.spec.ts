import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampistsComponent } from './campists.component';

describe('CampistsComponent', () => {
  let component: CampistsComponent;
  let fixture: ComponentFixture<CampistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
