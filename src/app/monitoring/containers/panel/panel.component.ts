import { Component, OnInit, ElementRef, ViewChild, Renderer2, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import * as moment from 'moment/moment';
import { EsTimerangeService } from 'app/monitoring/services/es-timerange.service';

import { filter, switchMap, take } from 'rxjs/operators';
import { CdkDragDrop, CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';

import { PanelState } from 'app/monitoring/shared/store/reducers/panel.reducer';
import { Store, select } from '@ngrx/store';
import { getPanelById, getPanelState } from '../../shared/store/selectors/panel.selector';
import { State } from 'app/monitoring/store';
import { getParams } from '../../store/reducers/index';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { Panel } from '../../shared/model/panel';
import { SetStateForUpdate, AddElementToPanel, FlushState } from '../../panel-configurator/store/actions/panel-increation.action';
import { PanelIncreationState } from 'app/monitoring/panel-configurator/store/reducers/panel-increation.reducer';
import { Chart } from '../../shared/model/chart';
import { buildFunctionalPanel } from '../../panel-configurator/store/selectors/panel-increation.selector';
import { UpdatePanel, LoadPanels } from '../../shared/store/actions/panel.action';
import { FirePanelAggregationRequest } from '../../shared/store/actions/chart.actions';
import { ChartInPanel } from '../../model/chart-in-panel';
import { TimeService } from '../../shared/services/time.service';
import { ShortcutService } from '../../../core/services/shortcut.service';
import { PanelElement } from 'app/monitoring/shared/model/panel-element';
import { TableInPanel } from 'app/monitoring/model/table-in-panel';
import { Table } from 'app/monitoring/shared/model/table';
import { time } from 'console';



@Component({
  selector: 'sb-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, OnDestroy {

  @ViewChild('container')
  container: ElementRef;

  @ViewChild('elementcontainer')
  elementcontainer: ElementRef;

  @ViewChild('toggleSidePanelEle')
  toggleSidePanelEle: ElementRef;

  // Side Panel that contains Charts and Tables that can be dragged and dropped into the Panel
  sidePanelHidden = true;


  public panel: Panel;
  public menu: { [k: string]: any } = {};
  public toDateView: any = moment().unix();
  public fromDateView: any = moment().subtract(1, "days").unix();
  public steps: [string, string];
  public changed = false;
  private timeRangeEmitter$: Subject<any> = new Subject();
  public timeRange$: Observable<{ [key: string]: any }> = new Observable(k => this.timeRangeEmitter$.subscribe(k));
  public edit: boolean;
  /*--------------Subjects & Observables -------------*/
  public editModeSubject = new Subject<boolean>();
  public editMode$ = new Observable(k => this.editModeSubject.subscribe(k));

  public editControlSubject = new Subject<string>();
  public editControl$ = new Observable(k => this.editControlSubject.subscribe(k));

  // handles all subscriptions to unsubscribe on destroy
  private subscriptions: Subscription[] = [];
  // just an Object that is to save a subscription till its pushed to the array
  private subscription: Subscription;
  // redo object holds old references of the panel object

  // every chart emits an size update 
  // we need this counter to be certain when a chart
  // can be persisted see --> persistPanel
  private saveCounter = 0;


  // Flag that is set to true when a User has added a Panel
  // to display a Notification Icon
  public addingElement = false;
  // CSS Classes for Notification Icon 
  public addingChartClasses = ["far", "fa-check-square"];
  private redoObject = {} as Panel;

  constructor(
    private timeRangeService: EsTimerangeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<PanelState>,
    private panelStore: Store<PanelIncreationState>,
    private routerStore: Store<State>,
    private renderer: Renderer2,
    private timeService: TimeService,
    private shortcut: ShortcutService,
    private cdr: ChangeDetectorRef
  ) {
    this.menu['view'] = 'Views:';
    this.menu['viewSettings'] = ['1', '2', '3'];
  }



  ngOnInit() {
    console.log('panel component ngOnInit()');
    this.registerRouterEvents();
    this.subscription = this.timeRange$.subscribe(k => {
      console.log('1');
      //console.log(this.panel);
      if (this.panel && this.panel.elements.length) {
        console.log('2');
        this.store.dispatch(new FirePanelAggregationRequest(this.panel, k));
        console.log('3');
      }
    });
    this.subscriptions.push(this.subscription);
    
    this.shortcut.bindShortcut({
      key: "Escape",
      description: "Cancel the Panel Edit Mode and reverting changes",
      view: "Panel View"
    }).subscribe(k => {
      this.cancelEdit();
    })
    /*     //Autorefresh every 10 Seconds
        this.subscription = timer(10000, 10000).subscribe(i => {
          const now = moment().unix();
          const diff = this.toDateView - now;
          this.fromDateView = moment.unix(this.fromDateView + diff).unix();
          this.toDateView = now;
          this.setDateRange();
        })
        this.subscriptions.push(this.subscription); */

    this.setDateRange();
    
  }

  ngOnDestroy() {
    this.subscriptions.forEach(k => k.unsubscribe());
  }


  getOnlyCharts(){
    return this.panel.elements.filter( k => 'chart' in k);
  }


  public toggleSidePanel() {
    this.sidePanelHidden = !this.sidePanelHidden;
    this.rerenderSidePanel();
  }

  rerenderSidePanel() {
    /*   if (this.sidePanelHidden) {
        this.renderer.setStyle(this.container.nativeElement, 'grid-template-columns', '7fr 1fr');
      } else {
        this.renderer.setStyle(this.container.nativeElement, 'grid-template-columns', '1fr 0px');
      } */
  }
  // Side Panel to add charts has a Toggle to hide and seek which should be deactivated on edit mode
  hideToggleSidePanel(hide: boolean) {
    if (hide) {
      this.renderer.setStyle(this.toggleSidePanelEle.nativeElement, 'display', 'none');
    } else {
      this.renderer.setStyle(this.toggleSidePanelEle.nativeElement, 'display', 'inline-block');
    }

  }
  editPanel() {
    
    this.store.dispatch(new SetStateForUpdate(this.panel));
    this.router.navigate(['/monitoring/panelconfigurator']);
  }

  trackByFn(index, item) {
    return item.id;
  }

  started(event: CdkDragStart) {
    // Disable Change detection here since this fires
    // about every 10's millisecond here and destroys performance
    console.log("detatching");
    this.cdr.detach();
  }
  ended(event: CdkDragEnd) {
    // attach to Change detection again
    this.cdr.reattach();
    console.log("reattatching");
  }
  drop(event: CdkDragDrop<Chart | Table>) {
    console.log("drop()");
    // attach to Change detection again
    this.cdr.reattach();
    this.addingElement = true;
    this.store.pipe(select(getPanelById, this.panel.id)).pipe(take(1)).subscribe(k => {
      this.panelStore.dispatch(new SetStateForUpdate(k));
      //console.log('event.item.data: ');
      //console.log(event.item.data);
      // convert Chart or Table to Panelelement (ChartInPanel or TableInPanel)
      var p_element : PanelElement;
      p_element = 'columns' in event.item.data ? new TableInPanel(event.item.data, 0, 0) : new ChartInPanel(event.item.data, 0, 0);
      //console.log('***********************');
      //console.log(p_element);
      this.panelStore.dispatch(new AddElementToPanel(p_element));
      this.panelStore.pipe(select(buildFunctionalPanel)).pipe(take(1)).subscribe(k => {
        timer(4000, 0).pipe(take(1)).subscribe(k => this.addingElement = false);
        this.store.dispatch(new UpdatePanel(k));
        this.panelStore.dispatch(new FlushState());
        this.store.pipe(select(getPanelState),
          filter(k => k.panelSaved),
          take(1),
          switchMap(k => {
            this.store.dispatch(new LoadPanels());
            return this.store.pipe(select(getPanelState),
              filter(k => k.panelsLoaded),
              take(1),
              switchMap(k => {

                return this.store.pipe(select(getPanelById, this.panel.id));
              })
            )
          })
        ).subscribe((k: Panel) => this.panel = k);
      });
    });
  }


  registerRouterEvents() {
    console.log("in registerRouterEvents()");
    this.subscription = this.routerStore
      .select(getParams)
      .pipe(
        switchMap((params: Params) =>
          this.store
            .pipe(select(getPanelById, params['id']))
        ),
        filter(
          (k: any) =>
            k != undefined && k.elements
        )
      )
      .subscribe((k: Panel) => {
        /*console.log('old Panel:');
        console.log(this.panel);
        console.log('new Panel:');
        console.log(k);*/
        this.panel = { ...k };
        this.setDateRange();
      });
    this.subscriptions.push(this.subscription);
  }

  setFromDate(date: any) {
    this.fromDateView = date;
    this.setDateRange();
  }
  setToDate(date: any) {
    this.toDateView = date;
    this.setDateRange();
  }

  deleteElement(elem: PanelElement) {
    const elements = this.panel.elements.filter(elementIter => elementIter.id != elem.id);
    this.panel = { ...this.panel, elements };
  }
/*
  deleteChart(chart: ChartInPanel) {
    const elements = this.panel.elements.filter(elementIter => elementIter.id != chart.id);
    this.panel = { ...this.panel, elements };
  } */

  switchElements(event: CdkDragDrop<PanelElement>) {
    console.log('in switchElements');
    const element = this.panel.elements[event.previousIndex];
    const oldElement = this.panel.elements[event.currentIndex];
    const elements = [...this.panel.elements];
    elements[event.currentIndex] = element;
    elements[event.previousIndex] = oldElement;
    this.panel = { ...this.panel, elements };
  }

  toggleEditmode() {
    this.redoObject = { ...this.panel };
    this.edit = true;
    this.editModeSubject.next(true);
    this.sidePanelHidden = true;
    this.rerenderSidePanel();
    this.hideToggleSidePanel(true);

  }
  cancelEdit() {
    if (this.edit) {
      this.edit = false;
      this.panel = this.redoObject;
      this.edit = false;
      this.redoObject = {} as Panel;
      this.editModeSubject.next(false);
      this.editControlSubject.next('cancel');
      this.hideToggleSidePanel(false);
    }
  }
  saveEdit() {
    if (this.edit) {
      this.edit = false;
      this.editModeSubject.next(false);
      this.editControlSubject.next('save');
      this.hideToggleSidePanel(false);
      if (!this.panel.elements.length) {
        // If there is no chart left there will be no callback from the 
        // resizing directive --> persist Panel will never be called
        this.persistPanel(true);
      }
    }
  }
  saveSize(size: number, element: PanelElement) {
    console.log('SAVING SIZE');
    var elements = Array<PanelElement>();
    if ('chart' == element.type){
      const chart = element as ChartInPanel;
      elements = this.panel.elements.map(k => chart.id == k.id ? { ...chart, size: size } : k);
    }
    else if ('table' == element.type){
      const table = element as TableInPanel;
      elements = this.panel.elements.map(k => table.id == k.id ? { ...table, size: size } : k);
    }
    
    this.panel = { ...this.panel, elements };
    this.persistPanel();
  }
  persistPanel(override: boolean = false) {
    console.log('in persistPanel()');
    // wait until every element has been updated
    this.saveCounter++;
    if (override || (this.saveCounter === this.panel.elements.length &&
      JSON.stringify(this.panel) !== JSON.stringify(this.redoObject))) {
      this.panelStore.dispatch(new UpdatePanel(this.panel));
      this.redoObject = {} as Panel;
      this.saveCounter = 0;
    }
  }

  private setDateRange() {
    if (this.toDateView && this.fromDateView) {
      this.timeRangeEmitter$.next(this.timeRangeService.setTimeRange(
        this.fromDateView,
        this.toDateView
      ));
    }
  }

}