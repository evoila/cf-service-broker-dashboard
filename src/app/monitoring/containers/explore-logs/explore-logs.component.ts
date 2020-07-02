import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Filter } from 'app/monitoring/model/filter';
import { ServiceBinding } from '../../model/service-binding';
import { SearchRequest, TimeRange } from '../../model/search-request';
import { SearchService } from '../../shared/services/search.service';
import { Hits, SearchResponse } from '../../model/search-response';
import { Subject, Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { tap, filter, timestamp } from 'rxjs/operators';
import { NotificationService, Notification, NotificationType } from '../../../core/notification.service';
import * as moment from 'moment/moment';
import { TimeService } from '../../shared/services/time.service';
import { ShortcutService } from '../../../core/services/shortcut.service';
import { LogFilterComponent } from '../../components/log-messages/log-filter/log-filter.component';
import { HighlightingAndHits } from '../../components/log-messages/log-list/log-list.component';
import { authScopeFromBinding } from 'app/monitoring/chart-configurator/model/cfAuthScope';

@Component({
  selector: 'sb-explore-logs',
  templateUrl: './explore-logs.component.html',
  styleUrls: ['./explore-logs.component.scss']
})
export class ExploreLogsComponent implements OnInit, OnDestroy {
  @ViewChild(LogFilterComponent) logFilter;

  fromDate: any = moment().subtract(2, "days").unix();
  toDate: any = moment().unix();
  // formatted locale compact string to show on screen
  timeInfo: string = "";
  timeErrorInfo: string = "";
  filter: Filter;
  scope: Partial<ServiceBinding> = {};
  hits: Hits;

  loadingSubject = new Subject<boolean>();
  loading$ = new Observable<boolean>(k => this.loadingSubject.subscribe(k));

  showFilter = false;

  hitsSubject = new Subject<Hits | HighlightingAndHits>();
  hits$ = new Observable<Hits | HighlightingAndHits>(k => this.hitsSubject.subscribe(k));

  private subscriptions: Array<Subscription> = [];

  // needed for the scoping component as an input
  appId: string;

  // General Configs 
  // number of entries that are polled 
  size = 5000

  lastRequestTimeStamp: number;

  // in a request where not all the data is fetched you need a pointer to the index
  // of the last request you made
  requestPointer: number = 0;

  constructor(
    private searchService: SearchService,
    private notification: NotificationService,
    private timeService: TimeService,
    private shortcut: ShortcutService) { }

  ngOnInit() {
    const sub = this.shortcut.bindShortcut({
      key: "Enter",
      description: "Trigger Search Request",
      view: "Search Logs View"
    }).subscribe(k => {
      if (Object.keys(this.scope).length) {
        this.fireSearchRequest();
      }
    });
    this.setDateInfo();
    this.subscriptions = [...this.subscriptions, sub];
  }

  ngOnDestroy() {
    if (this.subscriptions.length) {
      this.subscriptions.forEach(k => {
        k.unsubscribe();
      });
    }
  }
  fireSearchRequest() {
    const request = this.buildSearchRequest();
    this.lastRequestTimeStamp = moment().unix();
    this.requestPointer = 0;
    this.fireRequest(request).subscribe((data: SearchResponse) => {
      this.loadingSubject.next(false);
      this.hits = data.hits
      this.hitsSubject.next(this.hits);
    });
  }

  showAddFilterDialouge() {
    this.logFilter.addFilter();
  }

  appendLogs() {
    this.toDate = this.toDate ? this.toDate : this.lastRequestTimeStamp;
    this.requestPointer += 300;
    const request = this.buildSearchRequest(this.requestPointer);
    this.fireRequest(request).subscribe((data: SearchResponse) => {
      this.loadingSubject.next(false);
      this.hits.hits = [...this.hits.hits, ...data.hits.hits];
      this.hitsSubject.next(this.hits);
    })
  }

  updateFilters(filter: Filter) {
    this.filter = filter;
  }
  setToDate(toDate: Number) {
    this.toDate = toDate;
    this.setDateInfo();
  }
  setFromDate(fromDate: Number) {
    this.fromDate = fromDate;
    this.setDateInfo();
  }
  setScope(scope: ServiceBinding) {
    if (scope) {
      this.scope = scope;
      this.appId = scope.appId;
    }
  }

  setDateInfo() {
    const from = new Date((this.fromDate as number) * 1000);
    const to = new Date((this.toDate as number) * 1000);
    const fromParts = { day: from.getUTCDate(), month: from.getUTCMonth() + 1, year: from.getUTCFullYear(), hour: from.getHours(), minute: from.getMinutes() };
    const toParts = { day: to.getUTCDate(), month: to.getUTCMonth() + 1, year: to.getUTCFullYear(), hour: to.getHours(), minute: to.getMinutes() };

    if (fromParts.year == toParts.year && fromParts.month == toParts.month && fromParts.day == toParts.day) {
      // startdate and enddate today -> display only hours and minutes
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

  private buildSearchRequest(from = 0): SearchRequest {

    let searchRequest = {
      appName: this.scope.appName,
      authScope: authScopeFromBinding(this.scope as ServiceBinding),
      filter: this.filter,
      docSize: {
        from,
        size: this.size
      }
    } as SearchRequest;


    searchRequest.range = new TimeRange();
    searchRequest.range.to = this.toDate ? this.timeService.convertUnixToNumerical(this.toDate) : undefined;
    searchRequest.range.from = this.fromDate ? this.timeService.convertUnixToNumerical(this.fromDate) : undefined;

    return searchRequest;
  }
  private fireRequest(request: SearchRequest): Observable<SearchResponse> {
    this.loadingSubject.next(true);
    return this.searchService.getSearchResults(request).pipe(
      tap((data: SearchResponse) => {
        if (!data.timed_out && data.hits.total === 0) {
          this.loadingSubject.next(false);
          this.notification.addSelfClosing(
            new Notification(
              NotificationType.Info,
              'No Data. Check your request.'
            )
          )
        }
      }),
      filter((data: SearchResponse) => !data.timed_out && data.hits.total !== 0)
    );
  }
}
