import { Subscription } from 'rxjs';
import { OrdersService } from './../shared/services/orders.service';
import { Order } from './../shared/interfaces';
import { MaterialInstance, MaterialService } from './../shared/classes/material.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

const STEP = 3

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})

export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef: ElementRef
  tooltip: MaterialInstance

  oSub: Subscription
  isFilterVisible = false
  loading = false
  reloading = false
  noMoreOrders = false
  orders: Order[] = []

  offset = 0
  limit = STEP

  constructor(
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.reloading = true
    this.fetch()
  }

  loadMore() {
    this.offset += STEP
    this.loading = true
    this.fetch()
  }

  fetch() {
    const params = {
      offset: this.offset,
      limit: this.limit
    }

    this.oSub = this.ordersService.fetch(params).subscribe(
      orders => {
        this.orders = this.orders.concat(orders)
        this.noMoreOrders = orders.length < STEP
        this.loading = false
        this.reloading = false
      },
      error => {
        MaterialService.toast(error.error.message)
      }
    )
  }
  
  ngAfterViewInit () {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }

  ngOnDestroy() {
    this.tooltip.destroy()
    this.oSub.unsubscribe()
  }
}
