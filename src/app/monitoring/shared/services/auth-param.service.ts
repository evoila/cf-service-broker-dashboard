import { BindingsState } from '../store/reducers/binding.reducer';
import { Store } from '@ngrx/store';
import { filter, switchMap, map, take } from 'rxjs/operators';
import {
  getAllBindingsLoaded,
  getServiceBrokerBindingsSpaceAndOrg,
  getAllBindingsEntities,
  getManagementPortalBindingsPartnerAndCustomer
} from '../store/selectors/bindings.selector';

import { SpaceAndOrg } from 'app/monitoring/model/service-broker-service-binding';
import { Injectable } from '@angular/core';
import { LoadBindings } from '../../chart-configurator/store';
import { CfAuthScope } from '../../chart-configurator/model/cfAuthScope';
import { environment } from '../../../../environments/runtime-environment';
import { HttpGetParamsService } from '../../../core/services/http-get-params.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { ChartConfiguratorModule } from '../../chart-configurator/chart-configurator.module';
import { getBindingsLoadingState } from '../store/selectors/bindings.selector';
import { timer } from 'rxjs';
import { AuthScope } from 'app/monitoring/chart-configurator/model/authScope';
import { KcAuthScope } from 'app/monitoring/chart-configurator/model/kcAuthScope';
import { BindingSpecials } from 'app/monitoring/model/service-binding';
import { PartnerAndCustomer } from 'app/monitoring/model/management-portal-service-binding';

@Injectable({ providedIn: ChartConfiguratorModule })
export class AuthParameterService {
  private bindingSpecials$: Observable<BindingSpecials>;
  private store: Store<BindingsState>;


  public createAuthParameters(): Observable<HttpParams> {
    return this.createAuthScope().pipe(
      map((authScope: AuthScope) =>
        this.paramService.convertParams(authScope)
      )
    );
  }

  public createAuthScope(): Observable<AuthScope> {
    const { serviceInstanceId } = environment;
    const type = this.getBindingType() == 'servicebroker' ? 'cf' : 'kc';
    if (type == 'cf'){
      return this.bindingSpecials$.pipe(
        map(orgAndSpace => {
          return {
            type: 'cf',
            orgId: (orgAndSpace as SpaceAndOrg).org,
            spaceId: (orgAndSpace as SpaceAndOrg).space,
            serviceInstanceId
          } as CfAuthScope;
        })
      );
    }
    else if (type == 'kc'){
      return this.bindingSpecials$.pipe(
        map(partAndCust => {
          return {
            type: 'kc',
            customerId: (partAndCust as PartnerAndCustomer).customer,
            partnerId: (partAndCust as PartnerAndCustomer).partner,
            serviceInstanceId
          } as KcAuthScope;
        })
      );
    }
    else{
      // Throw Error here!
      return new Observable<AuthScope>()
    }
    
    
  }

  /*

OLD LOGIC OF CONSTRUCT METHOD ONLY SUITABLE FOR CF SERVICEBROKER BINDINGS

  public construct(store: Store<BindingsState>) {
    if (!this.store) {
      this.store = store;

      this.bindingSpecials$ = store.select(getBindingsLoadingState).pipe(
        filter(state => {
          // dispatch Event if
          !state.loaded &&
            !state.loading &&
            timer(8000).subscribe(k => this.store.dispatch(new LoadBindings()));

          return state.loaded == true;
        }),
        switchMap(k => store.select(getServiceBrokerBindingsSpaceAndOrg))
      );
    }
    return this;
  }
*/

  public construct(store: Store<BindingsState>) {
    /* This is a custom constructor function which is needed because dependency injection of the store fails because
    the store is not part of this shared module. So code that uses this service, has to use this function in order
    to access the store and retrieve data */
    if (!this.store) {
      this.store = store;
      store.select(getBindingsLoadingState).pipe(
        filter(state => {
          // dispatch Event if
          !state.loaded &&
            !state.loading &&
            timer(8000).subscribe(k => this.store.dispatch(new LoadBindings()));
          return state.loaded == true;
        })).subscribe(k => {
          // BindingsState is -loaded- here
          // go get the bindings array:
          store.select(getAllBindingsEntities).pipe(take(1)).subscribe(bindings => {
            if(bindings.length > 0 ){
              if (bindings[0].type == "servicebroker"){
                this.bindingSpecials$ = store.select(getServiceBrokerBindingsSpaceAndOrg);
              }
              else if (bindings[0].type == "managementportal"){
                this.bindingSpecials$ = store.select(getManagementPortalBindingsPartnerAndCustomer);
              }
            }
          });
        });
      }
      return this;
  }

  getBindingType() : string{
    
    this.store.select(getBindingsLoadingState).pipe(
     filter(state => {
       // dispatch Event if
       !state.loaded &&
         !state.loading &&
         timer(8000).subscribe(k => this.store.dispatch(new LoadBindings()));
       return state.loaded == true;
     })).subscribe(k => {
       // BindingsState is -loaded- here
       // go get the bindings array:
       this.store.select(getAllBindingsEntities).pipe(take(1)).subscribe(bindings => {
         if(bindings.length > 0 ){
           return bindings[0].type;
         }
         return "";
       });
     });
   return "";
}


  constructor(private paramService: HttpGetParamsService) { }
}
