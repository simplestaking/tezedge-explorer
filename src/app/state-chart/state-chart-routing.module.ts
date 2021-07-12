import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StateChartComponent } from './state-chart/state-chart.component';

const routes: Routes = [
  {
    path: '',
    component: StateChartComponent,
    children: []
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StateChartRoutingModule {}
