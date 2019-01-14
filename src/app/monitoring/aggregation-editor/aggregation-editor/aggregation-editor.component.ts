import {
  Component,
  OnInit,
  OnChanges,
  Output,
  Input,
  EventEmitter
} from '@angular/core';

import { AggregationTemplateService } from '../aggregation-template.service';

import { Observable } from 'rxjs';
import { ChartingUtilsService } from '../charting-utils.service';
import { Field } from 'app/monitoring/aggregation-editor/model/field';

@Component({
  selector: 'aggregation-editor',
  templateUrl: './aggregation-editor.component.html',
  styleUrls: ['./aggregation-editor.component.css']
})
export class AggregationEditorComponent implements OnInit, OnChanges {
  @Output() result = new EventEmitter();
  @Input('fields')
  public fields$: Observable<Map<string, Array<Field>>>;
  public fields: Map<string, Array<Field>>;
  @Input('type')
  public emittedType: string;
  public type: string;

  public name: string;
  public description: string;

  @Input() set aggregations(aggregations: any) {
    this.aggsAsText = aggregations[0].command;
    this.aggs = JSON.parse(aggregations[0].command) || {};
  }

  public aggregationTypes: Array<any> = new Array<any>();
  public displayTypes: Array<any>;
  public displayType: any = {};
  public availableSearchObjects: Array<string>;
  public dataStructure: string;
  public datatStructures = ['logs', 'metrics'];
  public request: any = {
    stored_fields: ['*'],
    index: ['*'],
    body: null,
    type: ''
  };
  public data = {
    searchObjectName: '',
    fieldToCount: 'value',
    fields: Array<Field>()
  };
  public aggs: any = {
    aggs: {
      0: {}
    }
  };
  public useTextEditor = false;
  private aggsAsText: string;

  constructor(
    private aggregationTemplateService: AggregationTemplateService,
    private chartingUtils: ChartingUtilsService
  ) {
    this.loadDisplayTypes();
  }

  ngOnInit() {
    this.setDisplayType(this.emittedType);
    this.fields$.subscribe((fields: Map<string, Array<Field>>) => {
      this.fields = fields;
    });

    if (!this.data.searchObjectName) {
      this.displayType = {
        type: ''
      };
    }
  }

  ngOnChanges(changes) {
    if (changes.aggregations && this.useTextEditor) {
      this.aggs = this.aggsAsText;
    }
  }

  public loadDisplayTypes() {
    this.displayTypes = this.chartingUtils.chartTypes();
  }

  public stringifyAggs() {
    if (this.useTextEditor) {
      this.aggs = this.aggsAsText;
    } else {
      this.aggs = JSON.parse(this.aggsAsText);
    }
  }

  public loadFields(struct: string) {
    this.data.fields = this.fields[struct];
    this.aggregationTypes = this.aggregationTemplateService.getAggregationTypes(
      this.data.fields,
      this.displayType.type
    );
  }
  private getAggregationTypes() {
    this.aggregationTypes = this.aggregationTemplateService.getAggregationTypes(
      this.data.fields,
      this.type
    );
  }

  public setDataStructure(struct: string) {
    this.dataStructure = struct;
    this.setDisplayType(this.type);
    this.loadFields(struct);
    if (this.type) {
      this.getAggregationTypes();
    }
  }

  public setDisplayType($event: any): boolean {
    this.type = $event;

    if (this.type) {
      if (this.data.fields.length !== 0) {
        this.getAggregationTypes();
      }
      this.displayType = this.chartingUtils
        .chartTypes()
        .filter((el: any) => el.type === this.type)[0];
    }
    return true;
  }

  public runAggregation(): boolean {
    if (this.useTextEditor) {
      this.aggs = this.parseAggs(this.aggs);
    }
    const applicableOn = this.aggregationTemplateService.getChartTypeForAggregation(
      this.aggs
    );
    const returnVal = {
      type: this.displayType.type,
      aggregations: this.aggs,
      searchObjectName: this.data.searchObjectName,
      fieldToCount: this.data.fieldToCount,
      applicableOn,
      name: this.name,
      description: this.description
    };
    this.result.emit(returnVal);
    return true;
  }

  private parseAggs(aggs: any) {
    let parsed = {};
    try {
      parsed = JSON.parse(this.aggs);
    } catch (err) {
      alert('Parsing aggregation string error see console');
      console.log(err);
    }

    return parsed;
  }

  public cancel(): void {
    this.result.emit('cancel');
  }

  debug(o: any): string {
    return JSON.stringify(o);
  }
}
