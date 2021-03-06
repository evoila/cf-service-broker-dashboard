
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NotificationType, NotificationService, Notification} from 'app/core';


@Injectable()
export class ErrorserviceService {

  constructor(
    private notification: NotificationService,
  ) {}

  public handleErrors(error: any): Observable<any> {
    console.log(error);
    // Indicates that Error is thrown by Controller
    let errorMessage;
    if (error.status !== 401 && error.status !== 0) {
      errorMessage = error.error.message;
    } else {
      // Error is thrown by PartyFilter
      errorMessage = error.message;
    }
    this.notification.addSelfClosing(new Notification(NotificationType.Error, errorMessage));
    return observableThrowError(error);
  }

}
