
import { RawQuery } from "./raw-query";
import { ESQuery } from "./es-query";
import { AuthScope } from "app/monitoring/chart-configurator/model/authScope";


export class ESQuery_Request{

    public appId: string;
    public size: number;
    public authScope: AuthScope;
    public query: ESQuery;
    public from: number;

    public constructor(appId: string, size: number, authScope: AuthScope, query: ESQuery) { 

        this.appId = appId;
        this.size = size;
        this.authScope = authScope;
        this.query = query;
        this.from = 0;
      }
    
      jsonify(){
        return JSON.stringify(this);
      }
    
    

    
}