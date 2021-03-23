import * as moment from 'moment-mini-ts';
import {NetworkAction} from '../../shared/types/network/network-action.type';
import {NetworkActionEntity} from '../../shared/types/network/network-action-entity.type';

const initialState: NetworkAction = {
  ids: [],
  entities: {},
  lastCursorId: 0,
  filter: {
    local: false,
    remote: false,

    connection: false,
    meta: false,
    acknowledge: false,
    bootstrap: false,
    advertise: false,
    swap: false,
    deactivate: false,

    currentHead: false,
    currentBranch: false,
    operation: false,
    protocol: false,
    blockHeaders: false,
    blockOperations: false,
    blockOperationsHashes: false
  },
  stream: false,
  urlParams: '',
  activePage: {},
  pages: []
};

export function reducer(state: NetworkAction = initialState, action): NetworkAction {
  switch (action.type) {

    // initialize or reset state
    case 'NETWORK_LOAD': {
      return initialState;
    }

    // add network url params
    // case 'NETWORK_ACTION_LOAD': {
    //   return {
    //     ...state,
    //     urlParams: action.payload.filter ? action.payload.filter : ''
    //   };
    // }

    case 'NETWORK_ACTION_START_SUCCESS':
    case 'NETWORK_ACTION_LOAD_SUCCESS': {
      const entities = setEntities(action, state);
      const activePage = setActivePage(entities, action);

      return {
        ...state,
        ids: setIds(action, state),
        entities,
        lastCursorId: setLastCursorId(action, state),
        activePage,
        pages: setPages(activePage, state),
        stream: action.type === 'NETWORK_ACTION_START_SUCCESS',
      };
    }

    case 'NETWORK_ACTION_FILTER': {
      const stateFilter = {
        ...state.filter,
        [action.payload]: !state.filter[action.payload]
      };

      return {
        ...initialState,
        filter: stateFilter
      };
    }

    case 'NETWORK_ACTION_STOP': {
      return {
        ...state,
        stream: false
      };
    }

    default:
      return state;
  }
}

export function setIds(action, state): Array<number> {
  if (!action.payload.length) {
    return [];
  }

  return action.payload
    .map((item, index) => index)
    // .map(item => item.id)
    .sort((a, b) => a - b);
}

export function setEntities(action, state): { [id: string]: NetworkActionEntity } {
  return action.payload.length === 0 ?
    {} :
    action.payload
      .reduce((accumulator, networkAction) => {
        const hexValues = setHexValues(networkAction.original_bytes);
        const virtualScrollId = setVirtualScrollId(action, state, accumulator);

        if (networkAction.message && networkAction.message.length && networkAction.message[0].type) {
          const payload = {...networkAction.message[0]};
          delete payload.type;

          return {
            ...accumulator,
            [virtualScrollId]: {
              ...networkAction,
              hexValues,
              id: virtualScrollId,
              originalId: networkAction.id,
              category: 'P2P',
              kind: networkAction.message[0].type,
              payload,
              preview: JSON.stringify(networkAction.message),
              datetime: moment.utc(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
            }
          };
        } else {
          return {
            ...accumulator,
            [virtualScrollId]: {
              ...networkAction,
              hexValues,
              id: virtualScrollId,
              originalId: networkAction.id,
              payload: networkAction.message,
              datetime: moment.utc(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
            }
          };
        }
      }, {});
}

export function setLastCursorId(action, state): number {
  return action.payload.length - 1;
}

export function setHexValues(bytes): string[] {
  if (!bytes || !bytes.length) {
    return [];
  }
  return bytes.map((item) => {
    return item.toString(16).padStart(6, '0').toUpperCase();
  }) || [];
}

export function setVirtualScrollId(action, state, accumulator): number {
  const alreadySetRecords = Object.keys(accumulator);
  return action.payload.length - (alreadySetRecords.length + 1);
}

export function setActivePage(entities, action): any {
  return {
    id: entities[action.payload.length - 1].originalId,
    start: entities[0],
    end: entities[action.payload.length - 1],
    numberOfRecords: action.payload.length
  };
}

export function setPages(activePage, state) {
  const pages = state.pages.slice();
  pages.push(activePage);

  return pages;
}


// filter network items according to traffic source
// export function networkActionSourceFilter(entity, filter) {
//
//     if (filter.local && filter.remote) {
//         return true;
//     }
//
//     // process all connection messages
//     if (entity.type === 'connection_message' && filter.connection) {
//
//         if (filter.local && !entity.incoming) { return true; }
//         if (filter.remote && entity.incoming) { return true; }
//
//     }
//
//     // process all meta messages
//     if (entity.type === 'metadata' && filter.metadata) {
//
//         if (filter.local && !entity.incoming) { return true; }
//         if (filter.remote && entity.incoming) { return true; }
//
//     }
//
//     // process all p2p messages
//     if (entity.type === 'p2p_message') {
//
//         if (filter.local) {
//
//             if (filter.bootstrap && entity.kind === 'bootstrap' && !entity.incoming) { return true; }
//
//             if (filter.current_head && entity.kind === 'get_current_head' && !entity.incoming) { return true; }
//             if (filter.current_head && entity.kind === 'current_head' && entity.incoming) { return true; }
//
//             if (filter.current_branch && entity.kind === 'get_current_branch' && !entity.incoming) { return true; }
//             if (filter.current_branch && entity.kind === 'current_branch' && entity.incoming) { return true; }
//
//             if (filter.block_headers && entity.kind === 'get_block_headers' && !entity.incoming) { return true; }
//             if (filter.block_headers && entity.kind === 'block_header' && entity.incoming) { return true; }
//
//             if (filter.block_operations && entity.kind === 'get_operations_for_blocks' && !entity.incoming) { return true; }
//             if (filter.block_operations && entity.kind === 'operations_for_blocks' && entity.incoming) { return true; }
//
//         }
//
//         if (filter.remote) {
//
//             if (filter.bootstrap && entity.kind === 'bootstrap' && entity.incoming) { return true; }
//
//             if (filter.current_head && entity.kind === 'get_current_head' && entity.incoming) { return true; }
//             if (filter.current_head && entity.kind === 'current_head' && !entity.incoming) { return true; }
//
//             if (filter.current_branch && entity.kind === 'get_current_branch' && entity.incoming) { return true; }
//             if (filter.current_branch && entity.kind === 'current_branch' && !entity.incoming) { return true; }
//
//             if (filter.block_headers && entity.kind === 'get_block_headers' && entity.incoming) { return true; }
//             if (filter.block_headers && entity.kind === 'block_header' && !entity.incoming) { return true; }
//
//             if (filter.block_operations && entity.kind === 'get_operations_for_blocks' && entity.incoming) { return true; }
//             if (filter.block_operations && entity.kind === 'operations_for_blocks' && !entity.incoming) { return true; }
//
//         }
//
//     }
//
//     return false;
// }
