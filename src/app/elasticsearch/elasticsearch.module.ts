import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from 'app/core/core.module';

import { Bootstrap4FrameworkModule } from 'angular6-json-schema-form';
import { ElasticsearchComponent } from './elasticsearch.component';
import { ElasticsearchRoutingModule } from './elasticsearch-routing.module';
import { ElasticsearchBackupComponent } from './elasticsearch-backup/elasticsearch-backup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    ElasticsearchRoutingModule,
    Bootstrap4FrameworkModule
  ],
  declarations: [ElasticsearchComponent, ElasticsearchBackupComponent]
})
export class ElasticsearchModule { }
