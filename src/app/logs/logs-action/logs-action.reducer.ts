import * as moment from 'moment-mini-ts';
import { LogsAction } from '../../shared/types/logs/logs-action.type';
import { LogsActionEntity } from '../../shared/types/logs/logs-action-entity.type';
import { VirtualScrollActivePage } from '../../shared/types/shared/virtual-scroll-active-page.type';

const initialState: LogsAction = {
  ids: [],
  entities: {},
  lastCursorId: 0,
  filter: {
    trace: false,
    debug: false,
    info: false,
    notice: false,
    warning: false,
    error: false,
    fatal: false
  },
  stream: false,
  activePage: {},
  pages: []
};

export function reducer(state: LogsAction = initialState, action): LogsAction {
  switch (action.type) {

    case 'LOGS_ACTION_START_SUCCESS':
    case 'LOGS_ACTION_LOAD_SUCCESS': {
      const entities = setEntities(action, state);
      const activePage = setActivePage(entities, action);

      return {
        ...state,
        ids: setIds(action),
        entities: setEntities(action, state),
        lastCursorId: setLastCursorId(action),
        activePage,
        pages: setPages(activePage, state)
      };
    }

    case 'LOGS_ACTION_FILTER': {
      const stateFilter = {
        ...state.filter,
        [action.payload]: !state.filter[action.payload]
      };

      return {
        ...initialState,
        filter: stateFilter
      };
    }

    case 'LOGS_ACTION_STOP': {
      return {
        ...state,
        stream: false
      };
    }

    case 'LOGS_ACTION_START': {
      return {
        ...state,
        stream: true
      };
    }

    case 'LOGS_ACTION_RESET': {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
}

export function setIds(action): number[] {
  if (!action.payload.length) {
    return [];
  }

  return action.payload
    .map((item, index) => index)
    .sort((a, b) => a - b);
}

export function setEntities(action, state): { [id: string]: LogsActionEntity } {
  return action.payload.length === 0 ?
    {} :
    action.payload
      .reduce((accumulator, logsAction) => {
        const virtualScrollId = setVirtualScrollId(action, state, accumulator);

        return {
          ...accumulator,
          [virtualScrollId]: {
            ...logsAction,
            id: virtualScrollId,
            originalId: logsAction.id,
            datetime: moment(Math.ceil(logsAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
          }
        };
      }, {});
}

export function setLastCursorId(action): number {
  return action.payload.length - 1;
}

export function setVirtualScrollId(action, state, accumulator): number {
  const alreadySetRecords = Object.keys(accumulator);
  return action.payload.length - (alreadySetRecords.length + 1);
}

export function setActivePage(entities, action): VirtualScrollActivePage {
  if (!action.payload.length) {
    return null;
  }

  return {
    id: entities[action.payload.length - 1].id,
    start: entities[0],
    end: entities[action.payload.length - 1],
    numberOfRecords: action.payload.length
  };
}

export function setPages(activePage, state): number[] {
  if (!activePage) {
    return [];
  }

  const pagesArray = [...state.pages];

  if (pagesArray.indexOf(activePage.id) !== -1) {
    return [...state.pages];
  }

  if (Number(pagesArray[pagesArray.length - 1]) < activePage.id) {
    return [activePage.id].sort((a, b) => a - b);
  } else {
    return [...state.pages, activePage.id].sort((a, b) => a - b);
  }

}
