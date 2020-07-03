import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "environments/runtime-environment";
import { CustomEndpointService } from "app/core/custom-endpoint.service";

@Injectable({ providedIn: "root" })
export class EndpointService extends CustomEndpointService {
  private readonly prefix = "/v1";
  // private baseUrl = 'http://localhost';
  private authToken = environment.token;
  public readonly httpOptions = {
    headers: new HttpHeaders({
      Authorization: this.authToken
    })
  };

  public getUri() {
    return super.getUri("log-metric-backend") + this.prefix;
  }
  constructor() {
    super();
    this.baseUrl =
      "https://osb-log-metric-dashboard-backend.cf.dev.eu-de-central.msh.host";
  }
}
