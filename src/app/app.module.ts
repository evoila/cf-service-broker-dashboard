import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";

import * as monShared from "./monitoring/shared/shared.module";

import {
  NgbDropdownModule,
  NgbCollapseModule,
  NgbTypeaheadModule,
  NgbTooltipModule,
  NgbModalModule,
  NgbPopoverModule,
  NgbTabsetModule
} from "@ng-bootstrap/ng-bootstrap";

import { buildTarget } from "environments/target";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { CoreModule } from "./core/core.module";

import { BuildTargetService } from "app/shared";
import { SharedModule } from "./shared/shared.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthenticationInterceptor } from "./core/services/authentication.interceptor";
import { CommonModule } from "@angular/common";

export function buildBuildTargetService(): BuildTargetService {
  return new BuildTargetService(buildTarget);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    monShared.SharedModule,

    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbPopoverModule,
    NgbTypeaheadModule,
    NgbTabsetModule,
    CoreModule.forRoot(),
    CoreModule,
    SharedModule,

    ...buildTarget.coreModules,

    AppRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: BuildTargetService, useFactory: buildBuildTargetService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
