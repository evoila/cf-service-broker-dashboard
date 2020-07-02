import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import * as fromStore from '../../store';
import { BindingsState } from 'app/monitoring/shared/store/reducers/binding.reducer';
import { Store } from '@ngrx/store';
import { SpaceAndOrg } from '../../../model/service-broker-service-binding';
import { BindingSpecials } from 'app/monitoring/model/service-binding';
import { take } from 'rxjs/operators';

@Component({
  selector: 'sb-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit {
  public bindings$: Observable<BindingSpecials>;
  constructor(private store: Store<BindingsState>) {}

  ngOnInit() {
    // load application Bindings. This is nessecary for the next few Steps within Configuration
    this.store.dispatch(new fromStore.LoadBindings());

    this.store.select(fromStore.getAllBindingsEntities).pipe(take(1)).subscribe(bindings => {
      if (bindings.length > 0){
        if (bindings[0].type == "servicebroker"){
          this.bindings$ = this.store.select(fromStore.getServiceBrokerBindingsSpaceAndOrg);
        }
        else if(bindings[0].type == "managementportal"){
          this.bindings$ = this.store.select(fromStore.getManagementPortalBindingsPartnerAndCustomer);
        }
      }

    });

    
  }
}
