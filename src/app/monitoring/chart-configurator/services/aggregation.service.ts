import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '../../shared/services/endpoint.service';
import { AuthParameterService } from '../../shared/services/auth-param.service';
import { Aggregation } from '../model/aggregation';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { MonitoringModule } from '../../monitoring.module';
import { BindingsState } from '../../shared/store/reducers/binding.reducer';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: MonitoringModule })
export class AggregationService {
  private readonly url: string;
  private readonly endpoint = '/charting/aggregations';
  private authParamService: AuthParameterService;

  constructor(
    private http: HttpClient,
    private endpointService: EndpointService,
    authParamService: AuthParameterService,
    storeBindings: Store<BindingsState>
  ) {
    this.authParamService = authParamService.construct(storeBindings);
    this.url = this.endpointService.getUri() + this.endpoint;
  }

  public getAllAggregations(chartType: string): Observable<Array<Aggregation>> {
    return this.authParamService.createAuthParameters().pipe(
      flatMap(param => {
        const params = param.append('chartType', chartType);
        return this.http.get<Array<Aggregation>>(this.url, { params });
      })
    );
  }

  public createAggregation(aggregation: Aggregation): Observable<Aggregation> {
    return this.http.put<Aggregation>(this.url, aggregation);
  }

  public updateAggregation(aggregation: Aggregation): Observable<Aggregation> {
    const url = `${this.url}/${aggregation.id}`;
    return this.http.post<Aggregation>(url, aggregation);
  }
  public deleteAggregation(aggregationId: string): Observable<Aggregation> {
    const url = `${this.url}/${aggregationId}`;
    return this.http.delete<Aggregation>(url);
  }
}
