import { ServiceBinding } from '../../model/service-binding';
import { environment } from '../../../../environments/runtime-environment';
import { AuthScope } from './authScope';

export interface KcAuthScope extends AuthScope {
  
  partnerId: String;
  customerId: String;
}

