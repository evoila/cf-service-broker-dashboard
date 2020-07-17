import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthParameterService } from 'app/monitoring/shared/services/auth-param.service';
import { ChartIncreationState } from 'app/monitoring/chart-configurator/store/reducers/chart.increation.reducer';
import { Store } from '@ngrx/store';
import { BindingsState } from 'app/monitoring/shared/store/reducers/binding.reducer';
import { ServiceBinding } from 'app/monitoring/model/service-binding';
import { AggregationRequestObject } from 'app/monitoring/chart-configurator/model/aggregationRequestObject';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'sb-scoping',
  templateUrl: './scoping.component.html',
  styleUrls: ['./scoping.component.scss']
})
export class ScopingComponent implements OnInit {
  @Input('aggregation')
  aggregation$: Observable<AggregationRequestObject>;

  @Output('aggRequObj')
  aggReqEmitter = new EventEmitter<AggregationRequestObject>();

  serviceBinding: ServiceBinding = {} as ServiceBinding;
  private name: string = 'preview'

  aggRequObj: AggregationRequestObject;

  private authParamService: AuthParameterService;
  constructor(
    private store: Store<ChartIncreationState>,
    storeBindings: Store<BindingsState>,
    authParamService: AuthParameterService
  ) {
    this.authParamService = authParamService.construct(storeBindings);
  }

  ngOnInit() {
    this.aggregation$.subscribe(k => {
      this.aggRequObj = k;
      this.update(k);
    });
    this.aggregation$.subscribe(k => console.log(k));
  }
  public updateId(binding: ServiceBinding) {
    this.serviceBinding = binding;
    this.updateWithLast();
  }
  updateWithLast() {
    this.update(this.aggRequObj);
  }
  public update(aggregation: AggregationRequestObject) {
    if (this.serviceBinding && aggregation && Object.keys(aggregation).length) {
      const { name } = this;
      const { appId } = this.serviceBinding;
      const updatedAgg = {
        ...aggregation,
        name,
        appId
      } as AggregationRequestObject;
      this.aggReqEmitter.emit(updatedAgg);
    }
  }

}
