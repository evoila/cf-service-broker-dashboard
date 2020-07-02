import { KcAuthScope } from "../chart-configurator/model/kcAuthScope";
import { ServiceBinding, BindingSpecials } from "./service-binding";

export interface ManagementPortalServiceBinding extends ServiceBinding{
    bindingId: string | null;
    appName: string;
    appId: string;
    authScope: KcAuthScope;
    timestamp: Number;
    deprecated: boolean;
    type: string;
  
    partner: string;
    customer: string;

  }

  export interface PartnerAndCustomer extends BindingSpecials{
    partner: string;
    customer: string;
  }
  