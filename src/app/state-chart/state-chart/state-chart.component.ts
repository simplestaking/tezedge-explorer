import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-state-chart',
  templateUrl: './state-chart.component.html',
  styleUrls: ['./state-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
