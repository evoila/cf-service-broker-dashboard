import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from 'app/core/core.module';

import { ElasticsearchComponent } from './elasticsearch.component';
import { ElasticsearchRoutingModule } from './elasticsearch-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    ElasticsearchRoutingModule
  ],
  declarations: [ElasticsearchComponent]
})
export class ElasticsearchModule { }
