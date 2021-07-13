import { Params, RouterStateSnapshot, Routes } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';
import { MempoolComponent } from './mempool/mempool.component';
import { NetworkComponent } from './network/network.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { ChainComponent } from './chain/chain.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { WalletsComponent } from './wallets/wallets.component';

export const AppRouting: Routes = [

  { path: 'monitoring', component: MonitoringComponent },
  {
    path: 'resources',
    loadChildren: () => import('./resources/resources.module').then(module => module.ResourcesModule)
  },

  { path: 'mempool', component: MempoolComponent },

  { path: 'network', component: NetworkComponent },
  { path: 'network/:address', component: NetworkComponent },

  { path: 'endpoints', component: EndpointsComponent },

  {
    path: 'storage',
    loadChildren: () => import('./storage/storage.module').then(module => module.StorageModule)
  },
  {
    path: 'state',
    loadChildren: () => import('./state-chart/state-chart.module').then(module => module.StateChartModule)
  },
  {
    path: 'logs',
    loadChildren: () => import('./logs/logs.module').then(module => module.LogsModule)
  },

  { path: 'chain', component: ChainComponent },

  { path: 'sandbox', component: SandboxComponent },

  { path: 'wallets', component: WalletsComponent },

  {
    path: 'open-api',
    loadChildren: () => import('./open-api/open-api.module').then(module => module.OpenApiModule)
  },
  {
    path: '',
    redirectTo: 'monitoring',
    pathMatch: 'full'
  },
  // { path: '**', component: PageNotFoundComponent }

];

// router interface
export interface RouterStateUrl {
  url: string;
  queryParams: Params;
}

// create custom router
export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const queryParams = routerState.root.queryParams;
    return { url, queryParams };
  }
}
