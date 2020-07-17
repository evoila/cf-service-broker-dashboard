import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchService } from '../../shared/services/search.service';
import { SearchRequest, TimeRange } from '../../model/search-request';
import { ServiceBinding, BindingTypeIdentifier } from '../../model/service-binding';
import { Hits, SearchResponse } from '../../model/search-response';
import * as moment from 'moment/moment';
import { Subject, Observable } from 'rxjs';
import { tap, filter, catchError, switchMap } from 'rxjs/operators';
import { NotificationService, NotificationType, Notification } from '../../../core/notification.service';
import { TimeService } from '../../shared/services/time.service';
import { ShortcutService } from '../../../core/services/shortcut.service';
import { LogDataModel } from 'app/monitoring/model/log-data-model';
import { LogSearchComponent } from 'app/monitoring/components/log-messages/log-search/log-search.component';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { authScopeFromBinding } from 'app/monitoring/chart-configurator/model/cfAuthScope';
import { Store } from '@ngrx/store';
import { getBindingsLoadingState, getBindingsAuthMetadata } from '../../shared/store/selectors/bindings.selector';
import { BindingsState } from 'app/monitoring/shared/store/reducers/binding.reducer';

@Component({
  selector: 'sb-search-logs',
  templateUrl: './search-logs.component.html',
  styleUrls: ['./search-logs.component.scss'],
  animations: [
    trigger('swipeInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => out', [
        style({ transform: 'translateX(100%)' }),
        animate('0.3s ease')
      ])
    ])/*, 
    trigger('swipeInOut', [
      state('out', style({ transform: 'translateX(0)' })),
      transition('void => in', [
        style({ transform: 'translateX(-100%)' }),
        animate(140)
      ])    
    ])*/
  ]
})
export class SearchLogsComponent implements OnInit {

  @ViewChild(LogSearchComponent) logSearchComponentResultList;

  showFilter = false;
  scope: ServiceBinding = {} as ServiceBinding;
  query: string;
  queryInputHasFocus = false;
  public error: boolean = false;

  //number of elements per request
  size = 50;

  contextSearch: boolean = false;
  logContextSeed: LogDataModel;

  fromDate: any = moment().subtract(30, "days").unix();
  toDate: any = moment().unix();

  // formatted locale compact string to show on screen
  timeInfo: string = "";
  timeErrorInfo: string = "";
  hits: Hits;

  // Boolean Subject that emits wether there is an ongoing request
  loadingSubject = new Subject<boolean>();
  loading$ = new Observable<boolean>(k => this.loadingSubject.subscribe(k));

  // animations
  public direction: dir = 'in';

  /* Timestamp of the last request Important for pagination cause search results might 
  grow continuesly which would lead to broken indeces
 */
  lastRequestTimeStamp: number;

  hitsSubject = new Subject<Hits>();
  hits$ = new Observable<Hits>(k => this.hitsSubject.subscribe(k));

  page: number;

  mappings: Map<string, Array<string>>;
  esIndexes: Array<string>;
  // this variable tells wether the app is deployes in cf, tim or kubernetes mode
  deploymentEnvironment: string;

  elasticIndex: string;

  get isTimEnv(): boolean {
    return this.deploymentEnvironment == BindingTypeIdentifier.MANAGEMENTPORTAL;
  }


  constructor(
    private searchService: SearchService,
    private notification: NotificationService,
    private timeService: TimeService,
    private shortcut: ShortcutService,
    private store: Store<BindingsState>) { }

  ngOnInit() {
    this.shortcut.bindShortcut({
      key: "Enter",
      description: "Trigger Search Request",
      view: "Search Logs View"
    }).subscribe(k => {
      if (!this.buttonDisabled()) {
        this.search();
      }
    });
    this.setDateInfo();


    this.searchService.getMappings().subscribe(k => {
      this.mappings = k;
      this.esIndexes = Object.keys(this.mappings);
    });
    this.store.select(getBindingsLoadingState).pipe(
      filter(state => state.loaded == true), switchMap(k => this.store.select(getBindingsAuthMetadata))
    ).subscribe(k => {
      this.deploymentEnvironment = k.type
    });


  }

  setScope(event: ServiceBinding) {
    if (event) {
      this.scope = event;
    }
  }
  flick(page: number) {
    this.page = page;
    this.tooglePageNavigation();
  }

  setToDate(event: any) {
    this.toDate = event;
    this.setDateInfo();
  }

  setFromDate(event: any) {
    this.fromDate = event;
    this.setDateInfo();
  }

  setDateInfo() {
    const from = new Date((this.fromDate as number) * 1000);
    const to = new Date((this.toDate as number) * 1000);
    const fromParts = { day: from.getUTCDate(), month: from.getUTCMonth() + 1, year: from.getUTCFullYear(), hour: from.getHours(), minute: from.getMinutes() };
    const toParts = { day: to.getUTCDate(), month: to.getUTCMonth() + 1, year: to.getUTCFullYear(), hour: to.getHours(), minute: to.getMinutes() };

    if (fromParts.year == toParts.year && fromParts.month == toParts.month && fromParts.day == toParts.day) {
      // startdate and enddate at same day -> display only hours and minutes
      const today: Date = new Date();
      const todayParts = { day: today.getUTCDate(), month: today.getUTCMonth() + 1, year: today.getUTCFullYear() };
      const isToday: boolean = (todayParts.day == fromParts.day && todayParts.month == fromParts.month && todayParts.year == fromParts.year);
      this.timeInfo = `${isToday ? "" : `${this.simpleDate(fromParts.day, fromParts.month)}`} ${fromParts.hour > 9 ? "" : "0"}${fromParts.hour}:${fromParts.minute > 9 ? "" : "0"}${fromParts.minute}  -  ${toParts.hour > 9 ? "" : "0"}${toParts.hour}:${toParts.minute > 9 ? "" : "0"}${toParts.minute}`;
    }
    else {
      // startdate and enddate NOT same day -> display only days and month
      this.timeInfo = `${this.simpleDate(fromParts.day, fromParts.month)}  -  ${this.simpleDate(toParts.day, toParts.month)}`;
    }
    //show error hint, if enddate before startdate
    this.timeErrorInfo = from > to ? "enddate before startdate, please adjust to see logs" : "";
  }

  private simpleDate(day: number, month: number): string {
    const s = `${day > 9 ? "" : "0"}${day}.${month > 9 ? "" : "0"}${month}.`;
    return s;
  }

  buttonDisabled() {
    // Function that determins wether the button 
    // should be disabled due to missing user input
    return !(Object.keys(this.scope).length && this.query)
  }

  search() {
    const request = this.buildSearchRequest(0, true);
    this.lastRequestTimeStamp = moment().unix();
    this.page = 0;
    this.error = false;
    this.contextSearch = false;
    this.logSearchComponentResultList.isCollapsed = [];

    this.fireRequest(request).subscribe((data: SearchResponse) => {

      this.hits = data.hits;
      this.hitsSubject.next(this.hits);
    }, (error) => {

      if (error && error.error && error.error.error) {
        // get forwarded elastic search error
        var ese = error.error.error;
        if (ese) {
          // this line makes an no-result hint show up on gui, telling the user to check his search input
          this.error = true;
          /* // detailled error information is not shown to the user, but it could easily be done
          const errorType :String = ese.failed_shards[0].reason.caused_by.caused_by.type;  
          const errorReason :String = ese.failed_shards[0].reason.reason;
          const errorReasonDetail :String = ese.failed_shards[0].reason.caused_by.caused_by.reason;
          */
        }
        else {
          // unknown problem
          // error thrown because of network- or infrastructure problems
        }
      }

    });
  }

  private tooglePageNavigation() {
    const request = this.buildSearchRequest(this.page * this.size, false);
    this.loadingSubject.next(true);
    this.fireRequest(request).pipe(catchError(err => {
      this.loadingSubject.next(false);
      return Observable.throw(err);
    })).subscribe((data: SearchResponse) => {
      this.hits = data.hits
      this.hitsSubject.next(this.hits);
      this.loadingSubject.next(false);
    });
  }

  /*
    export class SearchRequest {
      public range?: TimeRange;
      public appId?: string;
      public appName: string;
      public authScope: AuthScope;
      public docSize?: DocSize;
      public query?: string;
      public filter: [Map<string, any>]
  }
  
  */

  private buildSearchRequest(from = 0, initialRequest: boolean): SearchRequest {

    let searchRequest = {
      appName: this.scope.appName,
      authScope: authScopeFromBinding(this.scope),
      query: this.query,
      docSize: {
        from,
        size: this.size
      },
      index: this.elasticIndex
    } as SearchRequest;


    searchRequest.range = new TimeRange();

    /* Whenever a user chooses a date in the future his intention is to get the 
    newest possible entries. However when navigating through the pagination a date 
    in the future is harmfull because it destroys the pagination. Therefore we fix the
    initial request timestamp as newest possible log */

    if (!initialRequest && this.toDate > moment().unix()) {
      searchRequest.range.to = this.timeService.convertUnixToNumerical(this.lastRequestTimeStamp);
    } else {
      searchRequest.range.to = this.toDate ? this.timeService.convertUnixToNumerical(this.toDate) : undefined;
    }

    searchRequest.range.from = this.fromDate ? this.timeService.convertUnixToNumerical(this.fromDate) : undefined;

    return searchRequest;
  }
  private fireRequest(request: SearchRequest): Observable<SearchResponse> {
    return this.searchService.getSearchResults(request).pipe(
      tap((data: SearchResponse) => {
        if (!data.timed_out && data.hits.total === 0) {
          this.notification.addSelfClosing(
            new Notification(
              NotificationType.Info,
              'No Data. Check your request.'
            )
          );
          this.error = true;
        }
      }),
      filter((data: SearchResponse) => !data.timed_out && data.hits.total !== 0)
    );
  }


  onLostFocusQueryInput() {
    this.queryInputHasFocus = false;
  }

  onGotFocusQueryInput() {
    this.queryInputHasFocus = true;
  }


  did_select_index(index) {
    this.elasticIndex = index;
  }
}

type dir = 'in' | 'out';

