import { Component, OnInit } from '@angular/core';
import { ChartIncreationState } from '../../store/reducers/chart.increation.reducer';
import { Store } from '@ngrx/store';
import {
  getChartIncreationType,
  buildChart
} from '../../store/selectors/chart.increation.selector';
import { filter, switchMap, map, take, tap } from 'rxjs/operators';
import { LoadAggregations } from '../../store/actions/aggregation.action';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { LoadOptions } from '../../store/actions/options.action';
import { Chart } from '../../../shared/model/chart';
import { CfAuthScope } from '../../model/cfAuthScope';
import { SaveChart } from '../../../shared/store/actions/chart.actions';
import { ChartModelState } from 'app/monitoring/shared/store/reducers/chart.reducer';
import { getChartSaved } from '../../../shared/store/selectors/chart.selector';
import {
  FlushState,
  SetChartType,
  SetChartOptions
} from '../../store/actions/chart.increation.action';
import { AuthParameterService } from '../../../shared/services/auth-param.service';
import { BindingsState } from '../../../shared/store/reducers/binding.reducer';
import { Router } from '@angular/router';
import * as chartTypes from '../../model/chart-types';
import { getOptionsState } from '../../store/selectors/options.selector';
import { SetChartName } from '../../store/actions/chart.increation.action';
import { SetTitle } from '../../store';
import { ChartOptionsEntity } from '../../model/chart-options-entity';

@Component({
  selector: 'sb-single-view-editor',
  templateUrl: './single-view-editor.component.html',
  styleUrls: ['./single-view-editor.component.scss']
})
export class SingleViewEditorComponent implements OnInit {
  chartTypes: Array<string>;
  chartType: string;
  name: string;
  options: Array<ChartOptionsEntity>;
  editorPresent: boolean = false;

  authParamService: AuthParameterService;
  constructor(
    private store: Store<ChartIncreationState>,
    private chartModelStore: Store<ChartModelState>,
    storeBindings: Store<BindingsState>,
    authParamService: AuthParameterService,
    private router: Router
  ) {
    this.authParamService = authParamService.construct(storeBindings);
  }

  ngOnInit() {
    this.store
      .select(getChartIncreationType)
      .pipe(filter(k => k != ''))
      .subscribe(type => {
        this.chartType = type;
        this.store.dispatch(new LoadAggregations(type));
        this.store.dispatch(new LoadOptions(type));
      });
    this.chartTypes = Object.keys(chartTypes.chartObjectForType);
    this.store
      .select(getOptionsState)
      .pipe(
        filter(state => state.loaded),
        filter(state => Object.keys(state.entities).length > 0),
        map(state => {
          return Array.from(
            new Map(Object.entries(state.entities))[Symbol.iterator]()
          ).map(k => k[1]);
        })
      )
      .subscribe(enteties => {
        this.options = enteties
        this.store.dispatch(new SetChartOptions(enteties[0]))
      }
      );
  }

  beforeChange($event: NgbTabChangeEvent) {
    if (
      ($event.nextId === 'aggregations' || $event.nextId === 'chartoptions') &&
      !this.chartType
    ) {
      $event.preventDefault();
    }
  }
  public setChartType(chartType: string) {
    this.store.dispatch(new SetChartType(chartType));
  }
  public setName(name: string) {
    this.store.dispatch(new SetChartName(name));
    this.store.dispatch(new SetTitle(name));
    this.name = name;
  }
  public setChartOption(option: ChartOptionsEntity) {
    this.store.dispatch(new SetChartOptions(option))
  }

  setOnEdit(value: boolean) {
    this.editorPresent = value;
  }

  public save() {
    this.store
      .select(buildChart)
      .pipe(
        take(1),
        tap((k: any) => {
          if (!Object.keys(k).length || !k.name || !k.type) {
            alert(
              'Your chart is missing something. Better check the sate of your aggregations and remove the broke ones'
            );
          }
          return k;
        }),
        filter((k: any) => {
          return Object.keys(k).length > 0 && k.name && k.type;
        }),
        switchMap((chart: Chart) => {
          return this.authParamService.createAuthScope().pipe(
            take(1),
            map((authScope: CfAuthScope) => {
              return { ...chart, authScope };
            }),
            map((chart: Chart) =>
              this.chartModelStore.dispatch(new SaveChart(chart))
            ),
            switchMap(k => {
              return this.chartModelStore.select(getChartSaved).pipe(
                take(2),
                map(getChartSaved => {
                  if (getChartSaved) {
                    this.store.dispatch(new FlushState());
                    this.router.navigate(['monitoring/panelconfigurator']);
                  }
                })
              );
            })
          );
        })
      )
      .subscribe();
  }
  public cancel() {
    this.store.dispatch(new FlushState());
    this.router.navigate(['monitoring/panelconfigurator']);
  }
}
