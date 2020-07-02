import { KcAuthScope } from "../chart-configurator/model/kcAuthScope";
import { ServiceBinding, BindingAuthMetadata, BindingTypeIdentifier} from "./service-binding";

export interface ManagementPortalServiceBinding extends ServiceBinding{
    /*bindingId?: string;
    appName: string;
    appId: string;
    authScope: KcAuthScope;
    timestamp: Number;
    deprecated: boolean;
    type: BindingTypeIdentifier;*/
  
    partner: string;
    customer: string;

  }

  export interface PartnerAndCustomer extends BindingAuthMetadata{
    partner: string;
    customer: string;
  }
  