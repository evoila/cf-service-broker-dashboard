import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsindexComponent } from './esindex.component';

describe('EsindexComponent', () => {
  let component: EsindexComponent;
  let fixture: ComponentFixture<EsindexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsindexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsindexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
