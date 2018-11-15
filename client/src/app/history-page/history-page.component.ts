import { Subscription } from 'rxjs';
import { OrdersService } from './../shared/services/orders.service';
import { Order, Filter } from './../shared/interfaces';
import { MaterialInstance, MaterialService } from './../shared/classes/material.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

const STEP = 10

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
  filter: Filter = {}

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
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

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
  
  applyFilter(filter: Filter) {
    this.orders = []
    this.offset = 0
    this.reloading = true
    this.filter = filter
    this.fetch()
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0
  }

  ngAfterViewInit () {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }

  ngOnDestroy() {
    this.tooltip.destroy()
    this.oSub.unsubscribe()
  }
}
