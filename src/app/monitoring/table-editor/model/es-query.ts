import { RawQuery } from "./raw-query";

/*
  {
    "should": [],
    "filter": [],
    "mustNot": [],
    "must": [
      {
        "match": {
          "_index": "*-logmessages"
        }
      }
    ]
  }
  */


export class ESQuery{

  public id?: string;
  public name: string;
  public boolQuery: RawQuery;
  
  
  constructor(name: string, boolQuery: RawQuery) { 

    this.name = name;
    this.boolQuery = boolQuery;
  }

  to_json(){
    return JSON.stringify(this);
  }




    
}