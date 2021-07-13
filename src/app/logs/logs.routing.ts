import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { LogsActionComponent } from './logs-action/logs-action.component';

const routes: Routes = [
  {
    path: '',
    component: LogsComponent,
    children: [
      {
        path: '',
        component: LogsActionComponent
      },
    ]
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
export class LogsRoutingModule { }
