import { CfAuthScope } from "app/monitoring/chart-configurator/model/cfAuthScope"
import { RawQuery } from "./raw-query";
import { ESQuery } from "./es-query";


export class ESQuery_Request{

    public appId: string;
    public size: number;
    public authScope: CfAuthScope;
    public query: ESQuery;
    public from: number;
    public index: string; 

    public constructor(appId: string, size: number, authScope: CfAuthScope, query: ESQuery, index: string) { 

        this.appId = appId;
        this.size = size;
        this.authScope = authScope;
        this.query = query;
        this.from = 0;
        this.index = index;
      }
    
      jsonify(){
        return JSON.stringify(this);
      }
    
    

    
}