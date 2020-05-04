import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ElasticsearchComponent } from './elasticsearch.component';
import { ElasticsearchBackupComponent } from './elasticsearch-backup/elasticsearch-backup.component';

export const ROUTES = [
  {
    path: '',
    component: ElasticsearchComponent,
    children: [{
      path: 'elasticsearch-backup',
      component: ElasticsearchBackupComponent,
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ElasticsearchRoutingModule { }
