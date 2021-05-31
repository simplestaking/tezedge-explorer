import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of, Subject, timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { SystemResourcesActionTypes } from './system-resources.actions';
import { SystemResourcesService } from './system-resources.service';
import { SystemResources } from '../../shared/types/resources/system/system-resources.type';
import { State } from '../../app.reducers';

@Injectable({ providedIn: 'root' })
export class SystemResourcesEffects {

  private resourcesDestroy$ = new Subject<void>();

  @Effect()
  ResourcesLoadEffect$ = this.actions$.pipe(
    ofType(SystemResourcesActionTypes.LoadResources),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    switchMap(({ action, state }) => {
      const resourcesData$ = this.resourcesService.getSystemResources(state.settingsNode.activeNode.monitoring, action.payload.isSmallDevice)
        .pipe(
          map((resources: SystemResources) => ({
            type: SystemResourcesActionTypes.ResourcesLoadSuccess,
            payload: resources
          })),
          catchError(error => of({ type: SystemResourcesActionTypes.ResourcesLoadError, payload: error }))
        );

      if (action.payload && action.payload.initialLoad) {
        return resourcesData$;
      }

      this.resourcesDestroy$ = new Subject<void>();

      return timer(0, 5000)
        .pipe(
          takeUntil(this.resourcesDestroy$),
          switchMap(() => resourcesData$)
        );
    })
  );

  @Effect({ dispatch: false })
  ResourcesCloseEffect$ = this.actions$.pipe(
    ofType(SystemResourcesActionTypes.ResourcesClose),
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({ action, state })),
    tap(({ action, state }) => {
      this.resourcesDestroy$.next();
      this.resourcesDestroy$.complete();
    })
  );

  constructor(private resourcesService: SystemResourcesService,
              private actions$: Actions,
              private store: Store<State>) { }
}