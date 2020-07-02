import { Action } from '@ngrx/store';
import { CfAuthScope } from '../../../chart-configurator/model/cfAuthScope';
import { Panel } from '../../../shared/model/panel';
import { PanelElement } from 'app/monitoring/shared/model/panel-element';
import { AuthScope } from 'app/monitoring/chart-configurator/model/authScope';

export const ADD_ELEMENT_TO_PANEL = '[Panel Configurator] Add Element to Panel';
export const DELETE_ELEMENT_IN_PANEL =
  '[Panel Configurator] Delete Element in Panel';

export const SET_NAME = '[Panel Configurator] Set Name';
export const SET_DESCRIPTION = '[Panel Configurator] Set Description';
export const SET_AUTH_SCOPE = '[Panel Configurator] Set AuthScope';
export const FLUSH_STATE = '[Panel Configurator] Flush State';

export const SET_STATE_FOR_UPDATE = '[Panel Configurator] Set State for Update';



export class AddElementToPanel implements Action {
  readonly type = ADD_ELEMENT_TO_PANEL;
  constructor(public payload: PanelElement) { }
}
export class DeleteElementInPanel implements Action {
  readonly type = DELETE_ELEMENT_IN_PANEL;
  constructor(public payload: string) { }
}
export class SetName implements Action {
  readonly type = SET_NAME;
  constructor(public payload: string) { }
}
export class SetDescription implements Action {
  readonly type = SET_DESCRIPTION;
  constructor(public payload: string) { }
}
export class FlushState implements Action {
  readonly type = FLUSH_STATE;
}
export class SetAuthScope implements Action {
   readonly type = SET_AUTH_SCOPE;
  constructor(public payload: AuthScope) { }
}
export class SetStateForUpdate implements Action {
  readonly type = SET_STATE_FOR_UPDATE;
  constructor(public payload: Panel) { }
}

export type PanelIncreationAction =
  | AddElementToPanel
  | DeleteElementInPanel
  | SetName
  | SetDescription
  | FlushState
  | SetAuthScope
  | SetStateForUpdate;
