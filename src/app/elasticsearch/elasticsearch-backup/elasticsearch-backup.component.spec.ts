import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElasticsearchBackupComponent } from './elasticsearch-backup.component';

describe('ElasticsearchBackupComponent', () => {
  let component: ElasticsearchBackupComponent;
  let fixture: ComponentFixture<ElasticsearchBackupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElasticsearchBackupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElasticsearchBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
