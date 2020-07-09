import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Hits } from 'app/monitoring/model/search-response';
import { Observable, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { LogDataModel } from '../../../model/log-data-model';

@Component({
  selector: 'sb-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit, OnDestroy {
  // You can pass a Range that represents a range of lines that will be highlighted
  // There is also the possibility to scroll to a certain line
  // if you dont want to highlight anything you can still pass a hits Object
  @Input('searchResponse')
  searchResponse: Observable<any>;
  @Input('isStreaming')
  isStreaming: boolean;
  @Input('inRequest')
  inRequest: boolean;
  data: [Array<LogDataModel>, monaco.Range?, number?];
  @Output('more')
  public more = new EventEmitter<[number, boolean]>();
  // Monaco extracvts one field out of the shown data by default it's logmessage but this
  // property allows it to change
  @Input('monacoFieldSelection')
  public monacoFieldSelection = "logMessage";





  private highlightingRange: monaco.Range;
  private scollTo: number;
  private editor: any;

  editorOptions = { readOnly: true, language: 'json', glyphMargin: true };
  code: string;
  logs: Array<String> = [];

  subscription: Subscription;
  constructor() {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    if (this.searchResponse) {
      this.subscription = this.searchResponse.pipe(map((data: any) => {
        if (data.hits) {
          let returnVal = [data.hits, null, null];
          if ((data.highlightRange || data.scrollTo) && data.hits) {
            returnVal = [returnVal[0], data.highlightRange, data.scrollTo];
          }
          return returnVal;
        }

      })).subscribe((data: [Array<LogDataModel>, monaco.Range?, number?]) => {
        this.code = '';
        this.data = data;
        if (this.data[0]) {
          this.data[0].forEach(hit => {
            if (this.monacoFieldSelection === "COMPLETEOBJECT") {
              this.code += JSON.stringify(hit._source) + '\n';
            } else {
              this.code += hit._source[this.monacoFieldSelection] + '\n';
            }
          });
          if (data[1] || data[2]) {
            // we need some delay here since we have to wait until the data is rendered out
            timer(250).subscribe(k => this.highlight(data[1]!!, data[2]!!));
          }

        }

      })
    }
  }
  public highlight(highlightDateRange: monaco.Range, scrollTo: number, retries: number = 0) {
    if (this.editor) {
      scrollTo && this.editor.revealPositionInCenter({ lineNumber: scrollTo, column: 1 });

      highlightDateRange && this.editor.deltaDecorations([], [
        {
          range: highlightDateRange,
          options: {
            isWholeLine: true,
            className: 'myContentClass',
            glyphMarginClassName: 'myGlyphMarginClass'
          }
        }
      ]);
    } else {
      // retry every 250ms to prevent an error when the editor is not build up yet
      if (retries < 5) {
        // after 5 retries there must be an fatal error so we stop trying
        timer(250).subscribe(k => this.highlight(highlightDateRange, scrollTo, ++retries));
      }
    }
  }
  public onInit(editor: any) {
    this.editor = editor;
  }
  public loadMore() {
    this.more.emit([100, true]);
  }
}
export type HighlightingAndHits = {
  highlightRange: monaco.Range,
  scrollTo: number,
  hits: Array<LogDataModel>
}