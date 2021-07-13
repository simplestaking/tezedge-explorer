import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { BreakpointObserver } from '@angular/cdk/layout';
import { delay, filter, skip } from 'rxjs/operators';
import { SystemResourcesActionTypes } from './system-resources.actions';
import { SystemResources } from '../../shared/types/resources/system/system-resources.type';
import { systemResources } from '../resources/resources.reducer';

export type ResourceType = 'cpu' | 'memory' | 'storage';

@UntilDestroy()
@Component({
  selector: 'app-system-resources',
  templateUrl: './system-resources.component.html',
  styleUrls: ['./system-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemResourcesComponent implements OnInit, OnDestroy {

  systemResources$: Observable<SystemResources>;

  readonly yAxisPercentageConversion = (value) => `${value}%`;
  readonly yAxisGigaBytesConversion = (value) => (value < 1 ? value : (value + '.00')) + ' GB';
  readonly yAxisMegaBytesConversion = (value) => `${value} MB`;

  activeSummary: ResourceType = 'storage';

  private isSmallDevice: boolean;

  constructor(private zone: NgZone,
              private store: Store<State>,
              private cdRef: ChangeDetectorRef,
              private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.handleSmallDevices();
    this.listenToResourcesChange();
  }

  toggleActiveSummary(value: ResourceType): void {
    this.activeSummary = value;
  }

  private listenToResourcesChange(): void {
    this.systemResources$ = this.store.pipe(
      untilDestroyed(this),
      select(systemResources),
      filter(resources => !!resources),
    );
    this.store.pipe(
      untilDestroyed(this),
      select(state => state.app),
      delay(400)
    ).subscribe(() => this.getResources());
  }

  private handleSmallDevices(): void {
    this.isSmallDevice = window.innerWidth < 1100;
    this.breakpointObserver.observe('(min-width: 1100px)')
      .pipe(untilDestroyed(this), skip(1))
      .subscribe(() => {
        this.isSmallDevice = window.innerWidth < 1100;
        this.getResources();
      });
  }

  private getResources(): void {
    this.store.dispatch({
      type: SystemResourcesActionTypes.SYSTEM_RESOURCES_LOAD,
      payload: { isSmallDevice: this.isSmallDevice }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch({ type: SystemResourcesActionTypes.SYSTEM_RESOURCES_CLOSE });
  }
}
