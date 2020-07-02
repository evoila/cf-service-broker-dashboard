import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from '../../shared/services/search.service';
import { ServiceBinding } from '../../model/service-binding';
import { timer, Subscription, Subject, Observable } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { SearchRequest, TimeRange } from '../../model/search-request';
import { SearchResponse, Hits } from '../../model/search-response';
import * as moment from 'moment/moment';
import { TimeService } from '../../shared/services/time.service';
import { ShortcutService } from '../../../core/services/shortcut.service';
import { HighlightingAndHits } from '../../components/log-messages/log-list/log-list.component';
import { authScopeFromBinding } from 'app/monitoring/chart-configurator/model/cfAuthScope';

@Component({
  selector: 'sb-live-logs',
  templateUrl: './live-logs.component.html',
  styleUrls: ['./live-logs.component.scss']
})
export class LiveLogsComponent implements OnInit, OnDestroy {
  scope: ServiceBinding = {} as ServiceBinding;
  streaming: boolean = false;
  private fromDate: any;
  private toDate: any;
  hits: Hits;
  private streamSub: Subscription;
  appId: string;
  buttonDisabled: boolean = false;

  //Observable to pass data to subcomponent
  hitSubject = new Subject<Hits | HighlightingAndHits>();
  hits$ = new Observable<Hits | HighlightingAndHits>(k => this.hitSubject.subscribe(k));

  /* 
     Config-Values 
     for Request-Scheduling 
  */
  private subscriptions: Array<Subscription> = [];

  interval = 5000;
  // amount of lines being polled
  size = 400;
  // maximal Number of Log-Messages displayed
  maxElements = 5000;

  constructor(private searchService: SearchService,
    private timeService: TimeService,
    private shortcut: ShortcutService
  ) { }

  ngOnInit() {

    const sub = this.shortcut.bindShortcut({
      key: "Enter",
      description: "Trigger Search Request",
      view: "Search Logs View"
    }).subscribe(k => {
      if (Object.keys(this.scope).length) {
        this.toggleStream();
      }
    });
    this.subscriptions = [...this.subscriptions, sub];
  }
  ngOnDestroy() {
    if (this.streamSub) {
      this.streamSub.unsubscribe();
    }
    if (this.subscriptions.length) {
      this.subscriptions.forEach(k => k.unsubscribe());
    }
  }
  setScope(scope: ServiceBinding) {
    if (Object.keys(scope).length) {
      this.scope = scope;
      this.buttonDisabled = false;
    }
    else {
      this.buttonDisabled = true;
    }

  }

  toggleStream() {
    if (this.scope) {
      this.streaming = !this.streaming;

      if (this.streaming) {
        this.hits = undefined!!;
        this.streamSub = timer(500, this.interval).pipe(
          switchMap(k => {
            const request = this.buildSearchRequest();
            return this.searchService.getSearchResults(request).pipe(
              filter((data: SearchResponse) => !data.timed_out && data.hits.total !== 0)
            )

          })).subscribe((data: SearchResponse) => {
            if (data.hits.hits) {
              // set from Date to the last to date value 
              this.fromDate = this.toDate;
            }
            if (!this.hits) {
              this.hits = data.hits;
            } else {
              this.hits = { ...this.hits, hits: [...data.hits.hits, ...this.hits.hits] };
            }
            this.hits = this.reduceSize(this.hits);
            this.hitSubject.next(this.hits);
          });
      }
      else {
        this.hits = undefined!!;
        this.hitSubject.next({} as Hits);
        this.fromDate = undefined;
        this.streamSub.unsubscribe();
      }

    }
  }

  private reduceSize(hits: Hits) {
    const offSet = hits.hits.length - this.maxElements;
    if (offSet > 0) {
      hits.hits.splice(hits.hits.length - offSet, offSet);
    }
    return hits;

  }
  private buildSearchRequest() {

    let searchRequest = {
      appName: this.scope.appName,
      authScope: authScopeFromBinding(this.scope),
      docSize: {
        from: 0,
        size: this.size
      }
    } as SearchRequest;


    searchRequest.range = new TimeRange();
    // save current Date to have a well defined Timestamp of the last included element --> avoid dups
    this.toDate = this.timeService.getNumericalTimestamp(moment());
    searchRequest.range.to = this.toDate;
    // Subsequential Request have a from Date to not have duplicates
    if (this.fromDate) {
      searchRequest.range.from = this.fromDate;
    }
    return searchRequest;
  }
}
