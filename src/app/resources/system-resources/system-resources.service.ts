import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { SystemResources } from '../../shared/types/resources/system/system-resources.type';
import { DatePipe } from '@angular/common';
import { SystemResourcesSummary } from '../../shared/types/resources/system/system-resources-summary.type';
import { SystemResourcesSummaryBlock } from '../../shared/types/resources/system/system-resources-summary-block.type';

const MB_DIVISOR = 1048576;
const GB_DIVISOR = 1073741824;
const COLOR_SCHEME = {
  domain: [
    '#46afe3',
    '#bf5af2',
    '#32d74b',
    '#ff9f0a',
    '#ffd60a',
    '#00dbc6',
    '#ff2d55',
  ]
};

@Injectable({
  providedIn: 'root'
})
export class SystemResourcesService {

  constructor(private http: HttpClient,
              private datePipe: DatePipe) {}

  getSystemResources(endpoint: string, isSmallDevice: boolean): Observable<SystemResources> {
    return this.http.get<SystemResources>(endpoint)
      .pipe(
        map(response => this.mapGetSystemResourcesResponse(response, isSmallDevice)),
        catchError(err => throwError(err))
      );
  }

  private mapGetSystemResourcesResponse(response: any, isSmallDevice: boolean): SystemResources {
    const resources = response.reverse().map(responseItem => {
      const resource: any = {};
      resource.timestamp = this.datePipe.transform(responseItem.timestamp * 1000, 'MM/dd, HH:mm:ss');

      resource.memory = {};
      resource.memory.node = {};
      resource.memory.node.resident = responseItem.memory.node.resident_mem / MB_DIVISOR;
      resource.memory.node.virtual = responseItem.memory.node.virtual_mem / MB_DIVISOR;
      resource.memory.total = resource.memory.node.resident;

      if (responseItem.memory.protocol_runners) {
        resource.memory.protocolRunners = {};
        resource.memory.protocolRunners.resident = responseItem.memory.protocol_runners.resident_mem / MB_DIVISOR;
        resource.memory.protocolRunners.virtual = responseItem.memory.protocol_runners.virtual_mem / MB_DIVISOR;
        resource.memory.total += resource.memory.protocolRunners.resident;
      }

      if (responseItem.memory.validators) {
        resource.memory.validators = {};
        resource.memory.validators.resident = responseItem.memory.validators.resident_mem / MB_DIVISOR;
        resource.memory.validators.virtual = responseItem.memory.validators.virtual_mem / MB_DIVISOR;
        resource.memory.total += resource.memory.validators.resident;
      }

      resource.cpu = {};
      resource.cpu.node = responseItem.cpu.node;
      resource.cpu.protocolRunners = responseItem.cpu.protocol_runners;
      resource.cpu.total = Object.values(resource.cpu).filter(Boolean).reduce((total: number, current: number) => total + current, 0);

      resource.disk = {};
      resource.disk.blockStorage = responseItem.disk.block_storage / GB_DIVISOR;
      resource.disk.contextIrmin = responseItem.disk.context_irmin / GB_DIVISOR;
      resource.disk.mainDb = (responseItem.disk.main_db !== undefined) ? responseItem.disk.main_db / GB_DIVISOR : undefined;
      resource.disk.debugger = responseItem.disk.debugger / GB_DIVISOR;
      resource.disk.contextActions = (responseItem.disk.context_actions !== undefined) ? responseItem.disk.context_actions / GB_DIVISOR : undefined;
      resource.disk.contextMerkleRocksDb = (responseItem.disk.context_merkle_rocksdb !== undefined) ? responseItem.disk.context_merkle_rocksdb / GB_DIVISOR : undefined;
      resource.disk.total = Object.values(resource.disk).filter(Boolean).reduce((total: number, current: number) => total + current, 0);
      return resource;
    });
    return this.createChartData(resources, isSmallDevice);
  }


  private createChartData(resources: any[], isSmallDevice: boolean): SystemResources {
    const chartData = new SystemResources();

    chartData.resourcesSummary = this.createSummaryBlocks(resources);
    chartData.colorScheme = COLOR_SCHEME;
    chartData.memory = [];
    chartData.disk = [];
    chartData.cpu = [];
    if (resources[0].cpu.protocolRunners !== undefined) {
      chartData.cpu.push({
        name: 'TOTAL',
        series: this.getSeries(resources, 'cpu.total')
      });
      chartData.cpu.push({
        name: 'NODE',
        series: this.getSeries(resources, 'cpu.node')
      });
      chartData.cpu.push({
        name: 'PROTOCOL RUNNERS',
        series: this.getSeries(resources, 'cpu.protocolRunners')
      });
    } else {
      chartData.cpu.push({
        name: 'NODE',
        series: this.getSeries(resources, 'cpu.node')
      });
    }

    chartData.memory.push({
      name: 'TOTAL',
      series: this.getSeries(resources, 'memory.total')
    });
    chartData.memory.push({
      name: 'NODE',
      series: this.getSeries(resources, 'memory.node.resident')
    });
    if (resources[0].memory.protocolRunners !== undefined) {
      chartData.memory.push({
        name: 'PROTOCOL RUNNERS',
        series: this.getSeries(resources, 'memory.protocolRunners.resident')
      });
    }
    if (resources[0].memory.validators !== undefined) {
      chartData.memory.push({
        name: 'VALIDATORS',
        series: this.getSeries(resources, 'memory.validators.resident')
      });
    }

    chartData.disk.push({
      name: 'TOTAL',
      series: this.getSeries(resources, 'disk.total')
    });
    chartData.disk.push({
      name: 'BLOCK STORAGE',
      series: this.getSeries(resources, 'disk.blockStorage')
    });
    chartData.disk.push({
      name: 'CONTEXT IRMIN',
      series: this.getSeries(resources, 'disk.contextIrmin')
    });
    chartData.disk.push({
      name: 'DEBUGGER',
      series: this.getSeries(resources, 'disk.debugger')
    });
    if (resources[0].disk.contextActions !== undefined) {
      chartData.disk.push({
        name: 'CONTEXT ACTIONS',
        series: this.getSeries(resources, 'disk.contextActions')
      });
    }
    if (resources[0].disk.contextMerkleRocksDb !== undefined) {
      chartData.disk.push({
        name: 'CONTEXT MERKLE ROCKS DB',
        series: this.getSeries(resources, 'disk.contextMerkleRocksDb')
      });
    }
    if (resources[0].disk.mainDb !== undefined) {
      chartData.disk.push({
        name: 'MAIN DB',
        series: this.getSeries(resources, 'disk.mainDb')
      });
    }

    chartData.xTicksValues = this.getFilteredXTicks(resources, Math.min(resources.length, isSmallDevice ? 2 : 7));

    return chartData;
  }

  private getSeries(resources: any, pathToProperty: string): { name: string; value: number }[] {
    return resources.map(resource => ({
      name: resource.timestamp,
      value: this.getValueFromNestedResourceProperty(resource, pathToProperty)
    }));
  }

  private getValueFromNestedResourceProperty(resource: any, pathToProperty: string): number {
    return pathToProperty.split('.').reduce((obj: any, property: string) => obj[property], resource);
  }

  private getFilteredXTicks(resources: any[], noOfResults: number): string[] {
    const xTicks = [];
    const delta = Math.floor(resources.length / noOfResults);
    for (let i = 0; i <= resources.length; i = i + delta) {
      if (resources[i]) {
        xTicks.push(resources[i].timestamp);
      }
    }
    return xTicks;
  }

  private createSummaryBlocks(resources: any[]): SystemResourcesSummary {
    const summary: SystemResourcesSummary = {
      disk: [],
      cpu: [],
      memory: [],
      timestamp: ''
    };
    const lastResource = resources[resources.length - 1];
    summary.timestamp = lastResource.timestamp;
    if (lastResource.memory.protocolRunners !== undefined) {
      summary.cpu.push(new SystemResourcesSummaryBlock('Total', lastResource.cpu.total, COLOR_SCHEME.domain[0], '%'));
      summary.cpu.push(new SystemResourcesSummaryBlock('Node', lastResource.cpu.node, COLOR_SCHEME.domain[1], '%'));
      summary.cpu.push(new SystemResourcesSummaryBlock('Protocol runners', lastResource.cpu.protocolRunners, COLOR_SCHEME.domain[2], '%'));
    } else {
      summary.cpu.push(new SystemResourcesSummaryBlock('Load', lastResource.cpu.node, COLOR_SCHEME.domain[0], '%'));
    }

    summary.memory.push(new SystemResourcesSummaryBlock('Total', lastResource.memory.total, COLOR_SCHEME.domain[0], 'MB'));
    summary.memory.push(new SystemResourcesSummaryBlock('Node', lastResource.memory.node.resident, COLOR_SCHEME.domain[1], 'MB'));
    if (lastResource.memory.protocolRunners !== undefined) {
      summary.memory.push(new SystemResourcesSummaryBlock(
        'Protocol runners',
        lastResource.memory.protocolRunners.resident,
        COLOR_SCHEME.domain[2],
        'MB'
      ));
    }
    if (lastResource.memory.validators !== undefined) {
      summary.memory.push(new SystemResourcesSummaryBlock(
        'Validators',
        lastResource.memory.validators.resident,
        COLOR_SCHEME.domain[2],
        'MB'
      ));
    }

    summary.disk.push(new SystemResourcesSummaryBlock('Total', lastResource.disk.total, COLOR_SCHEME.domain[0], 'GB'));
    summary.disk.push(new SystemResourcesSummaryBlock(
      'Block storage',
      lastResource.disk.blockStorage,
      COLOR_SCHEME.domain[1],
      'GB'
    ));
    summary.disk.push(new SystemResourcesSummaryBlock('Context Irmin', lastResource.disk.contextIrmin, COLOR_SCHEME.domain[2], 'GB'));
    summary.disk.push(new SystemResourcesSummaryBlock('Debugger', lastResource.disk.debugger, COLOR_SCHEME.domain[3], 'GB'));
    if (lastResource.disk.contextActions !== undefined) {
      summary.disk.push(
        new SystemResourcesSummaryBlock(
          'Context Actions',
          lastResource.disk.contextActions,
          COLOR_SCHEME.domain[4],
          'GB'
        ));
    }
    if (lastResource.disk.contextMerkleRocksDb !== undefined) {
      summary.disk.push(new SystemResourcesSummaryBlock(
        'Context Merkle Rocks DB',
        lastResource.disk.contextMerkleRocksDb,
        COLOR_SCHEME.domain[5],
        'GB'
      ));
    }

    if (lastResource.disk.mainDb !== undefined) {
      summary.disk.push(new SystemResourcesSummaryBlock('Main DB', lastResource.disk.mainDb, COLOR_SCHEME.domain[6], 'GB'));
    }

    return summary;
  }
}
