import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { VirtualScrollDirective } from '../../shared/virtual-scroll/virtual-scroll.directive';
import { LogsAction } from '../../shared/types/logs/logs-action.type';
import { LogsActionEntity } from '../../shared/types/logs/logs-action-entity.type';
import { State } from '../../app.reducers';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TezedgeTimeValidator } from '../../shared/validators/tezedge-time.validator';

@UntilDestroy()
@Component({
  selector: 'app-logs-action',
  templateUrl: './logs-action.component.html',
  styleUrls: ['./logs-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsActionComponent implements OnInit, OnDestroy {

  virtualScrollItems: LogsAction;
  logsActionItem: LogsActionEntity;
  logsActionShow: boolean;
  filtersState = {
    open: true
  };
  virtualPageSize = 1000;
  activeFilters = [];

  @ViewChild(VirtualScrollDirective) vrFor: VirtualScrollDirective;

  readonly dateNow = new Date();
  formGroup: FormGroup;

  constructor(private store: Store<State>,
              private changeDetector: ChangeDetectorRef,
              private ngZone: NgZone,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.store.dispatch({ type: 'LOGS_ACTION_RESET' });
    this.scrollStart(null);
    this.initForm();

    this.store.select('logsAction')
      .pipe(untilDestroyed(this))
      .subscribe((data: LogsAction) => {
        this.virtualScrollItems = data;
        this.logsActionShow = this.virtualScrollItems.ids.length > 0;

        this.activeFilters = this.setActiveFilters();

        if (this.logsActionShow && !this.logsActionItem) {
          this.logsActionItem = this.virtualScrollItems.entities[this.virtualScrollItems.ids[this.virtualScrollItems.ids.length - 1]];
        }

        this.changeDetector.detectChanges();

        // if (this.virtualScrollItems.ids.length > 0 && this.vrFor) {
        //   this.vrFor.afterReceivingData();
        // }
        // this.logsActionList = data.ids.map(id => ({id, ...data.entities[id]}));

      });

    // this.logsAction$ = this.store.select('logsAction');
    // this.logsDataSource = new LogsDataSource(this.logsAction$, this.store);
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      date: new FormControl('', [Validators.required, TezedgeTimeValidator.isDate]),
      hour: new FormControl('', [Validators.required, TezedgeTimeValidator.isHour]),
      minute: new FormControl('', [Validators.required, Validators.max(59)]),
      second: new FormControl('', [Validators.required, Validators.max(59)]),
      millisecond: new FormControl('', [Validators.required, Validators.max(999)]),
    });
  }

  searchByTime(): void {
    this.formGroup.markAllAsTouched();
    console.log(this.formGroup);
    if (this.formGroup.valid) {
      this.scrollStop();

    }
  }

  getItems($event) {
    this.store.dispatch({
      type: 'LOGS_ACTION_LOAD',
      payload: {
        cursor_id: $event?.nextCursorId,
        limit: $event?.limit
      }
    });
  }

  loadPreviousPage() {
    if (this.virtualScrollItems.stream) {
      this.scrollStop();
    }
    this.getItems({
      nextCursorId: this.virtualScrollItems.activePage.start.originalId,
      limit: this.virtualPageSize
    });
  }

  loadNextPage() {
    const actualPageIndex = this.virtualScrollItems.pages.findIndex(pageId => Number(pageId) === this.virtualScrollItems.activePage.id);

    if (actualPageIndex === this.virtualScrollItems.pages.length - 1) {
      return;
    }

    const nextPageId = this.virtualScrollItems.pages[actualPageIndex + 1];

    this.getItems({
      nextCursorId: nextPageId,
      limit: this.virtualPageSize
    });
  }

  startStopDataStream(event) {
    if (event.stop) {
      this.scrollStop();
    } else {
      this.scrollStart(event);
    }
  }

  scrollStart($event) {
    if (this.virtualScrollItems && this.virtualScrollItems.stream) {
      return;
    }
    this.initForm();
    this.store.dispatch({
      type: 'LOGS_ACTION_START',
      payload: {
        limit: $event?.limit ? $event.limit : this.virtualPageSize
      }
    });
  }

  scrollStop() {
    if (!this.virtualScrollItems.stream) {
      return;
    }

    this.store.dispatch({
      type: 'LOGS_ACTION_STOP'
    });
  }

  scrollToEnd() {
    this.scrollStart(null);
  }

  // setFiltersVisibility(show): void {
  //   this.filtersState.open = show;
  //
  //   // Trigger resize event so the virtual scroll directive adjust the values for the new height of the list
  //   window.dispatchEvent(new Event('resize'));
  // }

  filterType(filterType) {
    // dispatch action
    this.store.dispatch({
      type: 'LOGS_ACTION_FILTER',
      payload: filterType
    });
  }

  setActiveFilters(): string[] {
    return Object.keys(this.virtualScrollItems.filter)
      .reduce((accumulator, filter) => {
        if (this.virtualScrollItems.filter[filter]) {
          return [
            ...accumulator,
            filter
          ];
        } else {
          return accumulator;
        }
      }, []);
  }

  tableMouseEnter(item) {
    this.ngZone.runOutsideAngular(() => {
      if (this.logsActionItem && this.logsActionItem.id === item.id) {
        return;
      }

      this.ngZone.run(() => {
        this.logsActionItem = item;
      });
    });
  }

  ngOnDestroy() {
    // stop logs stream
    this.store.dispatch({
      type: 'LOGS_ACTION_STOP'
    });
  }
}
