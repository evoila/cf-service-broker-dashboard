import { ChartOptions } from 'chart.js';
import { OptionsRequestObject } from 'app/monitoring/chart-configurator/model/options-request-object';
import { AuthScope } from './authScope';

export class ChartOptionsEntity {
  public id?: string;
  public authScope?: AuthScope;  
  public public?: boolean;
  public options: ChartOptions;
  public chartTypes?: Array<string>;
  public name?: string;
}
