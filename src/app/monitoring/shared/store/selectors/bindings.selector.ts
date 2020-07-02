import { createSelector } from '@ngrx/store';
import * as fromBindings from '../reducers/binding.reducer';
import { SharedModuleState, getSharedModuleState } from '../reducers/index';
import { ServiceBrokerServiceBinding } from 'app/monitoring/model/service-broker-service-binding';
import { ManagementPortalServiceBinding } from 'app/monitoring/model/management-portal-service-binding';
import { BindingTypeIdentifier, ServiceBinding, BindingAuthMetadata } from '../../../model/service-binding';
/*
 * Binding State
 */

export const getAllBindingsState = createSelector(
  getSharedModuleState,
  (state: SharedModuleState) => state.bindings
);

export const getAllBindingsEntities = createSelector(
  getAllBindingsState,
  fromBindings.getBindingsEntities
);

export const getAllBindingsLoaded = createSelector(
  getAllBindingsState,
  fromBindings.getBindingsLoaded
);

export const getAllBindingsLoading = createSelector(
  getAllBindingsState,
  fromBindings.getBindingsLoading
);

export const getBindingsLoadingState = createSelector(
  getAllBindingsState,
  state => {
    return {
      loading: state.loading,
      loaded: state.loaded
    };
  }
);



export const getBindingsAuthMetadata = createSelector(
  getAllBindingsEntities,
  (entities: Array<ServiceBinding>) => {
    if (entities.length == 0) {

      return { type: "" }

    } else {
      let entity: any = entities[0];
      if (entity.type == BindingTypeIdentifier.SERVICEBROKER) {

        entity = entity as ServiceBrokerServiceBinding;
        return {
          org: entity.authScope.orgId,
          space: entity.space,
          type: BindingTypeIdentifier.SERVICEBROKER
        } as BindingAuthMetadata;

      } else {

        entity = entity as ManagementPortalServiceBinding;
        return {
          partner: entity.partner,
          customer: entity.customer,
          type: BindingTypeIdentifier.MANAGEMENTPORTAL
        } as BindingAuthMetadata;

      }
    }
  }
)




