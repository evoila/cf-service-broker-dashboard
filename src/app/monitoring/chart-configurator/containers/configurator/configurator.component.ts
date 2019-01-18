import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import * as fromStore from '../../store';
import { BindingsState } from 'app/monitoring/shared/store/reducers/binding.reducer';
import { Store } from '@ngrx/store';
import { SpaceAndOrg } from '../../../model/service-binding';

@Component({
  selector: 'sb-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit {
  public bindings$: Observable<SpaceAndOrg>;
  constructor(private store: Store<BindingsState>) {}

  ngOnInit() {
    // load application Bindings. This is nessecary for the next few Steps within Configuration
    this.store.dispatch(new fromStore.LoadBindings());
    this.bindings$ = this.store.select(fromStore.getBindingsSpaceAndOrg);
    this.bindings$.subscribe(k => console.log(k));
  }
}
