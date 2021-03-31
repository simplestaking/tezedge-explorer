import * as moment from 'moment-mini-ts';
import {NetworkAction} from '../../shared/types/network/network-action.type';
import {NetworkActionEntity} from '../../shared/types/network/network-action-entity.type';
import {VirtualScrollActivePage} from '../../shared/types/shared/virtual-scroll-active-page.type';
import {NetworkActionDetails} from '../../shared/types/network/network-action-details.type';

const initialState: NetworkAction = {
  ids: [],
  entities: {},
  lastCursorId: 0,
  selected: {},
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

    case 'NETWORK_LOAD':
    case 'NETWORK_ACTION_RESET': {
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
        ids: setIds(action),
        entities,
        lastCursorId: setLastCursorId(action),
        activePage,
        pages: setPages(activePage, state)
      };
    }

    case 'NETWORK_ACTION_FILTER': {
      const stateFilter = {
        ...state.filter,
        [action.payload]: !state.filter[action.payload],
      };

      return {
        ...initialState,
        urlParams: state.urlParams,
        filter: stateFilter
      };
    }

    case 'NETWORK_ACTION_ADDRESS': {
      return {
        ...state,
        urlParams: action.payload.urlParams ? action.payload.urlParams : ''
      };
    }

    case 'NETWORK_ACTION_STOP': {
      return {
        ...state,
        stream: false
      };
    }

    case 'NETWORK_ACTION_START': {
      return {
        ...state,
        stream: true
      };
    }

    case 'NETWORK_ACTION_DETAILS_LOAD_SUCCESS': {
      return {
        ...state,
        selected: setDetails(action)
      };
    }

    default:
      return state;
  }
}

export function setDetails(action): NetworkActionDetails {
  if (!action.payload) {
    return new NetworkActionDetails();
  }

  const hexValues = action.payload.original_bytes ?
    setHexValues(action.payload.original_bytes) : [];

  // if (action.payload.message && action.payload.message.length && action.payload.message[0].type) {
  //   payload = {...action.payload.message[0]};
  //   delete payload.type;
  // } else {
  //   payload = action.payload;
  //   delete payload.error;
  //   delete payload.original_bytes;
  // }

  return {
    id: action.payload.id,
    hexValues,
    message: action.payload.message,
    error: action.payload.error
  };
}

export function setIds(action): number[] {
  if (!action.payload.length) {
    return [];
  }

  return action.payload
    .map((item, index) => index)
    .sort((a, b) => a - b);
}

export function setEntities(action, state): { [id: string]: NetworkActionEntity } {
  return action.payload.length === 0 ?
    {} :
    action.payload
      .reduce((accumulator, networkAction) => {
        const virtualScrollId = setVirtualScrollId(action, state, accumulator);

        return {
          ...accumulator,
          [virtualScrollId]: {
            ...networkAction,
            id: virtualScrollId,
            originalId: networkAction.id,
            payload: networkAction.message,
            datetime: moment(Math.ceil(networkAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY')
          }
        };
      }, {});
}

export function setLastCursorId(action): number {
  return action.payload.length - 1;
}

export function setHexValues(bytes): string[][] {
  if (!bytes || !bytes.length) {
    return [];
  }

  let row = [];
  const hexArray = [];

  bytes.forEach((byte, index) => {
    if (index % 16 === 0 && index > 0) {
      hexArray.push(row);
      console.log('reset');
      row = [];
    }
    row.push(byte);
  });

  hexArray.push(row); // this is the incomplete row, with less than 16 elements

  return hexArray;
  // return bytes.map((item) => {
  //   return item.toString(16).padStart(6, '0').toUpperCase();
  // }) || [];
}

export function setVirtualScrollId(action, state, accumulator): number {
  const alreadySetRecords = Object.keys(accumulator);
  return action.payload.length - (alreadySetRecords.length + 1);
}

export function setActivePage(entities, action): VirtualScrollActivePage {
  if (!action.payload.length) {
    return {};
  }

  return {
    id: entities[action.payload.length - 1].originalId,
    start: entities[0],
    end: entities[action.payload.length - 1],
    numberOfRecords: action.payload.length
  };
}

export function setPages(activePage, state): number[] {
  if (!activePage.id) {
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
