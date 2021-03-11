import * as moment from 'moment-mini-ts';
import { NetworkStats } from '../../shared/types/network/network-stats.type';

const initialState: NetworkStats = {
    eta: '',
    currentBlockCount: 0,
    downloadedBlocks: 0,
    downloadRate: 0,
    currentApplicationSpeed: 0,
    averageApplicationSpeed: 0,
    lastAppliedBlock: {
        level: 0,
    },
    blockTimestamp: 0,
    etaApplications: undefined
};

export function reducer(state: NetworkStats = initialState, action): NetworkStats {
    switch (action.type) {

        case 'incomingTransfer': {
            return {
                ...state,
                eta: Math.floor(action.payload.eta / 60) + ' m ' + Math.floor(action.payload.eta % 60) + ' s',
                currentBlockCount: action.payload.currentBlockCount,
                downloadedBlocks: action.payload.downloadedBlocks,
                downloadRate: Math.floor(action.payload.downloadRate),
            };
        }

        case 'blockApplicationStatus': {
            return {
                ...state,
                currentApplicationSpeed: action.payload.currentApplicationSpeed,
                averageApplicationSpeed: action.payload.averageApplicationSpeed,
                lastAppliedBlock: action.payload.lastAppliedBlock ? action.payload.lastAppliedBlock : state.lastAppliedBlock,
                etaApplications:
                    Math.floor((state.currentBlockCount - state.lastAppliedBlock.level) / action.payload.currentApplicationSpeed) + ' m ',
            };
            // action.payload.currentApplicationSpeed
        }

        case 'MONITORING_LOAD':
        case 'MONITORING_LOAD_ERROR':
            return initialState;

        case 'NETWORK_STATS_LOAD_SUCCESS': {
            const etaApplicationMinutes =
                moment().diff(moment(action.payload.timestamp), 'minutes') / state.currentApplicationSpeed;

            return {
                ...state,
                blockTimestamp: action.payload.timestamp,
                currentBlockCount: action.payload.timestamp === state.blockTimestamp ? action.payload.level :
                    Math.floor(moment().diff(moment(action.payload.timestamp), 'minutes') /
                        // TODO: refactor and use constans
                        (moment(action.payload.timestamp).diff(moment(state.blockTimestamp), 'minutes') /
                            (action.payload.level - state.lastAppliedBlock.level)
                        )
                    ),
                currentApplicationSpeed: state.lastAppliedBlock.level === 0 ? 0 :
                    (action.payload.level - state.lastAppliedBlock.level) * 60,
                lastAppliedBlock: {
                    level: action.payload.level,
                },
                etaApplications: state.currentApplicationSpeed === 0 ? '0 m' :
                    Math.floor(etaApplicationMinutes / 60) + ' h ' +
                    Math.floor(etaApplicationMinutes % 60) + ' m ' ,
            };
        }

        default:
            return state;
    }
}
