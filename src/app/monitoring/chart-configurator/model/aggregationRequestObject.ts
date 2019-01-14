import { CfAuthScope } from './cfAuthScope';
import { Aggregation } from './aggregation';
export interface AggregationRequestObject {
  aggregation: Aggregation;
  appId?: string;
  authScope?: CfAuthScope;
  name?: string;
}
