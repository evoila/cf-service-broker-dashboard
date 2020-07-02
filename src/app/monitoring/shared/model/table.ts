import { CfAuthScope } from '../../chart-configurator/model/cfAuthScope';  
import { TableOptions } from '../../table-editor/model/table-options-entity'
import { ColumnDefinition } from 'app/monitoring/table-editor/model/column-definition';
import { ESQuery_Request } from 'app/monitoring/table-editor/model/es-query-request';
import { AggregationRequestObject } from 'app/monitoring/chart-configurator/model/aggregationRequestObject';
import { AuthScope } from 'app/monitoring/chart-configurator/model/authScope';

export class Table{
readonly id?: string;
title: string;
queries: Array<ESQuery_Request>;
authScope: AuthScope;
columns: Array<ColumnDefinition>;
options: TableOptions;
aggregations: Array<AggregationRequestObject>;

 
public constructor(title: string, columns: Array<ColumnDefinition>, queries: Array<ESQuery_Request>) { 
    

    this.title = title;
    this.queries = queries;
    this.authScope = queries[0].authScope;
    this.columns = columns;
    this.options = new TableOptions();
    this.aggregations = Array<AggregationRequestObject>();
    
}

jsonify(){
    return JSON.stringify(this);
}

}

