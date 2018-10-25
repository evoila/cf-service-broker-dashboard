
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EndpointService } from './endpoint.service';
import { HttpClient } from '@angular/common/http';
import { SearchRequest } from './model/search-request';
import { SearchResponse } from './model/search-response';
import { Response } from '@angular/http/src/static_response';
import { NotificationType, NotificationService, Notification } from 'app/core';
import { error } from 'selenium-webdriver';




@Injectable()
export class SearchService {
  private httpOptions = this.endpoint.httpOptions;
  constructor(private endpoint: EndpointService,
    private http: HttpClient,
    private notification: NotificationService

  ) { }
  public getSearchResults(request: SearchRequest): Observable<SearchResponse> {
    const endpoint = this.endpoint.getUri() + '/search'
    return this.http.post(endpoint, request, this.httpOptions).map(
      (data: Response) => data
    )
      .catch((error: any) => {
        console.log(error);
        this.notification.addSelfClosing(new Notification(NotificationType.Error, error.error.message));
        return observableThrowError(error.error.message);
      })
  }
  public getMappings(): Observable<Array<string>> {
    const endpoint = this.endpoint.getUri() + '/mappings'
    return this.http.get(endpoint, this.httpOptions).map(
      (data) => {
        let returnVal: Array<String> = [];
        Object.keys(data['mappings']['logMessages']['properties']).forEach(
          (item) => {
            const property = data['mappings']['logMessages']['properties'][item];
            //Some Fields have a Subfield. For more information see Ticket MONF-56
            if (!property['fields']) {
              returnVal = [...returnVal, item];
            } else {
              returnVal = [...returnVal, item + '.' + Object.keys(property['fields'])[0]]
            }
          }
        )
        return returnVal;
      }
    ).catch((error: any) => {
      console.log(error);
      this.notification.addSelfClosing(new Notification(NotificationType.Error, error.error.message));
      return observableThrowError(error.json);
    })
  }
}
