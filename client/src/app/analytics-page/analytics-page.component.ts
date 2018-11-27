import { Subscription } from 'rxjs';
import { AnalyticsPage } from './../shared/interfaces';
import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import {Chart} from 'chart.js'

import { AnalyticsService } from './../shared/services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('orders') ordersRef: ElementRef

  average: number
  pending = true
  aSub: Subscription

  constructor(
    private service: AnalyticsService
  ) { }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    }

    const ordersConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    }

    this.aSub = this.service.getAnalytics().subscribe(
      (data: AnalyticsPage) => {
        this.average = data.average

        gainConfig.labels = data.chart.map(item => item.label)
        gainConfig.data = data.chart.map(item => item.gain)
        ordersConfig.labels = data.chart.map(item => item.label)
        ordersConfig.data = data.chart.map(item => item.orders)

        const gainContext = this.gainRef.nativeElement.getContext('2d')
        gainContext.canvas.height = '300px'

        const ordersContext = this.ordersRef.nativeElement.getContext('2d')
        ordersContext.canvas.height = '300px'

        new Chart(gainContext, createChartConfig(gainConfig))
        new Chart(ordersContext, createChartConfig(ordersConfig))
        this.pending = false
      }
    )
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}