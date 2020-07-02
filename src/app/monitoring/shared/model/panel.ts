import { CfAuthScope } from '../../chart-configurator/model/cfAuthScope';
import { PanelElement } from './panel-element';
import { AuthScope } from 'app/monitoring/chart-configurator/model/authScope';
export interface Panel {
  readonly id?: string;
  authScope: AuthScope;
  elements: Array<PanelElement>;
  name: string;
  description: string;
}
