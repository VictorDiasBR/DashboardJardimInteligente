import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardIotComponent } from './dashboard-iot.component';

describe('DashboardIotComponent', () => {
  let component: DashboardIotComponent;
  let fixture: ComponentFixture<DashboardIotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardIotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardIotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
