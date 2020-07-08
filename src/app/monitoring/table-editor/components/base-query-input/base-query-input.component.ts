// this component represents a single ES Query and the ability to create/select & test it

import { Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import { filter, take} from 'rxjs/operators';
import { ServiceBinding } from '../../../model/service-binding';
import { ESQuery } from '../../model/es-query';
import { QuerySelectComponent } from '../query-select/query-select.component';
import { Store } from '@ngrx/store';
import { RunQuery } from '../../store/actions/query.action';
import { getQueriesState, getAllQueriesEntities } from '../../store';
import { ESBoolQueryResponse, ESBoolQueryRawResponseMap } from '../../model/es-bool-query-result';
import { ESQuery_Request } from '../../model/es-query-request';
import { AppidComponent } from 'app/monitoring/shared/components/appid/appid.component';


@Component({
  selector: 'sb-base-query-input',
  templateUrl: './base-query-input.component.html',
  styleUrls: ['./base-query-input.component.scss']
})
export class BaseQueryInputComponent implements OnInit {
  @ViewChild('queryDropdownSelect') queryDropdownSelect: QuerySelectComponent;
  @ViewChild('appNameDropdownSelect') appNameDropdownSelect: AppidComponent;

  scope: ServiceBinding | null = null;
  query: ESQuery | null = null;
  selected_query_name?: string = "";
  hit_count: number = 0; 
  // flag indicating if current selected combination of scope and es-query is proofed valid
  valid = false;
  validating = true;

  baseInputCollapsed = false;
  query_result_hint = "";
  validated_query_description: string = '';
  selected_query_descriptions: Array<string> = [];


  @Output('open-column-definer')
  open_column_definer = new EventEmitter();

  @Output('close-column-definer')
  close_column_definer = new EventEmitter();
  
  @Output('open-query-editor')
  open_query_editor = new EventEmitter();

  constructor(
    private store: Store<ESQuery>
    
    ) {}

  ngOnInit() {
       


  }

  // user did select an app binding via drop down
  did_select_scope(service_binding: ServiceBinding){
    this.scope = service_binding;
    this.validate_new_selection();
  }

  // user did select a persisted or newly created es-query via drop down select
  did_select_query(es_query: ESQuery){
    this.query = es_query;
    this.validate_new_selection();
  }


  validate_new_selection(){
    // close col-def-component while we get new data to define columns
    if (this.selected_query_descriptions.length < 1){
      this.close_column_definer.next();
    }
    this.validating = true;
    if (this.scope && this.query){
      this.test_query_with_binding(this.query, this.scope)
    }
  }
  
 
  test_query_with_binding(query: ESQuery, binding: ServiceBinding){
  
    this.store.dispatch(new RunQuery(query, binding));
    this.store.select(getQueriesState).pipe(filter(k => !k.queries.running)).pipe(take(1)).subscribe(k => {
      var esbq_run_result = k.queries.run_result;
      this.validating = false;
      if (esbq_run_result != null){
        
        this.valid = true;
        this.query_result_hint = "empty result";
        // check number of hits -- '+' operator converting string to number
        this.hit_count = +esbq_run_result.responses[0].hits.total; 
        //console.log('hits: ' + this.hit_count);
        if (this.hit_count > 0){
          this.query_result_hint = "query valid";
          
          var appID = k.queries.bc_request!!.appId;
          var q_scope = this.appNameDropdownSelect.serviceBindings!!.filter(k => k.appId == appID)[0].appName;
          this.validated_query_description = this.getQueryNameById(esbq_run_result.queryId).concat(" x ").concat(q_scope);
          
          
        }

      }
      else{
        this.valid = false;
        this.query_result_hint = "query not valid";
      }
      //console.log(esbq_run_result);
    })
   


  }

  public drop_base_data_brick(result_name: string){
    

  //TODO: update data array in table editor component after deleting certain base-query-data-parts 

    const index : number = this.selected_query_descriptions.indexOf(result_name, 0);
    if (index > -1) {
      this.selected_query_descriptions.splice(index, 1);
      if (this.selected_query_descriptions.length < 1){
        this.valid = false;
        this.close_column_definer.next();
      }
    }
  }


  public getQueryNameById(id: string){
    var que : ESQuery = this.queryDropdownSelect.queries!!.filter(k => k.id == id)[0];
    return que.name;
  }

  showQueryEditor(){
    // event output to parent component (query-group-component) which will forward event to grandparent (table-editor-component) 
    this.open_query_editor.next();
  }


  
  receive_query_editor_result_query(query: ESQuery){
    console.log('base query received result');
    
  }
 
  select_query_result(){
    this.selected_query_descriptions = this.selected_query_descriptions.concat(this.validated_query_description);
    this.open_column_definer.next();
    this.baseInputCollapsed = true;
  }



  decollapse_base_query_input(){
    this.baseInputCollapsed = false;
  }

}
