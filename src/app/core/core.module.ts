import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeComponent } from "./";
import { InlineLoaderDirective } from "./";
import { NotificationBannerComponent } from "./notification-banner/notification-banner.component";
import { RouterModule } from "@angular/router";
import { NotificationService } from "./";
import { ShowErrorsComponent } from "./show-errors/show-errors.component";

import { SidebarLayoutComponent } from "./sidebar/sidebar-layout/sidebar-layout.component";
import {
  SidebarNavComponent,
  SidebarLinkNotActiveFilterPipe
} from "./sidebar/sidebar-nav/sidebar-nav.component";
import { ToolbarButtonComponent } from "./sidebar/toolbar-button/toolbar-button.component";
import { ToolbarComponent } from "./sidebar/toolbar/toolbar.component";
import { ToolbarLinkComponent } from "./sidebar/toolbar-link/toolbar-link.component";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { WindowService } from "./window.service";
import { WizardComponent } from "./wizard/wizard/wizard.component";
import { WizardPageSubmitButtonComponent } from "./wizard/wizard-page-submit-button/wizard-page-submit-button.component";
import { WizardPageComponent } from "./wizard/wizard-page/wizard-page.component";
import { WizardStepComponent } from "./wizard/wizard-step/wizard-step.component";
import { FocusDirective } from "./wizard";
import { CustomEndpointService } from "./custom-endpoint.service";
import { HttpGetParamsService } from "./services/http-get-params.service";
//import { HttpClient } from '@angular/common/http';

const components = [
  HomeComponent,
  NotificationBannerComponent,
  InlineLoaderDirective,
  ShowErrorsComponent,
  SidebarLayoutComponent,
  SidebarNavComponent,
  SidebarLinkNotActiveFilterPipe,
  ToolbarButtonComponent,
  ToolbarComponent,
  ToolbarLinkComponent,
  WizardComponent,
  WizardStepComponent,
  WizardPageComponent,
  FocusDirective,
  WizardPageSubmitButtonComponent
];

@NgModule({
  imports: [CommonModule, RouterModule, NgbCollapseModule],
  declarations: [components],
  exports: [components],
  providers: []
})
export class CoreModule {
  public static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        NotificationService,
        WindowService,
        CustomEndpointService,
        HttpGetParamsService
      ]
    };
  }
}
