import { ServiceBinding } from '../../model/service-binding';
import { environment } from '../../../../environments/runtime-environment';
import { AuthScope } from './authScope';
import { KcAuthScope } from './kcAuthScope';

export interface CfAuthScope extends AuthScope {
  type: string;
  serviceInstanceId: string;
  orgId: string;
  spaceId: string;
  
}

export function authScopeFromBinding(binding: ServiceBinding): AuthScope {
  //binding.organization_guid
  if (binding.type == 'servicebroker'){
    return  binding.authScope as CfAuthScope;
  }
  else if (binding.type == 'managementportal'){
    return  binding.authScope as KcAuthScope;
  }
  else{ // unknown
    // throw error here!
    return {
      type: 'unknown',
      serviceInstanceId: environment.serviceInstanceId,
      partnerId: '',
      customerId: '',
    } as AuthScope
  }
  
  
}

