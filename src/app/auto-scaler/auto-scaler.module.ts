import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoScalerComponent } from './auto-scaler.component';
import { AutoScalerRoutingModule } from './auto-scaler-routing.module';

import { NouisliderModule } from 'ng2-nouislider';
import { FormsModule } from '@angular/forms';
import { BindingComponent } from './binding/binding.component';
import { AutoScalerService } from './auto-scaler.service';
import { CoreModule } from '../core/core.module';
import { BindingListComponent } from './binding-list/binding-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NouisliderModule,
    AutoScalerRoutingModule,
    CoreModule
  ],
  declarations: [AutoScalerComponent, BindingComponent, BindingListComponent],
  providers: [AutoScalerService]
})
export class AutoScalerModule { }
