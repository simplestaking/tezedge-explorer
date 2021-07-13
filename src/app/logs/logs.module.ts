import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogsRoutingModule } from './logs.routing';
import { LogsActionComponent } from './logs-action/logs-action.component';
import { LogsComponent } from './logs/logs.component';
import { TezedgeSharedModule } from '../shared/tezedge-shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LogsComponent,
    LogsActionComponent,
  ],
  imports: [
    CommonModule,
    LogsRoutingModule,
    TezedgeSharedModule,
    MatExpansionModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ]
})
export class LogsModule { }
