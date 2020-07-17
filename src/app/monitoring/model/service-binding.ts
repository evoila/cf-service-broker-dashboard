import { AuthScope } from "../chart-configurator/model/authScope";

export interface ServiceBinding {
  bindingId?: string;
  appName: string;
  appId: string;
  authScope: AuthScope;
  timestamp: Number;
  deprecated: boolean;
  type: BindingTypeIdentifier; // 'servicebroker' or 'managementportal'

}

export enum BindingTypeIdentifier {
  SERVICEBROKER = 'servicebroker',
  MANAGEMENTPORTAL = 'managementportal'
}

// this is a superclass for either SpaceAndOrg or PartnerAndCustomer
export interface BindingAuthMetadata {
  type: string;
}
