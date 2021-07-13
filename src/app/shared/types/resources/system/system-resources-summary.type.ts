import { SystemResourcesSummaryBlock } from './system-resources-summary-block.type';

export interface SystemResourcesSummary {
  cpu: SystemResourcesSummaryBlock[];
  memory: SystemResourcesSummaryBlock[];
  storage: SystemResourcesSummaryBlock[];
  timestamp: string;
}
