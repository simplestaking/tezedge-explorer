import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { metaReducers, reducers } from './app.reducers';
import { environment } from '../environments/environment';

import { AppEffects } from './app.effects';

import { MonitoringEffects } from './monitoring/monitoring.effects';

import { MempoolActionEffects } from './mempool/mempool-action/mempool-action.effects';

import { NetworkActionEffects } from './network/network-action/network-action.effects';

import { EndpointsActionEffects } from './endpoints/endpoints-action/endpoints-action.effects';

import { LogsActionEffects } from './logs/logs-action/logs-action.effects';

import { StorageBlockEffects } from './storage/storage-block/storage-block.effects';
import { StorageActionEffects } from './storage/storage-action/storage-action.effects';
import { StorageSearchEffects } from './storage/storage-search/storage-search.effects';

import { SettingsNodeEffects } from './settings/settings-node/settings-node.effects';
import { SandboxEffects } from './sandbox/sandbox.effects';
import { WalletsEffects } from './wallets/wallets.effects';

import { NetworkComponent } from './network/network.component';
import { NetworkPeersComponent } from './network/network-peers/network-peers.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { NetworkStatsComponent } from './network/network-stats/network-stats.component';
import { NetworkHistoryComponent } from './network/network-history/network-history.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BandwidthPipe } from './shared/pipes/bandwidth.pipe';
import { NetworkActionComponent } from './network/network-action/network-action.component';
import { NetworkSearchComponent } from './network/network-search/network-search.component';
import { MonitoringComponent } from './monitoring/monitoring.component';

import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { EndpointsActionComponent } from './endpoints/endpoints-action/endpoints-action.component';
import { EndpointsSearchComponent } from './endpoints/endpoints-search/endpoints-search.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { SettingsNodeComponent } from './settings/settings-node/settings-node.component';

import { ChainComponent } from './chain/chain.component';
import { ChainServerComponent } from './chain/chain-server/chain-server.component';
import { ChainConfigComponent } from './chain/chain-config/chain-config.component';
import { ChainWalletsComponent } from './chain/chain-wallets/chain-wallets.component';
import { ChainBakingComponent } from './chain/chain-baking/chain-baking.component';
import { ChainFinishComponent } from './chain/chain-finish/chain-finish.component';

import { ChainOtherComponent } from './chain/chain-other/chain-other.component';
import { SandboxComponent } from './sandbox/sandbox.component';

import { NgrxFormDirective } from './shared/ngrx-form.directive';
import { NgrxVirtualScrollDirective } from './shared/ngrx-virtual-scroll.directive';

import { SandboxStatusBarComponent } from './sandbox/sandbox-status-bar/sandbox-status-bar.component';
import { WalletsComponent } from './wallets/wallets.component';
import { MempoolComponent } from './mempool/mempool.component';
import { MempoolActionComponent } from './mempool/mempool-action/mempool-action.component';
import { CommitNumberComponent } from './monitoring/commit-number/commit-number.component';
import { CommitNumberEffects } from './monitoring/commit-number/commit-number.effects';
import { SystemResourcesEffects } from './resources/system-resources/system-resources.effects';
import { TezedgeSharedModule } from './shared/tezedge-shared.module';
import { NavigationMenuComponent } from './layout/navigation-menu/navigation-menu.component';
import { DatePipe, registerLocaleData } from '@angular/common';
import { StorageResourcesEffects } from './resources/storage-resources/storage-resources.effects';
import { MemoryResourcesEffects } from './resources/memory-resources/memory-resources.effects';
import { IconRegisterService } from './shared/design/icon/icon-register.service';
import localeFr from '@angular/common/locales/fr';
import localeEnGb from '@angular/common/locales/en-GB';
import { ReplaceCharacterPipe } from './shared/pipes/replace-character.pipe';
import { ErrorPopupEffects } from './shared/error-popup/error-popup.effects';
import { VarDirective } from './shared/directives/var.directive';
import { MatNativeDateModule } from '@angular/material/core';

registerLocaleData(localeFr, 'fr');
registerLocaleData(localeEnGb, 'en');

function loadIcons(matIconService: IconRegisterService): Function {
  return () => matIconService.loadIcons();
}

@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    NetworkPeersComponent,
    NetworkStatsComponent,
    NetworkHistoryComponent,
    BandwidthPipe,
    NetworkActionComponent,
    NetworkSearchComponent,
    MonitoringComponent,
    EndpointsActionComponent,
    EndpointsSearchComponent,
    EndpointsComponent,
    SettingsNodeComponent,
    ChainComponent,
    ChainServerComponent,
    ChainConfigComponent,
    ChainWalletsComponent,
    ChainBakingComponent,
    ChainFinishComponent,
    ChainOtherComponent,
    NgrxFormDirective,
    NgrxVirtualScrollDirective,
    SandboxComponent,
    SandboxStatusBarComponent,
    WalletsComponent,
    MempoolComponent,
    MempoolActionComponent,
    CommitNumberComponent,
    NavigationMenuComponent,
  ],
  imports: [
    BrowserModule,
    // disable material animations
    // BrowserAnimationsModule,
    NoopAnimationsModule,
    ScrollingModule,
    HttpClientModule,
    TezedgeSharedModule,

    // loading routing
    RouterModule.forRoot(AppRouting, {
      useHash: true,
      // preload all modules
      preloadingStrategy: PreloadAllModules,
      // scroll page to top on route change
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy'
    }),

    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionWithinNgZone: true,
        strictStateSerializability: true
      }
    }),

    EffectsModule.forRoot([
      AppEffects,
      MonitoringEffects,
      MempoolActionEffects,
      NetworkActionEffects,
      StorageBlockEffects,
      StorageActionEffects,
      StorageSearchEffects,
      EndpointsActionEffects,
      LogsActionEffects,
      SettingsNodeEffects,
      SandboxEffects,
      WalletsEffects,
      CommitNumberEffects,
      SystemResourcesEffects,
      StorageResourcesEffects,
      MemoryResourcesEffects,
      ErrorPopupEffects,
    ]),

    // https://github.com/zalmoxisus/redux-devtools-extension
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatTableModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    ClipboardModule,

    FormsModule,
    ReactiveFormsModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    NgxJsonViewerModule,
    TezedgeSharedModule

  ],
  providers: [
    DatePipe,
    ReplaceCharacterPipe,
    {
      provide: APP_INITIALIZER,
      useFactory: loadIcons,
      deps: [IconRegisterService],
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: LOCALE_ID, useValue: 'en' },
  ],
  exports: [
    VarDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
