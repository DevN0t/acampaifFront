import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampistsPublicComponent } from './campists-public.component';

describe('CampistsPublicComponent', () => {
  let component: CampistsPublicComponent;
  let fixture: ComponentFixture<CampistsPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampistsPublicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampistsPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
