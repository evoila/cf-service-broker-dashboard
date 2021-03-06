import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BindingService } from '../binding.service';
import { ServiceBinding } from '../model/service-binding';
import { NotificationType } from 'app/core';
import { NotificationService, Notification } from '../../core/notification.service';

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
  serviceBindings: Array<ServiceBinding> | null;
  fallBackAppName: string;
  fallBackSpace: string;
  choosen: number;
  constructor(public bindingService: BindingService,
    private notification: NotificationService
  ) { }
  ngOnInit() {
    this.bindingService.getBindings().subscribe(
      (data: Array<ServiceBinding>) => {
        if (data.length === 0) {
          this.notification.addSelfClosing(new Notification(NotificationType.Warning, 'No Apps binded. Use the CF-CLI to do so'));
        }
        this.serviceBindings = data
      }
    )
  }
  private setChoosen() {
    if (this.choosen) {
      this.app.next(this.serviceBindings!![this.choosen]);
    }
  }
  private fallBackTextFieldUpdate() {
    if (this.fallBackAppName && this.fallBackSpace) {
      const fallBackBinding = {
        appName: this.fallBackAppName,
        space: this.fallBackSpace
      } as ServiceBinding;
      this.app.next(fallBackBinding);
    }
  }
}
