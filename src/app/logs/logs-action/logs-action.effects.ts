import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ObservedValueOf, of, Subject, timer } from 'rxjs';
import { State } from '../../app.reducers';

const logActionDestroy$ = new Subject();

@Injectable()
export class LogsActionEffects {

  @Effect()
  LogsActionLoad$ = this.actions$.pipe(
    ofType('LOGS_ACTION_LOAD'),

    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({action, state})),

    switchMap(({ action, state }) => {
      return this.http.get(setUrl(action, state));
    }),

    map((payload) => ({type: 'LOGS_ACTION_LOAD_SUCCESS', payload})),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'LOGS_ACTION_LOAD_ERROR',
        payload: error
      });
      return caught;
    })
  );

  @Effect()
  LogsActionFilter$ = this.actions$.pipe(
    ofType('LOGS_ACTION_FILTER'),

    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({action, state})),

    tap(response => {
      logActionDestroy$.next();
      logsActionFilter(response.action, response.state);
    }),

    // dispatch action
    map((payload) => ({ type: 'LOGS_ACTION_LOAD', payload })),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'LOGS_ACTION_FILTER_ERROR',
        payload: error
      });
      return caught;
    })
  );

  // load logs actions
  @Effect()
  LogsActionStartEffect$ = this.actions$.pipe(
    ofType('LOGS_ACTION_START'),

    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({action, state})),

    switchMap(({ action, state }) =>
      // get header data every second
      timer(0, 2000).pipe(
        takeUntil(logActionDestroy$),
        switchMap(() =>
          this.http.get(setUrl(action, state)).pipe(
            map(response => ({ type: 'LOGS_ACTION_START_SUCCESS', payload: response })),
            catchError(error => of({ type: 'LOGS_ACTION_START_ERROR', payload: error }))
          )
        )
      )
    )
  );

  // stop logs action download
  @Effect({ dispatch: false })
  LogsActionStopEffect$ = this.actions$.pipe(
    ofType('LOGS_ACTION_STOP'),
    // merge state
    withLatestFrom(this.store, (action: any, state: ObservedValueOf<Store<State>>) => ({action, state})),
    // init app modules
    tap(({ action, state }) => {
      // console.log('[LOGS_ACTION_STOP] stream', state.logsAction.stream);
      // close all open observables
      // if (state.logsAction.stream) {
      logActionDestroy$.next();
      // }
    })
  );

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<State>
  ) {
  }

}

export function setUrl(action, state) {
  const url = `${state.settingsNode.activeNode.features.find(f => f.name === 'debugger').url}/v2/log?node_name=${state.settingsNode.activeNode.p2p_port}&`;

  const filters = logsActionFilter(action, state);
  const cursor = logsActionCursor(action);
  const timeInterval = logsActionTimeInterval(action);
  const limit = logsActionLimit(action);

  return `${url}${filters.length ? `${filters}&` : ''}${cursor.length ? `${cursor}&` : ''}${timeInterval}${limit}`;
}

// use limit to load just the necessary number of records
export function logsActionLimit(action) {
  const limitNr = action.payload && action.payload.limit ?
    action.payload.limit :
    '1000';

  return `limit=${limitNr}`;
}

// use cursor to load previous pages
export function logsActionCursor(action) {
  return action.payload && action.payload.cursor_id ?
    `cursor=${action.payload.cursor_id}` :
    '';
}

export function logsActionTimeInterval(action): string {
  return action.payload && action.payload.from && action.payload.to ?
    `from=${action.payload.from}&to=${action.payload.to}&` :
    '';
}

// filter logs action
export function logsActionFilter(action, state) {
  let filterType = '';

  if (state.logsAction && state.logsAction.filter) {
    const stateFilter = state.logsAction.filter;

    filterType = stateFilter.trace ? filterType + 'trace,' : filterType;
    filterType = stateFilter.debug ? filterType + 'debug,' : filterType;
    filterType = stateFilter.info ? filterType + 'info,' : filterType;
    filterType = stateFilter.notice ? filterType + 'notice,' : filterType;
    filterType = stateFilter.warning ? filterType + 'warning,warn,' : filterType;
    filterType = stateFilter.error ? filterType + 'error,' : filterType;
    filterType = stateFilter.fatal ? filterType + 'fatal,' : filterType;

    // remove the last ,
    filterType = filterType.length > 0 ? 'log_level=' + filterType.slice(0, -1) : '';
  }

  return filterType;
}
