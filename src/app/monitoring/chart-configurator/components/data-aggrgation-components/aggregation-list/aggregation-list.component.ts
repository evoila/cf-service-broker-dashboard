import {
  Component,
  OnInit,
  Input,
  Inject,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';
import { Aggregation } from '../../../model/aggregation';
import {
  MatBottomSheet,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA
} from '@angular/material';

@Component({
  selector: 'sb-aggregation-list',
  templateUrl: './aggregation-list.component.html',
  styleUrls: ['./aggregation-list.component.scss']
})
export class AggregationListComponent implements OnInit {
  @Input('aggregations')
  public aggregations$: Observable<Array<Aggregation>>;

  // Output Emitter is just a toggle for the Component above to render AggregationEditor
  @Output('aggregationEditor')
  public openAggregationEditor$ = new EventEmitter<Boolean>();

  public aggregations: Array<Aggregation>;
  constructor(private bottomSheet: MatBottomSheet) {}

  ngOnInit() {
    this.aggregations$.subscribe(
      (aggregations: Array<Aggregation>) => (this.aggregations = aggregations)
    );
  }
  public showAggregation(aggregation: Aggregation): void {
    this.bottomSheet.open(BottomSheetAggregationSheet, { data: aggregation });
  }
  openAggregationEditor(): void {
    this.openAggregationEditor$.next(true);
  }
}

@Component({
  selector: 'bottom-sheet-aggregation-sheet',
  templateUrl: './bottom-sheet-aggregation-sheet.html',
  styleUrls: ['./bottom-sheet-aggregation-sheet.scss']
})
export class BottomSheetAggregationSheet {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<BottomSheetAggregationSheet>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Aggregation
  ) {}

  dismiss(): void {
    this.bottomSheetRef.dismiss();
  }
}
