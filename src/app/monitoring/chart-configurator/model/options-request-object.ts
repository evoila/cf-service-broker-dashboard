import { AuthScope } from "./authScope";

export class OptionsRequestObject {
  public authScope: AuthScope;
  public chartType: string;
  constructor(authScope: AuthScope) {}
}
