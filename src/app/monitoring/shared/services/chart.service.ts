import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from './endpoint.service';
import { CfAuthParameterService } from './cfauth-param.service';
import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Chart } from '../model/chart';
import { Store } from '@ngrx/store';
import { BindingsState } from '../store/reducers/binding.reducer';

@Injectable()
export class ChartService {
  private readonly url: string;
  private cfAuthParams: CfAuthParameterService;
  constructor(
    private http: HttpClient,
    endpoint: EndpointService,
    storeBindings: Store<BindingsState>,
    cfAuthParams: CfAuthParameterService
  ) {
    this.cfAuthParams = cfAuthParams.construct(storeBindings);
    this.url = `${endpoint.getUri()}/charting/charts`;
  }

  public getAllCharts(): Observable<Array<Chart>> {
    return this.cfAuthParams.createCfAuthParameters().pipe(
      flatMap(params => {
        return this.http.get<Array<Chart>>(this.url, { params });
      })
    );
  }
  public createChart(chart: Chart): Observable<Chart> {
    return this.http.put<Chart>(this.url, chart);
  }

  public deleteChart(chartId: string): Observable<Chart> {
    const customUri = `${this.url}/${chartId}`;
    return this.http.delete<Chart>(customUri);
  }
}
