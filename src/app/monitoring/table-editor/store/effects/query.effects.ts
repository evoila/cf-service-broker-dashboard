import { Injectable } from '@angular/core';
import { ESQueryService } from '../../services/es-query.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as queryAction from '../actions/query.action';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { catchError, map } from 'rxjs/internal/operators';
import { of } from 'rxjs';
import { SearchService } from 'app/monitoring/shared/services/search.service';
import { ESBoolQueryRawResponseMap } from '../../model/es-bool-query-result';
import { authScopeFromBinding } from 'app/monitoring/chart-configurator/model/cfAuthScope';
import { ESQuery_Request } from '../../model/es-query-request';

@Injectable()
export class ESQueriesEffect {

  constructor(
    private actions: Actions,
    private esQueryService: ESQueryService,
    private searchService: SearchService
  ) {}


  @Effect()
  loadQueries$ = this.actions.pipe(ofType(queryAction.LOAD_QUERIES),
    switchMap(() => {
      return this.esQueryService.getESQueries().pipe(
        map(queries => new queryAction.LoadQueriesSuccess(queries!!)),
        catchError(error => of(new queryAction.LoadQueriesFail(error)))
      );
    })
  );


  @Effect()
  saveQuery$ = this.actions.pipe(ofType(queryAction.SAVE_QUERY),
    switchMap((action: queryAction.SaveQuery) => {
      return this.esQueryService.createESQuery(action.payload).pipe(
        map(query => new queryAction.SaveQuerySuccess(query!!)),
        catchError(error => of(new queryAction.SaveQueryFail()))
      );
    })
  );


  @Effect()
  runQuery$ = this.actions.pipe(ofType(queryAction.RUN_QUERY),
    switchMap((action: queryAction.RunQuery) => {
      const authScope = authScopeFromBinding(action.scope);
      const boolQueryRequest = new ESQuery_Request(action.scope.appId, 10, authScope, action.payload);
      // HARDCODED QUERY INDEX FOR MATCHALL TESTQUERY
      boolQueryRequest.index = "2020-07-08-jobs";

      return this.searchService.run(boolQueryRequest).pipe(
        map(bool_query_result => new queryAction.RunQuerySuccess(this.addQueryId(bool_query_result, action.payload.id!!), boolQueryRequest)),
        catchError(error => of(new queryAction.RunQueryFail(error)))
      );
    })
  );





  public addQueryId(result: ESBoolQueryRawResponseMap, id: string){
    result.queryId = id;
    return result;
  }



  
}