import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioIotComponent } from './relatorio-iot.component';

describe('RelatorioIotComponent', () => {
  let component: RelatorioIotComponent;
  let fixture: ComponentFixture<RelatorioIotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioIotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioIotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
