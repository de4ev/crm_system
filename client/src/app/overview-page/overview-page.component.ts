import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { OverviewPage } from '../shared/interfaces';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit {

  data$: Observable<OverviewPage>

  constructor(
    private service: AnalyticsService
  ) { }

  ngOnInit() {
    this.data$ = this.service.getOverview()
  }

}
