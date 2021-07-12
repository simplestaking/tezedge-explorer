import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StateChartRoutingModule } from './state-chart-routing.module';
import { StateChartComponent } from './state-chart/state-chart.component';


@NgModule({
  declarations: [
    StateChartComponent
  ],
  imports: [
    CommonModule,
    StateChartRoutingModule
  ]
})
export class StateChartModule { }
