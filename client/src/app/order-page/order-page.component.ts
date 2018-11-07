import { OrderPosition, Order } from './../shared/interfaces';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MaterialService, MaterialInstance } from '../shared/classes/material.service';
import { OrderService } from './order.service';
import { OrdersService } from '../shared/services/orders.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef
  isRoot: boolean
  modal: MaterialInstance

  constructor(
    private router: Router,
    private orderService: OrderService,
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.isRoot = this.router.url === '/order'
    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationEnd) {
          this.isRoot = this.router.url === '/order'
        }
      }
    )
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  open() {
    this.modal.open()
  }
  cancel() {
    this.modal.close()
  }
  submit() {

    const order: Order = {
      list: this.orderService.list.map(item => {
        delete item._id
        return item
      })
    }
    this.ordersService.create(order).subscribe(
      newOrder => {
        MaterialService.toast(`Заказ #${newOrder.order} был добавлен`)
        this.orderService.clear()
      },
      error => {
        MaterialService.toast(error.error.message)
      },
      () => {
        this.modal.close()
      }
    )
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  removePosition(orderPosition: OrderPosition) {
    this.orderService.remove(orderPosition)
  }
}
