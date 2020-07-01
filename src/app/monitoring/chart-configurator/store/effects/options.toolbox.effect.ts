import { Injectable, OnInit } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromOptionsToolbox from '../actions/options.toolbox.action';
import { Store } from '@ngrx/store';
import { withLatestFrom, switchMap } from 'rxjs/operators';
import {
  getChartIncreationOptions,
  getChartIncreationOptionsSet
} from '../selectors/chart.increation.selector';
import { ChartOptionsEntity } from '../../model/chart-options-entity';
import { SetChartOptions } from '../actions/chart.increation.action';

import { of, Observable } from 'rxjs';
import { ChartIncreationState } from '../reducers/chart.increation.reducer';


@Injectable()
export class OptionsToolboxEffect implements OnInit {
  private latestFromStore = () => {
    return withLatestFrom(
      this.store.select(getChartIncreationOptionsSet),
      this.store.select(getChartIncreationOptions)
    )
  };

  // The purpose of this Method is to initialize vairables if not set to not spread an undefined Object
  private initializeIfNotSet(data: any, objectKey: string) {
    return data.options[objectKey] ? data.options[objectKey] : {};
  }

  private loadAndDispatch = (closure: (optionsEntity: ChartOptionsEntity, data?: any) => ChartOptionsEntity) => {
    return switchMap((payload: [any, boolean, ChartOptionsEntity]): Observable<
      SetChartOptions | fromOptionsToolbox.UpdateOptionsFail
    > => {
      if (payload[0]) {
        const data = payload[0]['payload'];
        const optionsEntity: ChartOptionsEntity = {
          ...payload[2]
        };
        const newOptionsState = data ? closure(optionsEntity, data) : closure(optionsEntity);
        return of(new SetChartOptions(newOptionsState));
      }
      return this.returnError();
    });
  }
  private returnError = () =>
    of(new fromOptionsToolbox.UpdateOptionsFail('options not Set'));


  @Effect()
  disabledAnimations$ = this.actions.pipe(ofType(fromOptionsToolbox.SET_ANIMATION_DISABLED), 
  this.latestFromStore(),
    this.loadAndDispatch((optionsEntity, data) => {
      return {
        ...optionsEntity,
        options: {
          ...optionsEntity.options,
          animation: false
        }
      } as ChartOptionsEntity;
    }
    ));


  @Effect()
  setAnimation$ = this.actions.pipe(ofType(fromOptionsToolbox.SET_ANIMATION),
    this.latestFromStore(),
    this.loadAndDispatch((optionsEntity, data) => {
      // has to be set because spread-operator on undefined will cause an runtime error
      const animationObject = this.initializeIfNotSet(optionsEntity, 'animation');
      return {
        ...optionsEntity,
        options: {
          ...optionsEntity.options,
          animation: {
            ...animationObject,
            easing: data
          }
        }
      }
    })
  )

  /*---- Ledgends ----*/
  @Effect()
  setLedgendDisabled$ = this.actions
    .pipe(ofType(fromOptionsToolbox.SET_LEDGEND_DISABLED),
      this.latestFromStore(),
      this.loadAndDispatch((optionsEntity, data) => {
        const ledgendObject = this.initializeIfNotSet(optionsEntity, 'legend');
        return {
          ...optionsEntity,
          options: {
            ...optionsEntity.options,
            legend: { ...ledgendObject, display: false }
          }
        };
      })
    );

  @Effect()
  setLedgendPosition$ = this.actions
    .pipe(ofType(fromOptionsToolbox.SET_LEDGEND_POSITION),
      this.latestFromStore(),
      this.loadAndDispatch((optionsEntity, data) => {
        const ledgendObject = this.initializeIfNotSet(optionsEntity, 'legend');
        return {
          ...optionsEntity,
          options: {
            ...optionsEntity.options,
            legend: {
              ...ledgendObject,
              display: true,
              position: data
            }
          }
        };
      })
    );

  @Effect()
  setTitleDisabled$ = this.actions.
    pipe(ofType(fromOptionsToolbox.SET_TITLE_DISABLED),
      this.latestFromStore(),
      this.loadAndDispatch((optionsEntity, data) => {
        const titleObject = this.initializeIfNotSet(optionsEntity, 'title');
        return {
          ...optionsEntity,
          options: {
            ...optionsEntity.options,
            title: {
              ...titleObject,
              display: false
            }
          }
        };
      })
    )



  @Effect()
  setTitlePosition$ = this.actions.
    pipe(ofType(fromOptionsToolbox.SET_TITLE_POSITION),
      this.latestFromStore(),
      this.loadAndDispatch((optionsEntity, data) => {
        const titleObject = this.initializeIfNotSet(optionsEntity, 'title');
        return {
          ...optionsEntity,
          options: {
            ...optionsEntity.options,
            title: {
              ...titleObject,
              display: true,
              position: data
            }
          }
        };
      })
    )

  @Effect()
  setTitle$ = this.actions.
    pipe(ofType(fromOptionsToolbox.SET_TITLE),
      this.latestFromStore(),
      this.loadAndDispatch((optionsEntity, data) => {
        const titleObject = this.initializeIfNotSet(optionsEntity, 'title');
        return {
          ...optionsEntity,
          options: {
            ...optionsEntity.options,
            title: {
              ...titleObject,
              display: true,
              text: data
            }
          }
        };
      })
    )

  constructor(
    private actions: Actions,
    private store: Store<ChartIncreationState>
  ) { }

  ngOnInit() { }
}

