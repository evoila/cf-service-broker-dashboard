import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ElasticsearchComponent } from './elasticsearch.component';



export const ROUTES = [
  {
    path: '',
    component: ElasticsearchComponent,
    children: [
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ElasticsearchRoutingModule { }
