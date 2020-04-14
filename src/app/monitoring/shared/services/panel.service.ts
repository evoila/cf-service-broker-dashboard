import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from './endpoint.service';
import { CfAuthParameterService } from './cfauth-param.service';
import { Store } from '@ngrx/store';
import { BindingsState } from '../store/reducers/binding.reducer';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Panel } from '../model/panel';

@Injectable()
export class PanelService {
  private readonly url: string;
  private cfAuthParams: CfAuthParameterService;

  constructor(
    private http: HttpClient,
    endpoint: EndpointService,
    cfAuthParams: CfAuthParameterService,
    storeBindings: Store<BindingsState>
  ) {
    this.cfAuthParams = cfAuthParams.construct(storeBindings);
    this.url = `${endpoint.getUri()}/charting/panel`;
  }


  // I think the author of this method ment to name it getAllPanels
  public getAllCharts(): Observable<Array<Panel>> {
    return this.cfAuthParams.createCfAuthParameters().pipe(
      flatMap(params => {
        return this.http.get<Array<Panel>>(this.url, { params });
      })
    );
  }
  public createChart(chart: Panel): Observable<Panel> {
    return this.http.put<Panel>(this.url, chart);
  }
  public updatePanel(panel: Panel): Observable<Panel> {
    const url = this.url + `/${panel.id}`;
    //console.log(JSON.stringify(panel));
    return this.http.post<Panel>(url, panel);
  }
  public deletePanel(panelId: string): Observable<Panel> {
    const url = this.url + `/${panelId}`;
    return this.http.delete<Panel>(url);
  }
}
