import { createSelector } from '@ngrx/store';
import * as fromBindings from '../reducers/binding.reducer';
import { SharedModuleState, getSharedModuleState } from '../reducers/index';
import { ServiceBrokerServiceBinding, SpaceAndOrg } from 'app/monitoring/model/service-broker-service-binding';
import { ManagementPortalServiceBinding, PartnerAndCustomer } from 'app/monitoring/model/management-portal-service-binding';
import { BindingTypes, ServiceBinding } from '../../../model/service-binding';
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

      return { space: "", org: "" }

    } else {
      let entity: any = entities[0];
      if (entity.type == BindingTypes.SERVICEBROKER) {

        entity = entity as ServiceBrokerServiceBinding;
        return {
          org: entity.authScope.orgId,
          space: entity.space
        } as SpaceAndOrg;

      } else {

        entity = entity as ManagementPortalServiceBinding;
        return {
          partner: entity.partner,
          customer: entity.customer
        } as PartnerAndCustomer;

      }
    }
  }
)




