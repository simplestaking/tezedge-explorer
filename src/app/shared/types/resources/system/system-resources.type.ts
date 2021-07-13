import { SystemResourcesSeries } from './system-resources-series.type';
import { SystemResourcesSummary } from './system-resources-summary.type';

export class SystemResources {
  cpu: SystemResourcesSeries[];
  memory: SystemResourcesSeries[];
  storage: SystemResourcesSeries[];
  xTicksValues: string[];
  resourcesSummary: SystemResourcesSummary;
  colorScheme: { domain: string[] };
}
