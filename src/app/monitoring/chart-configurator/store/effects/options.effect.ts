import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';

import * as optionActions from '../actions/options.action';
import { map, switchMap, catchError, take } from 'rxjs/internal/operators';
import { OptionsService } from '../../services/options.service';
import { environment } from '../../../../../environments/runtime-environment';

import { OptionsRequestObject } from '../../model/options-request-object';
import {
  LoadOptionsSuccess,
  LoadOptionsFail,
  BindingAction
} from 'app/monitoring/chart-configurator/store';
import { of } from 'rxjs/internal/observable/of';
import { Store } from '@ngrx/store';

import { getBindingsAuthMetadata} from '../../../shared/store/selectors/bindings.selector';
import { CfAuthScope } from '../../model/cfAuthScope';
import { BindingTypeIdentifier } from 'app/monitoring/model/service-binding';
import { ServiceBrokerServiceBinding, SpaceAndOrg } from 'app/monitoring/model/service-broker-service-binding';
import { KcAuthScope } from '../../model/kcAuthScope';
import { PartnerAndCustomer } from 'app/monitoring/model/management-portal-service-binding';


@Injectable()
export class OptionsEffects {
  // Mocked entitis until Binding Service ist part of the ngrx-Store Concept
  private readonly mockedSpace = 'servicebroker-dev';
  private readonly mockedOrg = 'a6cec6a0-f163-4601-a573-484c9743bfa6';
  
  private request = {
    chartType: '',
    authScope: {
      type: 'cf',
      serviceInstanceId: environment.serviceInstanceId,
      orgId: this.mockedOrg,
      spaceId: this.mockedSpace
    }  as CfAuthScope
    
  } as OptionsRequestObject;

  @Effect()
  loadOptions$ = this.actions.pipe(ofType(optionActions.LOAD_OPTIONS),
    switchMap((chartType: optionActions.LoadOptions) => {
      return this.optionsStore.select(getBindingsAuthMetadata).pipe(
        take(1),
        switchMap(bindingsMeta => {
          
          if(bindingsMeta.type == BindingTypeIdentifier.SERVICEBROKER){
            (this.request.authScope as CfAuthScope).spaceId = (bindingsMeta as SpaceAndOrg).space;
            (this.request.authScope as CfAuthScope).orgId = (bindingsMeta as SpaceAndOrg).org;
          }
          else if(bindingsMeta.type == BindingTypeIdentifier.MANAGEMENTPORTAL){
            (this.request.authScope as KcAuthScope).partnerId = (bindingsMeta as PartnerAndCustomer).partner;
            (this.request.authScope as KcAuthScope).customerId = (bindingsMeta as PartnerAndCustomer).customer;
          }
          this.request.chartType = chartType.payload;
          return this.optionService.getOptions(this.request).pipe(
            map(options => new LoadOptionsSuccess(options)),
            catchError(error => of(new LoadOptionsFail(error)))
          );
        }),
        catchError(error => of(new LoadOptionsFail(error)))
      );
    })
  );
  constructor(
    private actions: Actions,
    private optionService: OptionsService,
    private optionsStore: Store<BindingAction>
  ) {}
}
