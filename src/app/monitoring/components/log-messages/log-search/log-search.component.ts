import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Hits } from '../../../model/search-response';
import { Observable, Subscription } from 'rxjs';
import { ShortcutService } from '../../../../core/services/shortcut.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { tap, debounceTime, filter } from 'rxjs/operators';
import { LogDataModel } from 'app/monitoring/model/log-data-model';

@Component({
  selector: 'sb-log-search',
  templateUrl: './log-search.component.html',
  animations: [
    trigger('flyInOut', [
      state('notReversed, reversed', style({ transform: 'translateX(0)' })),
      transition('void => notReversed', [
        style({ transform: 'translateX(150%)' }),
        animate(140)
      ]),
      transition('reversed => void', [
        animate(100, style({ transform: 'translateX(150%)' }))
      ]),
      transition('notReversed => void', [
        animate(100, style({ transform: 'translateX(-150%)' }))
      ]),
      transition('void => reversed', [
        style({ transform: 'translateX(-150%)' }),
        animate(140)
      ])
    ])
  ],
  styleUrls: ['./log-search.component.scss']
})
export class LogSearchComponent implements OnInit, OnDestroy {
  @Input('hits')
  hits$: Observable<Hits>;
  @Input('pagination')
  page: number;

  @Input('isTimEnv')
  isTimEnv: boolean;

  @Input('steps')
  public steps: number;

  @Input('inputFocus')
  searchInputHasFocus: boolean = false;

  @Output('toggleContextSearch')
  toggleContextSearch = new EventEmitter<boolean>();

  @Output('logContextSeed')
  logContextSeedEmitter = new EventEmitter<LogDataModel>();
  // hacky export to access it in template
  json = JSON;

  public pages: number;
  private hits$Subscription: Subscription;

  public direction: reversed = 'notReversed';

  showSingleLogContext = false;
  logContextSeed: LogDataModel;

  // the list row index , a log-context-explore-component is shown for
  selectedRow: number;

  // array containing the Interval of Pages that should be visible in navigation
  pageInterval: Array<number>;

  // the Number says how many search Results should be displayed
  // the boolean Value says if previous results should be stored
  @Output('more')
  more = new EventEmitter<number>();

  results: Hits;
  isCollapsed: Array<boolean> = [];

  // flag indicating weather pagination action is going on to take care of the lifecycle of this component
  // html template uses this to determine weather the resultlist should be displayed or not
  isPaginating = false;


  constructor(private shortcut: ShortcutService) { }
  collapse(index: number) {
    /*
    this.isCollapsed holds the state of collapsation of each row
    this.selectedRow holds the row index for the row for wich a context explorer is shown, 
        (if no contextexplorer is shown at all, this.selectedIndex is -1)
    */
    // only one row at time can be expanded
    const val = !this.isCollapsed[index];
    this.isCollapsed = [];
    this.isCollapsed[index] = val;
    // weather user collapses a new row or user decollapses a collapsed row for which the
    // contextexplorer was shown --> in both cases the context explorer will be closed   
    this.showSingleLogContext = false;
    this.toggleContextSearch.next(this.showSingleLogContext);
    this.selectedRow = -1;
  }

  ngOnDestroy() {
    this.hits$Subscription.unsubscribe();
  }
  ngOnInit() {
    this.hits$Subscription = this.hits$.subscribe(data => {
      this.results = data;
      this.isPaginating = false;
      if (this.steps) {
        this.pages = Math.floor(data.total / this.steps);
        this.setInterval();
      }
    });


    // This needs more refinment because this is a more complex topic because keydown is a blocking the ui
    // Whe a user stays on the arrow key we want to count up the pages but do just one request every 300 ms
    this.shortcut.bindShortcut({
      key: "ArrowLeft",
      description: "Navigate to previous page",
      view: "Search Logs View"
    }).pipe(filter(k => this.results != null && !this.searchInputHasFocus), tap(k => { // without this filter, left-arrow-key presses trigger pagination, even before search button was hit and results were displayed at all
      if (this.page - 1 >= 0) {
        this.page -= 1;
      }
    }), debounceTime(300)).subscribe(k => {
      this.loadMore(this.page, false);
    });


    this.shortcut.bindShortcut({
      key: "ArrowRight",
      description: "Navigate to next page",
      view: "Search Logs View"
    }).pipe(filter(k => this.results != null && !this.searchInputHasFocus), tap(k => {
      // Whe a user stays on the arrow key we want to count up the pages but do just one request every 300 ms
      if (this.page + 1 <= this.pages) {
        this.page += 1;
      }
    }), debounceTime(300)).subscribe(k => {
      this.loadMore(this.page, true);
    });
  }

  shouldBeVisible(): boolean {
    return (this.isPaginating || !!this.results);
  }

  setInterval() {
    this.pageInterval = [];
    const intervalStart = this.page - 5 >= 0 ? this.page - 5 : 0;
    for (let i = intervalStart; i < this.page + 5 && i < this.pages; i++) {
      this.pageInterval[i - intervalStart] = i;
    }
  }
  loadMore(page: number, goForward: boolean) {
    this.isPaginating = true;
    this.direction = goForward ? 'notReversed' : 'reversed';
    if (this.results) {
      this.results.hits = [];
    }
    this.more.emit(page);
    this.isCollapsed = [];
    this.selectedRow = -1;
    // loading more log results (next page) leads to shut down of the explore logs component which showed a context for a specific log result on the current page 
    this.showSingleLogContext = false;
    this.toggleContextSearch.next(this.showSingleLogContext);
  }
  getObjectEntries(object: any): Array<[string, string]> {
    return Object.entries(object);
  }

  toggleLogContext(resultsHit: LogDataModel, ev: Event) { // single LogMessageObject to show context for
    this.logContextSeed = resultsHit;
    const i: number = this.results.hits.indexOf(resultsHit)
    this.selectedRow = this.showSingleLogContext ? -1 : i;
    this.showSingleLogContext = !this.showSingleLogContext;
    this.isCollapsed = [];
    this.isCollapsed[i] = true;
    ev.stopImmediatePropagation();
    if (this.showSingleLogContext) {
      this.logContextSeedEmitter.next(this.logContextSeed);
    }
    this.toggleContextSearch.next(this.showSingleLogContext);

  }



}

type reversed = 'reversed' | 'notReversed';
