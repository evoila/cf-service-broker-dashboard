import { ServiceBinding, BindingAuthMetadata, BindingTypeIdentifier } from "./service-binding";
import { CfAuthScope } from "../chart-configurator/model/cfAuthScope";

export interface ServiceBrokerServiceBinding extends ServiceBinding{
    /*bindingId?: string;
    appName: string;
    appId: string;
    authScope: CfAuthScope;
    timestamp: Number;
    deprecated: boolean;
    type: BindingTypeIdentifier;*/
  
    organization: string;
    space: string;

  }

  export interface SpaceAndOrg extends BindingAuthMetadata {
    space: string;
    org: string;
  }