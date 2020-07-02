import { ServiceBinding, BindingSpecials } from "./service-binding";
import { CfAuthScope } from "../chart-configurator/model/cfAuthScope";

export interface ServiceBrokerServiceBinding extends ServiceBinding{
    bindingId: string | null;
    appName: string;
    appId: string;
    authScope: CfAuthScope;
    timestamp: Number;
    deprecated: boolean;
    type: string;
  
    organization: string;
    space: string;

  }

  export interface SpaceAndOrg extends BindingSpecials {
    space: string;
    org: string;
  }