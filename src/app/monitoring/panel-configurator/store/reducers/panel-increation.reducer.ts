import { CfAuthScope } from '../../../chart-configurator/model/cfAuthScope';
import * as fromPanelIncreation from '../actions/panel-increation.action';
import * as uuid from 'uuid';
import { ChartInPanel } from '../../../model/chart-in-panel';
import { PanelElement } from 'app/monitoring/shared/model/panel-element';
import { element } from 'protractor';
import { TableInPanel } from 'app/monitoring/model/table-in-panel';
import { AuthScope } from 'app/monitoring/chart-configurator/model/authScope';


export interface PanelIncreationState {
  id?: string;
  elements: { [id: string]: PanelElement };
  name: string;
  description: string;
  authScope: AuthScope;
  onEdit: boolean;
}
export const initialState: PanelIncreationState = {
  elements: {},
  name: '',
  description: '',
  authScope: {} as CfAuthScope,
  onEdit: false
};

export function reducer(
  state = initialState,
  action: fromPanelIncreation.PanelIncreationAction
) {
  switch (action.type) {
    case fromPanelIncreation.ADD_ELEMENT_TO_PANEL: {
      // element is a TableInPanel or a ChartInPanel
     const added_element = action.payload;
      return {
        ...state,
        elements: { ...state.elements, [uuid.v4()]: added_element }
      };
    }
    case fromPanelIncreation.DELETE_ELEMENT_IN_PANEL: {
      const charts = { ...state.elements };
      delete charts[action.payload];
      return {
        ...state,
        charts
      };
    }
    case fromPanelIncreation.SET_NAME: {
      return {
        ...state,
        name: action.payload
      };
    }
    case fromPanelIncreation.SET_DESCRIPTION: {
      return {
        ...state,
        description: action.payload
      };
    }
    case fromPanelIncreation.SET_AUTH_SCOPE: {
      return {
        ...state,
        authScope: action.payload
      };
    }
    case fromPanelIncreation.FLUSH_STATE: {
      return initialState;
    }
    case fromPanelIncreation.SET_STATE_FOR_UPDATE: {
      const { id, authScope, elements, name, description } = action.payload
      //console.log(id, authScope, elements, name, description);
      // deconstruct from PanelElement Datatype to normal Datatype [ Chart | TABLE ]
      /*

      

       */

      const newElements = elements.reduce<{ [id: string]: PanelElement }>(
        (prev, curr, index, arr) => {
          if (index == 0) {
            return { [uuid.v4()]: curr }
          }
          return { ...prev, [uuid.v4()]: curr }
        }, {}
      )
      //console.log('Panel Increation Action SET_STATE_FOR_UPDATE new elements:');
      //console.log(newElements);
      return {
        id,
        authScope,
        elements: newElements,
        name,
        description,
        onEdit: true
      }
    }
  }
  return state;
}

export const getCharts = (state: PanelIncreationState) => state.elements;
