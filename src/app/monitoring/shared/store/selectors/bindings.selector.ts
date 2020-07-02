import { createSelector } from '@ngrx/store';
import * as fromBindings from '../reducers/binding.reducer';
import { SharedModuleState, getSharedModuleState } from '../reducers/index';
import { ServiceBrokerServiceBinding, SpaceAndOrg } from 'app/monitoring/model/service-broker-service-binding';
import { ManagementPortalServiceBinding, PartnerAndCustomer } from 'app/monitoring/model/management-portal-service-binding';
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


// Returns a Single Space and Org object for ServiceBroker Bindings
export const getServiceBrokerBindingsSpaceAndOrg = createSelector(
  getAllBindingsEntities,
  (entities: Array<ServiceBrokerServiceBinding>) => {
    return entities.length == 0 ? { space: "", org: "" } : entities
      .map(entity => {
        return {
          org: entity.authScope.orgId,
          space: entity.space
        } as SpaceAndOrg;
      })
      .reduce(k => k) as SpaceAndOrg;
  }
);

// Returns a Single Partner and Customer object for Managementportal Bindings
export const getManagementPortalBindingsPartnerAndCustomer = createSelector(
  getAllBindingsEntities,
  (entities: Array<ManagementPortalServiceBinding>) => {
    return entities.length == 0 ? { partner: "", customer: "" } : entities
      .map(entity => {
        return {
          partner: entity.partner,
          customer: entity.customer
        } as PartnerAndCustomer;
      })
      .reduce(k => k) as PartnerAndCustomer;
  }
);


