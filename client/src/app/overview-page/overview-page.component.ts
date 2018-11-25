import { MaterialService } from 'src/app/shared/classes/material.service';
import { MaterialInstance } from './../shared/classes/material.service';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { OverviewPage } from '../shared/interfaces';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tapTarget') tapTargetRef: ElementRef

  tapTarget: MaterialInstance
  data$: Observable<OverviewPage>
  yesterday = new Date()

  constructor(
    private service: AnalyticsService
  ) { }

  ngOnInit() {
    this.data$ = this.service.getOverview()
    this.yesterday.setDate(this.yesterday.getDate() - 1)
  }
  ngAfterViewInit() {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }

  ngOnDestroy() {
    this.tapTarget.destroy()
  }
  openInfo() {
    this.tapTarget.open()
  }
}
