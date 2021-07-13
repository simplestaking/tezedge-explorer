import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage.routing';
import { TezedgeSharedModule } from '../shared/tezedge-shared.module';
import { StorageComponent } from './storage.component';
import { StorageBlockComponent } from './storage-block/storage-block.component';
import { StorageBlockDetailsComponent } from './storage-block-details/storage-block-details.component';
import { StorageActionComponent } from './storage-action/storage-action.component';
import { StorageSearchComponent } from './storage-search/storage-search.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StorageComponent,
    StorageBlockComponent,
    StorageBlockDetailsComponent,
    StorageActionComponent,
    StorageSearchComponent,
  ],
  imports: [
    CommonModule,
    StorageRoutingModule,
    TezedgeSharedModule,
    NgxJsonViewerModule,
    MatFormFieldModule,
    FormsModule,
  ]
})
export class StorageModule {}
