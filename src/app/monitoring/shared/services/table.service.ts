import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from './endpoint.service';
import { AuthParameterService } from './auth-param.service';
import { flatMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { BindingsState } from '../store/reducers/binding.reducer';
import { Table } from '../model/table';

@Injectable()
export class TableService {
  private readonly url: string;
  private authParams: AuthParameterService;
  constructor(
    private http: HttpClient,
    private endpoint: EndpointService,
    storeBindings: Store<BindingsState>,
    cfAuthParams: AuthParameterService
  ) {
    this.authParams = cfAuthParams.construct(storeBindings);
    this.url = `${endpoint.getUri()}/tables`;
  }

  public getAllTables(): Observable<Array<Table>> {
    return this.authParams.createAuthParameters().pipe(
      flatMap(params => {
        return this.http.get<Array<Table>>(this.url, { params });
      })
    );
  }
  

  public createTable(table: Table): Observable<Table> {
       return this.http.post<Table>(this.url, table, this.endpoint.httpOptions).pipe(
         map(data => data));
  }
  
  public deleteTable(tableId: string): Observable<Table> {
    const customUri = `${this.url}/${tableId}`;
        return this.http.delete<Table>(customUri, this.endpoint.httpOptions).pipe(
          map(data => data));
  }

  
}
