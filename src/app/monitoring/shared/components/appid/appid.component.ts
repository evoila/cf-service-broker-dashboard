import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { BindingService } from '../../services/binding.service';
import { ServiceBinding } from '../../../model/service-binding';
import { NotificationType } from 'app/core';
import { Observable } from 'rxjs/internal/Observable';
import { BindingsState } from '../../store/reducers/binding.reducer';
import { Store } from '@ngrx/store';
import { getAllBindingsEntities } from '../../store/selectors/bindings.selector';
import {
  NotificationService,
  Notification
} from '../../../../core/notification.service';
import { take } from 'rxjs/operators';
import { timer } from 'rxjs';

/*
 * Fallback Textfield offers the possibility to Type-In AppID
 * if the binding service is not available
 */
@Component({
  selector: 'sb-appid',
  templateUrl: './appid.component.html',
  styleUrls: ['./appid.component.scss']
})
export class AppidComponent implements OnInit {
  @Output('app')
  app = new EventEmitter<ServiceBinding>();

  @Input('selected')
  appId: string;

  serviceBindings: Array<ServiceBinding> | null;
  serviceBindings$: Observable<Array<ServiceBinding> | null>;
  fallBackAppName: string;
  fallBackSpace: string;
  choosen: number = -1;
  constructor(
    public bindingService: BindingService,
    private notification: NotificationService,
    private store: Store<BindingsState>
  ) { }
  ngOnInit() {
    this.serviceBindings$ = this.store.select(getAllBindingsEntities);
    this.serviceBindings$.subscribe((data: Array<ServiceBinding>) => {
      if (data.length === 0) {
        this.notification.addSelfClosing(
          new Notification(
            NotificationType.Warning,
            'No Apps binded. Use the CF-CLI to do so'
          )
        );
      }
      this.serviceBindings = [...data];

      this.choosen = data!!
        .map((binding, index) => {
          return { binding, index };
        })
        .filter(binding => binding.binding.appId == this.appId)
        .map(k => k.index)[0];

      this.choosen = this.choosen == -1 || !this.choosen ? 0 : this.choosen;


      timer(0, 100).pipe(take(1)).subscribe( k => this.setChoosen());

    })

  }
  public setChoosen() {
    this.app.next(this.serviceBindings!![this.choosen]);
  }
  
}
