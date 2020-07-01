import { Component, OnInit, Input, EventEmitter, OnDestroy, AfterViewInit, HostListener, } from '@angular/core';
import { Hits } from '../../../model/search-response';
import { Observable, Subscription, Subject, throwError as observableThrowError } from 'rxjs';
import { ServiceBinding } from 'app/monitoring/model/service-binding';

import { SearchService } from 'app/monitoring/shared/services/search.service';
import { tap, filter, take, map } from 'rxjs/operators';
import { LogDataModel } from 'app/monitoring/model/log-data-model';
import { Store } from '@ngrx/store';
import { BindingsState, } from '../../../shared/store/reducers/binding.reducer';
import { ElasticContextQuery } from '../../../shared/model/elastic-context-query';
import { NotificationService, Notification, NotificationType } from '../../../../core/notification.service';
import { authScopeFromBinding } from '../../../chart-configurator/model/cfAuthScope';
import { getAllBindingsEntities } from '../../../shared/store/selectors/bindings.selector';
import { HighlightingAndHits } from '../log-list/log-list.component';

@Component({
  selector: 'sb-log-context-explorer',
  templateUrl: './log-context-explorer.component.html',
  styleUrls: ['./log-context-explorer.component.scss']
})
export class LogContextExplorerComponent implements OnInit, OnDestroy {

  @Input('mainLogMsg')
  logMessage: LogDataModel

  scope: Partial<ServiceBinding> = {};

  loadingSubject = new Subject<boolean>();
  loading$ = new Observable<boolean>(k => this.loadingSubject.subscribe(k));

  hitsSubject = new Subject<Hits | HighlightingAndHits>();
  hits$ = new Observable<Hits | HighlightingAndHits>(k => this.hitsSubject.subscribe(k));

  constructor(
    private searchService: SearchService,
    private store: Store<BindingsState>,
    private notificationService: NotificationService
  ) { }


  ngOnDestroy() {

  }


  ngOnInit() {
    this.fireContextSearchRequest();
  }


  fireContextSearchRequest() {
    this.buildContextSearchRequest().pipe(filter(k => !(k instanceof Error))).subscribe((req: ElasticContextQuery) => {
      this.fireRequest(req).subscribe((data: Hits) => {
        let index: number;
        for (let i = 0; i < data.hits.length; i++) {
          if (data.hits[i]._source.logMessage == this.logMessage._source.logMessage) {
            index = i
          }
        }
        let highlightsAndHits: Hits | HighlightingAndHits;
        if (index!!) {
          // Index starts at zero monaco line numers at 1 so we have to add something to it
          index!! += 1;
          highlightsAndHits = {
            hits: data.hits,
            highlightRange: new monaco.Range(index!!, 1, index!!, 1),
            scrollTo: 0,
          } as HighlightingAndHits
        } else {
          highlightsAndHits = data;
        }
        this.loadingSubject.next(false);
        this.hitsSubject.next(highlightsAndHits);
      });
    });
  }


  private buildContextSearchRequest(): Observable<ElasticContextQuery | Error> {
    let binding: ServiceBinding;
    return this.store.select(getAllBindingsEntities).pipe(
      tap(k => console.log(k)),
      filter(k => !!k),
      map((k: Array<ServiceBinding>) => k.filter(bind => bind.appId == this.logMessage._source.appId)), take(1),
      map(k => {
        if (k) {
          binding = k[0]
          return {
            authScope: authScopeFromBinding(binding!!),
            appId: binding!!.appId,
            sourceInstance: this.logMessage._source.sourceInstance,
            size: 100,
            index: this.logMessage._index,
            timestamp: this.logMessage._source.timestamp
          } as ElasticContextQuery;
        } else {
          const errorMsg = "Binding for app is Missing";
          console.error(errorMsg);
          this.notificationService.addSelfClosing(new Notification(NotificationType.Error, errorMsg, undefined));
          observableThrowError(errorMsg);
          return new Error();
        }
      }));
  }



  private fireRequest(request: ElasticContextQuery): Observable<Hits> {
    this.loadingSubject.next(true);
    return this.searchService.getChronologicalContext(request).pipe(
      tap((data: Array<LogDataModel>) => {
        if (!data) {
          const errorMsg = "no data found, CHECK YOUR REQUEST"
          console.error(errorMsg);
          this.notificationService.addSelfClosing(new Notification(NotificationType.Error, errorMsg, undefined));
        }
      }),
      filter((data: Array<LogDataModel>) => !!data),
      map(data => { return { total: data.length, max_score: 1, hits: data } as Hits })
    );
  }



}