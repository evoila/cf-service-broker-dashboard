import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { services } from "./services";
import { components } from "./components";
import { FormsModule } from "@angular/forms";
import { directives } from "./directives";

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [...components, ...directives],
  exports: [...components, ...directives]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: services
    };
  }
}
