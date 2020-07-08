import { throwError as observableThrowError, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { EndpointService } from "./endpoint.service";
import { HttpClient } from "@angular/common/http";
import { SearchRequest } from "../../model/search-request";
import { SearchResponse } from "../../model/search-response";
import { NotificationType, NotificationService, Notification } from "app/core";
import { catchError, map } from "rxjs/operators";
import { Field } from "app/monitoring/aggregation-editor/model/field";
import { AggregationRequestObject } from "app/monitoring/chart-configurator/model/aggregationRequestObject";
import { Panel } from "../model/panel";
import { QueryAndResponse } from "../model/query-and-response";
import { ElasticContextQuery } from "../model/elastic-context-query";
import { LogDataModel } from "../../model/log-data-model";
import { ESQuery } from "app/monitoring/table-editor/model/es-query";
import { ServiceBinding } from "app/monitoring/model/service-binding";
import { ESQuery_Request } from "app/monitoring/table-editor/model/es-query-request";
import {
  CfAuthScope,
  authScopeFromBinding
} from "app/monitoring/chart-configurator/model/cfAuthScope";
import { environment } from "environments/runtime-environment";
import { ESBoolQueryRawResponseMap } from "app/monitoring/table-editor/model/es-bool-query-result";

@Injectable()
export class SearchService {
  private httpOptions = this.endpoint.httpOptions;
  constructor(
    private endpoint: EndpointService,
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  // BOOLQuery POST /v1/queries/run
  public run(bool_query_request: ESQuery_Request): Observable<any> {
    const url = this.endpoint.getUri() + "/queries" + "/run";
    const body = bool_query_request.jsonify();
    return this.http.post<ESBoolQueryRawResponseMap>(url, body);
  }

  public getSearchResults(
    request: SearchRequest
  ): Observable<SearchResponse | any> {
    const endpoint = this.endpoint.getUri() + "/search";
    return this.http.post(endpoint, request, this.httpOptions).pipe(
      map((data: any) => data),
      catchError((error: any) => {
        this.notification.addSelfClosing(
          new Notification(NotificationType.Error, error.message)
        );
        return observableThrowError(error);
      })
    );
  }

  public firePanelAggregation(
    request: Panel,
    range?: { [id: string]: any }
  ): Observable<{ [id: string]: Array<QueryAndResponse> }> {
    console.log("FIREING AGGREGATION for panel " + request.id);
    const endpoint = this.endpoint.getUri() + "/panel/aggregation";
    const requestObject = { first: request, second: range };
    return this.http
      .post<{ [id: string]: Array<QueryAndResponse> }>(endpoint, requestObject)
      .pipe(
        catchError((error: any) => {
          console.log("AGGREGATION FAILED");
          /*this.notification.addSelfClosing(
          new Notification(NotificationType.Error, 'aggregation failed!')
        );*/
          return observableThrowError(error);
        })
      );
  }

  public fireAggregation(
    request: Array<AggregationRequestObject>
  ): Observable<Array<SearchResponse>> {
    const endpoint = this.endpoint.getUri() + "/aggregation";
    return this.http.post<Array<SearchResponse>>(endpoint, request).pipe(
      catchError((error: any) => {
        this.notification.addSelfClosing(
          new Notification(NotificationType.Error, "aggregation failed!")
        );
        return observableThrowError(error);
      })
    );
  }

  public getMappings(): Observable<Map<string, Array<string> | any>> {
    const endpoint = this.endpoint.getUri() + "/mappings";
    return this.http.get(endpoint, this.httpOptions).pipe(
      map((dataAsObject: any) => {
        const datas = new Map<string, any>(Object.entries(dataAsObject));
        const returnVal = new Map<string, Array<string>>();
        datas.forEach((data, index) => {
          Object.keys(data["mappings"]["_doc"]["properties"]).forEach(item => {
            const property = data["mappings"]["_doc"]["properties"][item];
            returnVal[index] = returnVal[index]
              ? returnVal[index]
              : new Array<string>();

            // Some Fields have a Subfield. For more information see Ticket MONF-56
            if (!property["fields"]) {
              returnVal[index] = [...returnVal[index], item];
            } else {
              returnVal[index] = [...returnVal[index], item];
              returnVal[index] = [
                ...returnVal[index],
                ...Object.keys(property.fields).map(k => `${item}.${k}`)
              ];
            }
          });
        });
        return returnVal;
      }),
      catchError((error: any) => {
        this.notification.addSelfClosing(
          new Notification(NotificationType.Error, error.error.message)
        );
        return observableThrowError(error.json);
      })
    );
  }

  public getChronologicalContext(
    data: ElasticContextQuery
  ): Observable<Array<LogDataModel>> {
    const endpoint = this.endpoint.getUri() + "/search/context";
    return this.http
      .post<Array<LogDataModel>>(endpoint, data, this.httpOptions)
      .pipe(
        catchError((error: any) => {
          this.notification.addSelfClosing(
            new Notification(NotificationType.Error, error.error.message)
          );
          return observableThrowError(error.json);
        })
      );
  }

  public getMappingWithType(): Observable<Map<string, Array<Field>>> {
    const endpoint = this.endpoint.getUri() + "/mappings";
   
    return this.http.get(endpoint, this.httpOptions).pipe(
      map((dataAsObject: Map<string, any>) => {
        const returnVal = new Map<string, Array<Field>>();
        const datas = new Map<string, any>(Object.entries(dataAsObject));
        datas.forEach((data, key) => {
          
          Object.keys(data["mappings"]["_doc"]["properties"]).forEach(item => {
            const property = data["mappings"]["_doc"]["properties"][item];
            returnVal[key] = returnVal[key]
              ? returnVal[key]
              : new Array<string>();
            if (!property["fields"]) {
              returnVal[key] = [
                ...returnVal[key],
                { key: item, value: { type: property["type"] } } as Field
              ];
            } else {
              returnVal[key] = [
                ...returnVal[key],
                {
                  key: item + "." + Object.keys(property["fields"])[0],
                  value: { type: Object.keys(property["fields"])[0] }
                } as Field
              ];
            }
          });
        });
        return returnVal;
      }),
      catchError((error: any) => {
        console.log(error);
        this.notification.addSelfClosing(
          new Notification(NotificationType.Error, error.error.message)
        );
        return observableThrowError(error.json);
      })
    );
  }
}
