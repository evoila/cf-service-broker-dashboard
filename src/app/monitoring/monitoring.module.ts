import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringComponent } from 'app/monitoring/monitoring.component';
import { MonitoringRoutingModule } from './monitoring-routing.module';
import { NouisliderModule } from 'ng2-nouislider';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { NgbTimepickerModule } from './components/timepicker/timepicker.module';

import {
  StoreRouterConnectingModule,
  RouterStateSerializer
} from '@ngrx/router-store';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { FormsModule } from '@angular/forms';
import * as fromBootstrap from '@ng-bootstrap/ng-bootstrap';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { ChartComponent } from './chart/chart/chart.component';
import { services } from './services';

import { reducers, CustomSerializer } from './store';

import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// NO PRODUCTION VALUES
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';

import { CoreModule } from 'app/core/core.module';
import { environment } from '../../environments/runtime-environment';

import { SharedModule } from './shared/shared.module';
import { ChartConfiguratorModule } from './chart-configurator/chart-configurator.module';
import { TableEditorModule } from './table-editor/table-editor.module';
import { reducers as sharedReducer } from './shared/store/reducers';
import { components } from './components';
import { effects as sharedEffects } from './shared/store/effects/index';
import { ChartService } from './shared/services/chart.service';
import { PanelService as NewPanelService } from './shared/services/panel.service';
import { containerComponents } from './containers';
import { ElementWrapperComponent } from './components/panel/element-wrapper/element-wrapper.component';


// Store Freeze restricts every mutation on the Store itself. But we want this to be a dev only thing

export const metaReducers: MetaReducer<any>[] = !environment.production
  ? [storeFreeze]
  : [];

const monacoEditorConfig: NgxMonacoEditorConfig = {
  baseUrl: '/app/assets'
};

export const bootstrapDeps = [
  fromBootstrap.NgbTabsetModule,
  fromBootstrap.NgbDropdownModule,
  fromBootstrap.NgbCollapseModule,
  fromBootstrap.NgbTooltipModule,
  fromBootstrap.NgbModalModule,
  fromBootstrap.NgbPopoverModule,
  fromBootstrap.NgbTabsetModule,
  fromBootstrap.NgbPaginationModule,
  fromBootstrap.NgbButtonsModule,
  fromBootstrap.NgbAccordionModule,
  fromBootstrap.NgbAlertModule,
  fromBootstrap.NgbDatepickerModule,
  fromBootstrap.NgbTimepickerModule
];

@NgModule({
  imports: [
    CommonModule,
    MonitoringRoutingModule,
    NouisliderModule,
    FormsModule,
    ...bootstrapDeps,
    MonacoEditorModule.forRoot(monacoEditorConfig),
    CoreModule,
    DragDropModule,
    SharedModule,
    ChartConfiguratorModule,
    TableEditorModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule.forRoot(),
    StoreModule.forFeature('sharedmodule', sharedReducer),
    EffectsModule.forFeature(sharedEffects),
    NgbTimepickerModule
  ],
  declarations: [
    MonitoringComponent,
    DateFormatPipe,
    ChartComponent,
    ...components,
    ...containerComponents,
    ElementWrapperComponent,

  ],
  providers: [
    ...services,
    NewPanelService,
    ChartService,
    { provide: RouterStateSerializer, useClass: CustomSerializer }
  ]
})
export class MonitoringModule { }
