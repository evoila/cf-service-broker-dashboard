import { AuthScope } from "../chart-configurator/model/authScope";

export interface ServiceBinding {
  bindingId: string | null;
  appName: string;
  appId: string;
  authScope: AuthScope;
  timestamp: Number;
  deprecated: boolean;
  type: string; // 'servicebroker' or 'managementportal'

}


// this is a superclass for either SpaceAndOrg or PartnerAndCustomer
export interface BindingSpecials {
  

}
