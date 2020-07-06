
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


// this component is the full page container offering the Possibility to create a valid es Query
// before saving an ES Query it's possible to validate it with different App Bindings

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ESQuery } from '../../model/es-query';
import { RawQuery } from '../../model/raw-query';
import { SearchService } from 'app/monitoring/shared/services/search.service';
import { Observable } from 'rxjs';
import { Field } from 'app/monitoring/aggregation-editor/model/field';
import { Store } from '@ngrx/store';
import { getQueriesState, RunQuery } from '../../store';
import { filter, take } from 'rxjs/operators';
import { environment } from 'environments/runtime-environment';
import { ServiceBinding } from 'app/monitoring/model/service-binding';

@Component({
  selector: 'sb-query-editor',
  templateUrl: './query-editor.component.html',
  styleUrls: ['./query-editor.component.scss']
})
export class QueryEditorComponent implements OnInit {

  @Output('close-query-editor')
  close_query_editor = new EventEmitter<ESQuery>();
  
  @Output('save-new-query')
  save_new_query = new EventEmitter();


  scope: ServiceBinding | null = null;
  //raw query + name & id
  query: ESQuery;
  // not null after successfull query-editor-query-test
  valid_query: RawQuery;
  validating = false;
  valid = false;
  query_test_result_hint = "";
  es_bool_query_text_area_must: string = "{'match' : { '_index' : '*-logmessages'} }";

  public fields$: Observable<Map<string, Array<Field>>>;
  
  //fetched_indexes: Array<string>;

  constructor(private readonly searchService: SearchService,
    private es_query_store: Store<ESQuery>) { }

  ngOnInit() {

    this.fields$ = this.searchService.getMappingWithType();

  }



  test_query(){
    console.log('testing query');

    var must_val = [this.es_bool_query_text_area_must] 
    var raw_query = new RawQuery([], [], [], must_val)
    this.query = new ESQuery('test query', raw_query)
    this.query_test_result_hint = "";
    this.es_query_store.dispatch(new RunQuery(this.query, this.scope!));
    this.es_query_store.select(getQueriesState).pipe(filter(k => !k.queries.running)).pipe(take(1)).subscribe(k => {
      var esbq_run_result = k.queries.run_result;
      this.validating = false;
      if (esbq_run_result != null){
        this.valid = true;
        this.query_test_result_hint = "empty result";
        // check number of hits -- '+' operator converting string to number
        const hit_count = +esbq_run_result.responses[0].hits.total; 
        //console.log('hits: ' + this.hit_count);
        if (hit_count > 0){
          this.query_test_result_hint = "query valid";
          
        
        }
      }
      else{
        this.valid = false;
        this.query_test_result_hint = "query not valid";
      }
      //console.log(esbq_run_result);
    })

  }


  // user did select an app binding via drop down
  did_select_scope(service_binding: ServiceBinding){
    this.scope = service_binding;
  }


  cancel_query_editor(){
    this.close_query_editor.next();
  }


  save_query(){
    console.log('SAVE QUERY TO DB HERE AND EXPORT IT TO Parent Component (table-editor)');
    this.save_new_query.next(this.valid_query);
    this.cancel_query_editor();
  }

  



}
