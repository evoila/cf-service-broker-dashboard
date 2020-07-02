import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { Chart } from '../../../shared/model/chart';
import { Observable } from 'rxjs/internal/Observable';
import { getCharts } from '../../../shared/store/selectors/chart.selector';
import { PanelIncreationState } from '../../store/reducers/panel-increation.reducer';
import * as panelAction from '../../store/actions/panel-increation.action';
import * as panelSelectors from '../../store/selectors/panel-increation.selector';
import { AuthParameterService } from '../../../shared/services/auth-param.service';
import { BindingsState } from '../../../shared/store/reducers/binding.reducer';
import { ChartModelState } from '../../../shared/store/reducers/chart.reducer';
import { LoadCharts } from '../../../shared/store/actions/chart.actions';
import { Panel } from '../../../shared/model/panel';
import { map, filter, switchMap, debounceTime } from 'rxjs/operators';
import { PanelState } from '../../../shared/store/reducers/panel.reducer';
import { SavePanel } from 'app/monitoring/shared/store/actions/panel.action';
import { getPanelState } from '../../../shared/store/selectors/panel.selector';
import { take } from 'rxjs/internal/operators';
import { Router } from '@angular/router';
import { LoadPanels, UpdatePanel, DeletePanel } from '../../../shared/store/actions/panel.action';
import { ShortcutService } from '../../../../core/services/shortcut.service';
import { PanelElement } from 'app/monitoring/shared/model/panel-element';
import { AuthScope } from 'app/monitoring/chart-configurator/model/authScope';
import { environment } from 'environments/runtime-environment';
import { getBindingsLoadingState, LoadBindings, getAllBindingsEntities } from 'app/monitoring/chart-configurator/store';

@Component({
  selector: 'sb-panel-editor',
  templateUrl: './panel-editor.component.html',
  styleUrls: ['./panel-editor.component.scss']
})
export class PanelEditorComponent implements OnInit {
  public charts$: Observable<Array<Chart>>;
  public chartsInPanel$: Observable<{ [id: string]: PanelElement }>;
  public name: string;
  public description: string;
  public onEdit: boolean;
  public authScope: AuthScope;


  private subscriptions: Array<Subscription> = [];
  private authParams: AuthParameterService;

  constructor(
    private chartStore: Store<ChartModelState>,
    private panelStore: Store<PanelIncreationState>,
    private panelModelStore: Store<PanelState>,
    private router: Router,
    private bindingStore: Store<BindingsState>,
    cfAuthParams: AuthParameterService,
    private shortcut: ShortcutService
  ) {
    this.authParams = cfAuthParams.construct(bindingStore);
  }

  ngOnInit() {
    this.chartStore.dispatch(new LoadCharts());
    this.charts$ = this.chartStore.select(getCharts);
    this.chartsInPanel$ = this.panelStore.select(
      panelSelectors.getPanelIncreationElements
    );
    this.panelStore.select(panelSelectors.getPanelNameAndDescription).subscribe(k => {
      this.name = k.name;
      this.description = k.description;
    });
    this.panelStore.select(panelSelectors.getPanelOnEdit).subscribe(k => {
      this.onEdit = k;
    });
    this.charts$.subscribe(k => console.log(k));
    //const bindingType = this.getBindingType() == 'servicebroker' ? 'cf' : 'kc';
    this.authParams.createAuthScope().subscribe(k => (this.authScope = k));

    const sub = this.shortcut.bindShortcut({
      key: "Enter",
      description: "Trigger Save Button",
      view: "Panel Editor View"
    }).subscribe(k => {
      this.save(false);
    });
    this.subscriptions = [...this.subscriptions, sub];
  }

  ngOnDestroy() {
    if (this.subscriptions.length) {
      this.subscriptions.forEach(k => k.unsubscribe());
    }
  }

  save(deleteFlag: boolean) {
    this.panelStore.dispatch(new panelAction.SetName(this.name));
    this.panelStore.dispatch(new panelAction.SetDescription(this.description.length > 0 ? this.description : 'no description'));
    this.panelStore.dispatch(new panelAction.SetAuthScope(this.authScope));
    this.panelStore
      .select(panelSelectors.panelReadyForBuild)
      .pipe(
        take(1),
        filter((k: boolean) => k),
        switchMap(k =>
          this.panelStore.select(panelSelectors.buildFunctionalPanel)
        ),
        switchMap((panel: Panel) => {
          if (panel.id) {
            if (!deleteFlag) {
              this.panelModelStore.dispatch(new UpdatePanel(panel));
            } else {
              this.panelModelStore.dispatch(new DeletePanel(panel.id));
            }
          } else {
            this.panelModelStore.dispatch(new SavePanel(panel));
          }
          return this.panelModelStore.select(getPanelState);
        }),
        debounceTime(100),
        filter(k => !k.panelSaveing),
        take(1),
        map(k => k.panelSaved)
      )
      .subscribe((k: boolean) => {
        if (k) {
          this.panelStore.dispatch(new panelAction.FlushState());
          this.router.navigate(['/monitoring']);
          this.panelModelStore.dispatch(new LoadPanels());
        } else {
          alert('An Error occured. Check if you have included everything we need');
        }
      });
  }
  cancel() {
    this.panelStore.dispatch(new panelAction.FlushState());
    this.router.navigate(['/monitoring']);
  }


  


}
