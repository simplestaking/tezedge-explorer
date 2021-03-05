import {Injectable} from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {tap, map, switchMap, withLatestFrom, catchError, takeUntil} from 'rxjs/operators';
import {of, Subject, timer} from 'rxjs';
import {setUrl} from '../storage-block/storage-block.effects';


@Injectable()
export class StorageActionEffects {

  @Effect()
  StorageBlockAction$ = this.actions$.pipe(
    ofType('STORAGE_BLOCK_ACTION_LOAD'),

    // merge state
    withLatestFrom(this.store, (action: any, state) => ({action, state})),

    switchMap(({action, state}) => {
      return this.http.get(state.settingsNode.activeNode.http + '/dev/chains/main/actions/blocks/' + action.payload.blockHash);
    }),
    // dispatch action
    map((payload) => ({type: 'STORAGE_BLOCK_ACTION_LOAD_SUCCESS', payload})),
    catchError((error, caught) => {
      console.error(error);
      this.store.dispatch({
        type: 'STORAGE_BLOCK_ACTION_LOAD_ERROR',
        payload: error,
      });
      return caught;
    })
  );

  // @Effect()
  // StorageAddressAction$ = this.actions$.pipe(
  //   ofType('STORAGE_ADDRESS_ACTION_LOAD'),
  //
  //   // merge state
  //   withLatestFrom(this.store, (action: any, state) => ({action, state})),
  //
  //   switchMap(({action, state}) => {
  //     return this.http.get(state.settingsNode.activeNode.http + '/dev/chains/main/actions/contracts/' + action.payload.addressHanpm sh + '?limit=30');
  //   }),
  //   // change data structure
  //   map((payload: any) => payload.data.map(action => action.action)),
  //   // tap(payload => console.log('[STORAGE_BLOCK_ACTION_LOAD]', payload)),
  //   // dispatch action
  //   map((payload) => ({type: 'STORAGE_ADDRESS_ACTION_LOAD_SUCCESS', payload})),
  //   catchError((error, caught) => {
  //     console.error(error);
  //     this.store.dispatch({
  //       type: 'STORAGE_ADDRESS_ACTION_LOAD_ERROR',
  //       payload: error,
  //     });
  //     return caught;
  //   })
  // );

  constructor(
    private http: HttpClient,
    private actions$: Actions,
    private store: Store<any>,
  ) {
  }

}
