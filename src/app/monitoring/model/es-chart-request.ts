import { ChartRequest } from './chart-request';
import { AuthScope } from '../chart-configurator/model/authScope';

export class EsChartRequest implements ChartRequest {
    index: string; //ElastcSearch Index to Search in 
    doctype: string;
    appId?: string;
    appName?: string;
    range: any;
    authScope: AuthScope;
    chartId: string;
    order: number;
    size?: number;
    name: string;
    
}
