import { createSelector } from '@ngrx/store';
import { getPanelState, PanelConfiguratorState } from '../reducers/index';
import {
  getCharts,
  PanelIncreationState
} from '../reducers/panel-increation.reducer';
import { Panel } from '../../../shared/model/panel';
import { Chart } from '../../../shared/model/chart';
import { ChartInPanel } from '../../../model/chart-in-panel';
import { PanelElement } from 'app/monitoring/shared/model/panel-element';
import { TableInPanel } from 'app/monitoring/model/table-in-panel';
import { CfAuthScope } from 'app/monitoring/chart-configurator/model/cfAuthScope';
import { KcAuthScope } from 'app/monitoring/chart-configurator/model/kcAuthScope';

export const getPanelIncreationState = createSelector(
  getPanelState,
  (state: PanelConfiguratorState) => state.panelIncreation
);

export const getPanelIncreationElements = createSelector(
  getPanelIncreationState,
  getCharts
);

export const getPanelNameAndDescription = createSelector(
  getPanelIncreationState,
  (state) => {
    return { name: state.name, description: state.description };
  }
)

export const buildFunctionalPanel = createSelector<
  PanelIncreationState,
  PanelIncreationState,
  Panel
>(
  getPanelIncreationState,
  (state: PanelIncreationState) => {
    state.elements;
    const elements = constructElement(deconstructElements(state.elements));
    let panel = {
      authScope: state.authScope,
      elements,
      name: state.name,
      description: state.description
    } as Panel;
    panel = state.id ? { ...panel, id: state.id } : panel;
    return panel;
  }
);

export const panelReadyForBuild = createSelector(
  getPanelIncreationState,
  state =>
    ((state.authScope as CfAuthScope).orgId &&
    (state.authScope as CfAuthScope).spaceId) || ((state.authScope as KcAuthScope).customerId &&
    (state.authScope as KcAuthScope).partnerId) &&
    !!state.name
);

export const getPanelOnEdit = createSelector(
  getPanelIncreationState,
  state => state.onEdit
);

function deconstructElements(obj: any): PanelElement[] {
  return Array.from(new Map(Object.entries(obj))[Symbol.iterator]()).map(
    k => k[1] as PanelElement
  );
}
function constructElement(arr: PanelElement[]) {
  return arr.map((element, order) => {
    const size = element.size ? element.size : 100;
    if (element.type == 'chart') {
      return { chart: (element as ChartInPanel).chart, order: order, size: size, type: element.type, id: element.id };
    }
    else{
      return { table: (element as TableInPanel).table, order: order, size: size, type: element.type, id: element.id };
    }
  });
}

