import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ulid } from 'ulid'
import { Observable, Subject } from 'rxjs';
import { Aggregation } from 'app/monitoring/chart-configurator/model/aggregation';
import { AggregationRequestObject } from 'app/monitoring/chart-configurator/model/aggregationRequestObject';
import { Store } from '@ngrx/store';
import { ChartIncreationState } from 'app/monitoring/chart-configurator/store/reducers/chart.increation.reducer';
import { getChartIncreationAggregations, DeleteChartAggregations, SetChartAggregations, EditAggregation } from 'app/monitoring/chart-configurator/store';
import { AuthParameterService } from 'app/monitoring/shared/services/auth-param.service';
import { BindingsState } from 'app/monitoring/shared/store/reducers/binding.reducer';
import { take, filter } from 'rxjs/operators';

@Component({
  selector: 'sb-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit {
  @Input()
  aggregations$: Observable<Array<Aggregation>>;


  // Output Emitter is just a toggle for the Component above to render AggregationEditor
  @Output('aggregationEditor')
  public openAggregationEditor$ = new EventEmitter<string>();

  entries: { [id: string]: AggregationRequestObject };

  authParamService: AuthParameterService;

  constructor(
    private store: Store<ChartIncreationState>,
    authParamService: AuthParameterService,
    storeBindings: Store<BindingsState>
  ) {
    this.authParamService = authParamService.construct(storeBindings);
  }

  ngOnInit() {
    this.store.select(getChartIncreationAggregations).pipe(filter(k => JSON.stringify(this.entries) != JSON.stringify(k))).subscribe(
      k => this.entries = { ...k }
    )
  }

  add() {
    this.store.dispatch(new SetChartAggregations({} as AggregationRequestObject, ulid()));
  }

  pushAggregation(aggregation: Aggregation, id: string) {

    this.authParamService
      .createAuthScope()
      .pipe(take(1))
      .subscribe(authScope => {
        const aggregationRq = {
          aggregation,
          authScope
        } as AggregationRequestObject;
        if (Object.keys(aggregation).length > 0) {
          this.store.dispatch(new SetChartAggregations(aggregationRq, id));
        }
      });
  }

  setAggregationEditor(id: string) {
    this.openAggregationEditor$.emit(id);
  }
  delete(id: string) {
    this.store.dispatch(new DeleteChartAggregations(id));
    delete this.entries[id];
  }
}
