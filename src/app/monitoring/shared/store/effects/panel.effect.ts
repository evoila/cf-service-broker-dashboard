import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PanelService } from '../../services/panel.service';
import { map, catchError, switchMap } from 'rxjs/operators';
import {
  LOAD_PANELS,
  LoadPanelsSuccess,
  LoadPanelsFailed
} from '../actions/panel.action';
import { of } from 'rxjs';
import { UPDATE_PANEL, UpdatePanel, DELETE_PANEL, DeletePanel } from '../actions/panel.action';
import {
  SAVE_PANEL,
  SavePanel,
  SavePanelSuccess,
  SavePanelFailed
} from '../actions/panel.action';

@Injectable()
export class PanelEffect {
  @Effect()
  loadPanel$ = this.actions.pipe(ofType(LOAD_PANELS),
    switchMap(action =>
      this.panelService.getPanels().pipe(
        map(result => new LoadPanelsSuccess(result)),
        catchError(error => of(new LoadPanelsFailed()))
      )
    )
  );

  @Effect()
  savePanel$ = this.actions.pipe(ofType(SAVE_PANEL),
    switchMap((action: SavePanel) =>
      this.panelService.createChart(action.payload).pipe(
        map(k => new SavePanelSuccess()),
        catchError(error => of(new SavePanelFailed()))
      )
    )
  );

  @Effect()
  updatePanel$ = this.actions.pipe(ofType(UPDATE_PANEL),
    switchMap((action: UpdatePanel) =>
      this.panelService.updatePanel(action.payload).pipe(
        map(k => new SavePanelSuccess()),
        catchError(error => of(new SavePanelFailed()))
      )
    )
  )

  @Effect()
  deletePanel$ = this.actions.pipe(ofType(DELETE_PANEL),
    switchMap((action: DeletePanel) =>
      this.panelService.deletePanel(action.payload).pipe(
        map(k => new SavePanelSuccess()),
        catchError(error => of(new SavePanelFailed()))
      )
    )
  )

  constructor(private actions: Actions, private panelService: PanelService) { }
}
